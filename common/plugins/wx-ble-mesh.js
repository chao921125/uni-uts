const PLUGIN_ID = 'wx013447465d3aa024'
let plugin = null
let meshMgr = null
let provMgr = null
let proxyMgr = null
let netMgr = null

/* ========== 内部通用 ========== */
const sleep = ms => new Promise(r => setTimeout(r, ms))

const retry = (fn, max = 3, gap = 500) =>
  fn().catch(err => (max > 0 ? sleep(gap).then(() => retry(fn, max - 1, gap)) : Promise.reject(err)))

/* ========== 初始化 ========== */
function initPlugin() {
  if (plugin) return Promise.resolve(plugin)
  return new Promise((resolve, reject) => {
    plugin = requirePlugin(PLUGIN_ID)
    if (!plugin) return reject(new Error('插件加载失败'))
    resolve(plugin)
  })
}

async function initManagers() {
  await initPlugin()
  meshMgr = plugin.meshBLEManager
  provMgr = plugin.provisioningManager
  proxyMgr = plugin.proxyClientManager
  netMgr = plugin.meshNetworkManager
}

/* ========== 1. 扫描设备 ========== */
export function startScan(timeout = 10 * 1000) {
  return new Promise(async (resolve, reject) => {
    await initManagers()
    const list = []
    const onFound = res => list.push(res.device)
    meshMgr.onMeshDeviceFound(onFound)
    meshMgr.startScanMeshDevice()
    setTimeout(() => {
      meshMgr.stopScanMeshDevice()
      meshMgr.offMeshDeviceFound(onFound)
      resolve(list)
    }, timeout)
  })
}

/* ========== 2. 创建 / 导入 网络 ========== */
export async function createNetwork(netName = 'default') {
  await initManagers()
  return retry(() => plugin.createMeshNetwork(netName))
}

export async function importNetwork(encryptData) {
  await initManagers()
  return retry(() => plugin.importMeshNetworks(encryptData))
}

export async function exportNetwork() {
  await initManagers()
  return retry(() => plugin.exportMeshNetworks())
}

export async function getNetworks() {
  await initManagers()
  return retry(() => plugin.getMeshNetworks())
}

/* ========== 3. 配网 ========== */
export async function provision(device, netKeyIndex = 0) {
  await initManagers()
  return retry(() => provMgr.provision(device, netKeyIndex))
}

export async function batchProvision(devices, netKeyIndex = 0) {
  await initManagers()
  return retry(() => provMgr.batchProvision(devices, netKeyIndex))
}

/* ========== 4. 代理通信 ========== */
export async function sendMessage(nodeAddr, opcode, params, appKeyIndex = 0) {
  await initManagers()
  // 先确认周围有代理节点
  const hasProxy = await retry(() => proxyMgr.hasProxyServer())
  if (!hasProxy) throw new Error('附近无可用代理节点')
  // 绑定 AppKey 到模型（如未绑定过）
  await retry(() => proxyMgr.addAppKeyToNode(nodeAddr, appKeyIndex))
  await retry(() => proxyMgr.bindAppKeyToModel(nodeAddr, 0x1000, appKeyIndex)) // 0x1000=通用ONOFF模型
  // 发送消息
  return retry(() => proxyMgr.sendMeshMessage(nodeAddr, opcode, params))
}

/* ========== 5. 群组管理 ========== */
export async function createGroup(addrName) {
  await initManagers()
  return retry(() => netMgr.createGroup(addrName))
}

export async function getGroups() {
  await initManagers()
  return retry(() => netMgr.getGroups())
}

/* ========== 6. 统一错误码 ========== */
export const ERR = {
  PLUGIN_NOT_FOUND: 10001,
  SCAN_TIMEOUT: 10002,
  PROV_FAIL: 10003,
  PROXY_NOT_FOUND: 10004
}
// use demo
// import * as Mesh from '../../utils/mesh-tool.js'

// Page({
//   async onLoad() {
//     try {
//       // 1. 扫描 10 秒
//       const devices = await Mesh.startScan(10 * 1000)
//       console.log('扫描到', devices)

//       // 2. 创建网络
//       const net = await Mesh.createNetwork('myHome')
//       console.log('网络已创建', net)

//       // 3. 给第一台设备配网
//       const node = await Mesh.provision(devices[0])
//       console.log('配网完成', node)

//       // 4. 开关灯（通用 ONOFF 模型）
//       await Mesh.sendMessage(node.unicastAddress, 0x8202, { onoff: 1 })
//       console.log('已开灯')
//     } catch (e) {
//       wx.showToast({ title: e.message || 'Mesh 错误', icon: 'error' })
//     }
//   }
// })
