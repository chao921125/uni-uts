/**
 * uni-app BLE 工具类
 * 兼容 App、微信、飞书、京东、支付宝小程序
 * 作者：kimi@example.com
 * 版本：1.4.0
 */
const ERR = {
  NOT_INIT: 10000,
  NOT_AVAILABLE: 10001,
  NO_DEVICE: 10002,
  CONNECT_FAIL: 10003,
  NO_SERVICE: 10004,
  NO_CHARACTERISTIC: 10005,
  NO_CONNECTION: 10006,
  PROPERTY_NOT_SUPPORT: 10007,
  SYSTEM_ERROR: 10008,
  TIMEOUT: 10012
}

/* ========== 内部通用 ========== */
const sleep = ms => new Promise(r => setTimeout(r, ms))

const retry = (fn, max = 3, gap = 500) =>
  fn().catch(err => (max > 0 ? sleep(gap).then(() => retry(fn, max - 1, gap)) : Promise.reject(err)))

/* ========== 0. 适配器 ========== */
export async function openAdapter() {
  return new Promise((resolve, reject) => {
    uni.openBluetoothAdapter({ success: resolve, fail: reject })
  })
}

export async function closeAdapter() {
  return new Promise((resolve, reject) => {
    uni.closeBluetoothAdapter({ success: resolve, fail: reject })
  })
}

export async function getAdapterState() {
  return new Promise((resolve, reject) => {
    uni.getBluetoothAdapterState({ success: res => resolve(res), fail: reject })
  })
}

/* ========== 1. 扫描 ========== */
export function startScan(options = {}) {
  const { services = [], allowDuplicates = false, timeout = 10 * 1000 } = options
  return new Promise(async (resolve, reject) => {
    const list = []
    const onFound = res => {
      res.devices.forEach(d => {
        if (!list.some(x => x.deviceId === d.deviceId)) list.push(d)
      })
    }
    uni.onBluetoothDeviceFound(onFound)
    uni.startBluetoothDevicesDiscovery({
      services,
      allowDuplicatesKey: allowDuplicates,
      success: () => {
        setTimeout(() => {
          uni.stopBluetoothDevicesDiscovery()
          uni.offBluetoothDeviceFound(onFound)
          resolve(list)
        }, timeout)
      },
      fail: reject
    })
  })
}

/* ========== 2. 连接 ========== */
export async function connect(deviceId) {
  return retry(() =>
    new Promise((resolve, reject) => {
      uni.createBLEConnection({
        deviceId,
        success: () => resolve(deviceId),
        fail: reject
      })
    })
  )
}

export async function disconnect(deviceId) {
  return new Promise((resolve, reject) => {
    uni.closeBLEConnection({ deviceId, success: resolve, fail: reject })
  })
}

/* ========== 3. 服务/特征 ========== */
export async function getServices(deviceId) {
  return retry(() =>
    new Promise((resolve, reject) => {
      uni.getBLEDeviceServices({
        deviceId,
        success: res => resolve(res.services),
        fail: reject
      })
    })
  )
}

export async function getCharacteristics(deviceId, serviceId) {
  return retry(() =>
    new Promise((resolve, reject) => {
      uni.getBLEDeviceCharacteristics({
        deviceId,
        serviceId,
        success: res => resolve(res.characteristics),
        fail: reject
      })
    })
  )
}

/* ========== 4. 读写/通知 ========== */
export async function read(deviceId, serviceId, characteristicId) {
  return retry(() =>
    new Promise((resolve, reject) => {
      uni.readBLECharacteristicValue({
        deviceId,
        serviceId,
        characteristicId,
        success: res => resolve(res.value),
        fail: reject
      })
    })
  )
}

/* 队列写 + 分包 */
const writeQueue = []
let writing = false
async function doWrite() {
  if (writing || !writeQueue.length) return
  writing = true
  const { deviceId, serviceId, characteristicId, buffer, resolve, reject } = writeQueue.shift()
  try {
    await retry(() =>
      new Promise((res, rej) => {
        uni.writeBLECharacteristicValue({
          deviceId,
          serviceId,
          characteristicId,
          value: buffer,
          success: res,
          fail: rej
        })
      })
    )
    resolve()
  } catch (e) {
    reject(e)
  } finally {
    writing = false
    doWrite()
  }
}

export async function write(deviceId, serviceId, characteristicId, arrayBuffer, mtu = 20) {
  const slices = []
  for (let i = 0; i < arrayBuffer.byteLength; i += mtu) {
    slices.push(arrayBuffer.slice(i, i + mtu))
  }
  for (const buf of slices) {
    await new Promise((resolve, reject) => {
      writeQueue.push({ deviceId, serviceId, characteristicId, buffer: buf, resolve, reject })
      doWrite()
    })
  }
}

/* 启用 notify */
export async function notify(deviceId, serviceId, characteristicId, onChange) {
  return new Promise(async (resolve, reject) => {
    uni.onBLECharacteristicValueChange(onChange)
    uni.notifyBLECharacteristicValueChange({
      deviceId,
      serviceId,
      characteristicId,
      state: true,
      success: resolve,
      fail: reject
    })
  })
}

/* ========== 5. MTU 协商（App 端支持） ========== */
export async function setMTU(deviceId, mtu = 247) {
  return new Promise((resolve, reject) => {
    if (uni.setBLEMTU) {
      uni.setBLEMTU({ deviceId, mtu, success: resolve, fail: reject })
    } else {
      resolve({ mtu: 23 }) // 小程序端无此 API
    }
  })
}

/* ========== 6. 一键连接+发现特征 ========== */
export async function quickConnect(deviceId, targetService = '', targetCharacteristic = '') {
  await connect(deviceId)
  const services = await getServices(deviceId)
  const service = services.find(s => !targetService || s.uuid.includes(targetService))
  if (!service) throw new Error('目标服务未找到')
  const chars = await getCharacteristics(deviceId, service.uuid)
  const chara = chars.find(c => !targetCharacteristic || c.uuid.includes(targetCharacteristic))
  if (!chara) throw new Error('目标特征未找到')
  return { serviceId: service.uuid, characteristicId: chara.uuid, properties: chara.properties }
}

/* ========== 7. 已连接设备 ========== */
export async function getConnectedDevices(services) {
  return new Promise((resolve, reject) => {
    uni.getConnectedBluetoothDevices({
      services,
      success: res => resolve(res.devices),
      fail: reject
    })
  })
}

export default { ERR, openAdapter, closeAdapter, getAdapterState, startScan, connect, disconnect, getServices, getCharacteristics, read, write, notify, setMTU, quickConnect, getConnectedDevices }

// import BLE from '@/utils/ble-uni.js'

// // 1. 初始化
// await BLE.openAdapter()

// // 2. 扫描 8 秒
// const list = await BLE.startScan({ services: ['FFE0'], timeout: 8000 })
// console.log('扫描到', list)

// // 3. 一键连接
// const { deviceId } = list[0]
// const { serviceId, characteristicId } = await BLE.quickConnect(deviceId, 'FFE0', 'FFE1')

// // 4. 开通知
// await BLE.notify(deviceId, serviceId, characteristicId, res => {
//   console.log('收到', ab2hex(res.value))
// })

// // 5. 写数据
// const buf = hex2ab('A5010203')
// await BLE.write(deviceId, serviceId, characteristicId, buf)

// /* 简单工具 */
// function ab2hex(buffer) {
//   return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('')
// }
// function hex2ab(hex) {
//   const bytes = hex.match(/[\da-f]{2}/gi).map(h => parseInt(h, 16))
//   return new Uint8Array(bytes).buffer
// }
