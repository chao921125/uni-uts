const ERR = {
	NOT_INIT: 10001,
	NO_DEVICE: 10002,
	CONNECT_FAIL: 10003,
	SERVICE_NOTFound: 10004,
	CHARA_NOTFound: 10005,
	WRITE_FAIL: 10006,
};

/* ========== 内部通用 ========== */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const retry = (fn, max = 3, gap = 500) => fn().catch((err) => (max > 0 ? sleep(gap).then(() => retry(fn, max - 1, gap)) : Promise.reject(err)));

/* ========== 0. 初始化适配器 ========== */
export async function openAdapter(peripheral = false) {
	const mode = peripheral ? "peripheral" : "central";
	return new Promise((resolve, reject) => {
		wx.openBluetoothAdapter({
			mode,
			success: resolve,
			fail: reject,
		});
	});
}

export async function closeAdapter() {
	return new Promise((resolve, reject) => {
		wx.closeBluetoothAdapter({ success: resolve, fail: reject });
	});
}

/* ========== 1. 扫描设备 ========== */
export function startScan(services = [], timeout = 10 * 1000) {
	return new Promise(async (resolve, reject) => {
		const list = [];
		const onFound = (res) => {
			res.devices.forEach((d) => {
				if (!list.some((x) => x.deviceId === d.deviceId)) list.push(d);
			});
		};
		wx.onBluetoothDeviceFound(onFound);
		wx.startBluetoothDevicesDiscovery({
			services,
			allowDuplicatesKey: false,
			success: () => {
				setTimeout(() => {
					wx.stopBluetoothDevicesDiscovery();
					wx.offBluetoothDeviceFound(onFound);
					resolve(list);
				}, timeout);
			},
			fail: reject,
		});
	});
}

/* ========== 2. 连接 / 断开 ========== */
export async function connect(deviceId) {
	return retry(
		() =>
			new Promise((resolve, reject) => {
				wx.createBLEConnection({
					deviceId,
					success: () => resolve(deviceId),
					fail: reject,
				});
			}),
	);
}

export async function disconnect(deviceId) {
	return new Promise((resolve, reject) => {
		wx.closeBLEConnection({ deviceId, success: resolve, fail: reject });
	});
}

/* ========== 3. 发现服务 ========== */
export async function getServices(deviceId) {
	return retry(
		() =>
			new Promise((resolve, reject) => {
				wx.getBLEDeviceServices({
					deviceId,
					success: (res) => resolve(res.services),
					fail: reject,
				});
			}),
	);
}

export async function getCharacteristics(deviceId, serviceId) {
	return retry(
		() =>
			new Promise((resolve, reject) => {
				wx.getBLEDeviceCharacteristics({
					deviceId,
					serviceId,
					success: (res) => resolve(res.characteristics),
					fail: reject,
				});
			}),
	);
}

/* ========== 4. 读写 / 通知 ========== */
export async function read(deviceId, serviceId, characteristicId) {
	return retry(
		() =>
			new Promise((resolve, reject) => {
				wx.readBLECharacteristicValue({
					deviceId,
					serviceId,
					characteristicId,
					success: (res) => resolve(res.value),
					fail: reject,
				});
			}),
	);
}

/* 队列写 + 分包（默认 20 字节） */
const writeQueue = [];
let writing = false;
async function doWrite() {
	if (writing || !writeQueue.length) return;
	writing = true;
	const { deviceId, serviceId, characteristicId, buffer, resolve, reject } = writeQueue.shift();
	try {
		await retry(
			() =>
				new Promise((res, rej) => {
					wx.writeBLECharacteristicValue({
						deviceId,
						serviceId,
						characteristicId,
						value: buffer,
						success: res,
						fail: rej,
					});
				}),
		);
		resolve();
	} catch (e) {
		reject(e);
	} finally {
		writing = false;
		doWrite();
	}
}

export async function write(deviceId, serviceId, characteristicId, arrayBuffer, mtu = 20) {
	const slices = [];
	for (let i = 0; i < arrayBuffer.byteLength; i += mtu) {
		slices.push(arrayBuffer.slice(i, i + mtu));
	}
	for (const buf of slices) {
		await new Promise((resolve, reject) => {
			writeQueue.push({ deviceId, serviceId, characteristicId, buffer: buf, resolve, reject });
			doWrite();
		});
	}
}

/* 启用 notify / indicate */
export async function notify(deviceId, serviceId, characteristicId, onChange) {
	return new Promise(async (resolve, reject) => {
		// 先订阅
		wx.onBLECharacteristicValueChange(onChange);
		// 再使能
		wx.notifyBLECharacteristicValueChange({
			deviceId,
			serviceId,
			characteristicId,
			state: true,
			success: resolve,
			fail: reject,
		});
	});
}

/* ========== 5. MTU 协商（安卓） ========== */
export async function setMTU(deviceId, mtu = 247) {
	return new Promise((resolve, reject) => {
		if (wx.setBLEMTU) {
			wx.setBLEMTU({ deviceId, mtu, success: resolve, fail: reject });
		} else {
			resolve({ mtu: 23 }); // iOS 不支持，直接回退
		}
	});
}

/* ========== 6. 一键连接 + 发现常用特征 ========== */
export async function quickConnect(deviceId, targetService = "", targetCharacteristic = "") {
	await connect(deviceId);
	const services = await getServices(deviceId);
	const service = services.find((s) => !targetService || s.uuid.includes(targetService));
	if (!service) throw new Error("目标服务未找到");
	const chars = await getCharacteristics(deviceId, service.uuid);
	const chara = chars.find((c) => !targetCharacteristic || c.uuid.includes(targetCharacteristic));
	if (!chara) throw new Error("目标特征未找到");
	return { serviceId: service.uuid, characteristicId: chara.uuid, properties: chara.properties };
}

export default { ERR, openAdapter, closeAdapter, startScan, connect, disconnect, getServices, getCharacteristics, read, write, notify, setMTU, quickConnect };

// use demo
// import BLE from '../../utils/ble-tool.js'

// Page({
//   async onLoad() {
//     try {
//       await BLE.openAdapter()                       // 1. 初始化
//       const list = await BLE.startScan([], 8 * 1000) // 2. 扫描 8 秒
//       console.log('扫描到', list)

//       const { deviceId } = list[0]
//       const { serviceId, characteristicId } = await BLE.quickConnect(deviceId, 'FFE0', 'FFE1') // 3. 一键连接

//       await BLE.notify(deviceId, serviceId, characteristicId, res => {
//         console.log('收到通知', ab2hex(res.value))
//       }) // 4. 开通知

//       const buf = hex2ab('A5010203')
//       await BLE.write(deviceId, serviceId, characteristicId, buf) // 5. 写数据
//     } catch (e) {
//       wx.showToast({ title: e.message || 'BLE 错误', icon: 'error' })
//     }
//   }
// })

// /* 简单工具 */
// function ab2hex(buffer) {
//   return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('')
// }
// function hex2ab(hex) {
//   const bytes = hex.match(/[\da-f]{2}/gi).map(h => parseInt(h, 16))
//   return new Uint8Array(bytes).buffer
// }
