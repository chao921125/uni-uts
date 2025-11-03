/**
 * UniBLEMultiManager - 支持多设备连接的 BLE 管理器
 * 每个设备由独立的 UniBLEDevice 实例管理
 */
class UniBLEDevice {
  constructor(deviceId, options = {}) {
    this.deviceId = deviceId;
    this.options = { ...options };
    this.isConnected = false;
    this.serviceId = null;
    this.writeCharacteristicId = null;
    this.notifyCharacteristicId = null;
    this.mtuSet = false;

    // 回调（外部通过 MultiManager 统一注册）
    this._onConnected = null;
    this._onDisconnected = null;
    this._onDataReceived = null;
    this._onError = null;
  }

  // 设置回调（由 MultiManager 调用）
  setCallbacks({ onConnected, onDisconnected, onDataReceived, onError }) {
    this._onConnected = onConnected;
    this._onDisconnected = onDisconnected;
    this._onDataReceived = onDataReceived;
    this._onError = onError;
  }

  _triggerCallback(fn, payload) {
    if (typeof fn === 'function') {
      fn({ ...payload, deviceId: this.deviceId });
    }
  }

  _handleError(err, context = '') {
    const msg = this._getErrorMsg(err.errCode || err.code);
    console.error(`[Device ${this.deviceId} | ${context}] ${msg}`, err);
    this._triggerCallback(this._onError, { error: err, message: msg, context });
  }

  _getErrorMsg(code) {
    const map = {
      10000: '未初始化蓝牙适配器',
      10001: '蓝牙不可用',
      10002: '未找到设备',
      10003: '连接失败',
      10004: '服务未找到',
      10005: '特征值未找到',
      10006: '连接已断开',
      10007: '特征值不支持操作',
      10008: '系统错误',
      10009: '不支持 BLE',
      10012: '操作超时',
    };
    return map[code] || `未知错误(${code})`;
  }

  async connect(serviceUUID = null) {
    if (this.isConnected) return;
    return new Promise((resolve, reject) => {
      uni.createBLEConnection({
        deviceId: this.deviceId,
        timeout: this.options.timeout || 10000,
        success: async () => {
          this.isConnected = true;
          this._listenConnectionState();
          try {
            await this._setupServices(serviceUUID);
            if (this.options.mtu > 23) await this._setMTU(this.options.mtu);
            this._triggerCallback(this._onConnected, {});
            resolve();
          } catch (err) {
            this._handleError(err, '服务配置失败');
            await this.disconnect();
            reject(err);
          }
        },
        fail: (err) => {
          this._handleError(err, '连接失败');
          reject(err);
        }
      });
    });
  }

  _listenConnectionState() {
    uni.onBLEConnectionStateChange((res) => {
      if (res.deviceId === this.deviceId && !res.connected) {
        this._handleDisconnect('连接意外断开');
      }
    });
  }

  async _setupServices(preferredServiceUUID = null) {
    const services = await this._getServices();
    let targetService = null;
    if (preferredServiceUUID) {
      targetService = services.find(s =>
        s.uuid.toUpperCase() === preferredServiceUUID.toUpperCase()
      );
    }
    if (!targetService) targetService = services.find(s => s.isPrimary) || services[0];
    if (!targetService) throw new Error('未找到有效服务');

    this.serviceId = targetService.uuid;
    const characteristics = await this._getCharacteristics();

    const writeChar = characteristics.find(c => c.properties.write);
    if (writeChar) this.writeCharacteristicId = writeChar.uuid;

    const notifyChar = characteristics.find(c => c.properties.notify || c.properties.indicate);
    if (notifyChar) {
      this.notifyCharacteristicId = notifyChar.uuid;
      await this._enableNotify();
    }
  }

  async _getServices() {
    return new Promise((resolve, reject) => {
      uni.getBLEDeviceServices({
        deviceId: this.deviceId,
        success: (res) => resolve(res.services || []),
        fail: reject
      });
    });
  }

  async _getCharacteristics() {
    return new Promise((resolve, reject) => {
      uni.getBLEDeviceCharacteristics({
        deviceId: this.deviceId,
        serviceId: this.serviceId,
        success: (res) => resolve(res.characteristics || []),
        fail: reject
      });
    });
  }

  async _enableNotify() {
    return new Promise((resolve, reject) => {
      uni.notifyBLECharacteristicValueChange({
        deviceId: this.deviceId,
        serviceId: this.serviceId,
        characteristicId: this.notifyCharacteristicId,
        state: true,
        success: () => {
          this._listenCharacteristicValue();
          resolve();
        },
        fail: reject
      });
    });
  }

  _listenCharacteristicValue() {
    uni.onBLECharacteristicValueChange((res) => {
      if (res.deviceId !== this.deviceId) return;
      const hex = this._ab2hex(res.value);
      this._triggerCallback(this._onDataReceived, {
        hex,
        buffer: res.value,
        serviceId: res.serviceId,
        characteristicId: res.characteristicId
      });
    });
  }

  async _setMTU(mtu) {
    if (typeof uni.setBLEMTU !== 'function') return;
    try {
      await new Promise((resolve, reject) => {
        uni.setBLEMTU({ deviceId: this.deviceId, mtu, success: resolve, fail: reject });
      });
      this.mtuSet = true;
    } catch (e) {
      console.warn('MTU 设置失败', e);
    }
  }

  _handleDisconnect(reason) {
    this.isConnected = false;
    this._triggerCallback(this._onDisconnected, { reason });
  }

  async writeHex(hexString) {
    if (!this.isConnected) throw new Error('设备未连接');
    if (!this.writeCharacteristicId) throw new Error('无可写特征值');
    const buffer = this._hexStringToArrayBuffer(hexString);
    return new Promise((resolve, reject) => {
      uni.writeBLECharacteristicValue({
        deviceId: this.deviceId,
        serviceId: this.serviceId,
        characteristicId: this.writeCharacteristicId,
        value: buffer,
        success: resolve,
        fail: reject
      });
    });
  }

  async disconnect() {
    if (!this.isConnected) return;
    return new Promise(resolve => {
      uni.closeBLEConnection({
        deviceId: this.deviceId,
        complete: () => {
          this.isConnected = false;
          resolve();
        }
      });
    });
  }

  _ab2hex(buffer) {
    return Array.prototype.map.call(new Uint8Array(buffer), b => ('00' + b.toString(16)).slice(-2)).join('');
  }

  _hexStringToArrayBuffer(hex) {
    const match = hex.match(/[\da-fA-F]{2}/g);
    if (!match) throw new Error('无效的十六进制字符串');
    const buf = new ArrayBuffer(match.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < match.length; i++) {
      view[i] = parseInt(match[i], 16);
    }
    return buf;
  }
}

// ==================== 全局多设备管理器 ====================

class UniBLEMultiManager {
  constructor(options = {}) {
    this.options = {
      autoInit: true,
      ...options
    };
    this.adapterInited = false;
    this.devices = new Map(); // deviceId => UniBLEDevice

    // 全局回调（所有设备共用，通过 deviceId 区分）
    this._globalOnConnected = null;
    this._globalOnDisconnected = null;
    this._globalOnDataReceived = null;
    this._globalOnError = null;

    if (this.options.autoInit) {
      this.init().catch(console.error);
    }
  }

  async init() {
    if (this.adapterInited) return;
    return new Promise((resolve, reject) => {
      uni.openBluetoothAdapter({
        success: () => {
          console.log('✅ 蓝牙适配器已初始化');
          this.adapterInited = true;
          this._listenAdapterState();
          resolve();
        },
        fail: (err) => {
          console.error('❌ 蓝牙初始化失败', err);
          reject(err);
        }
      });
    });
  }

  _listenAdapterState() {
    uni.onBluetoothAdapterStateChange((res) => {
      if (!res.available) {
        console.warn('蓝牙适配器不可用，断开所有设备');
        this.disconnectAll();
      }
    });
  }

  // ==================== 设备发现 ====================

  async discoverDevices(serviceUUIDs = [], duration = 5000) {
    await this.init();
    await this._stopDiscovery();

    return new Promise((resolve) => {
      const found = new Map();
      const timeout = setTimeout(() => {
        this._stopDiscovery().finally(() => resolve(Array.from(found.values())));
      }, duration);

      uni.onBluetoothDeviceFound((res) => {
        res.devices?.forEach(device => {
          if (!found.has(device.deviceId)) {
            found.set(device.deviceId, device);
          }
        });
      });

      uni.startBluetoothDevicesDiscovery({
        services: serviceUUIDs,
        success: () => console.log('🔍 开始搜索设备...'),
        fail: (err) => {
          console.warn('搜索失败', err);
          clearTimeout(timeout);
          resolve([]);
        }
      });
    });
  }

  async _stopDiscovery() {
    return new Promise(resolve => uni.stopBluetoothDevicesDiscovery({ complete: resolve }));
  }

  // ==================== 设备连接管理 ====================

  getDevice(deviceId) {
    return this.devices.get(deviceId);
  }

  isConnected(deviceId) {
    const dev = this.getDevice(deviceId);
    return dev ? dev.isConnected : false;
  }

  async connect(deviceId, serviceUUID = null, deviceOptions = {}) {
    await this.init();
    if (this.devices.has(deviceId)) {
      const dev = this.devices.get(deviceId);
      if (dev.isConnected) {
        console.warn('⚠️ 设备已连接');
        return;
      }
      // 重新连接
      await dev.connect(serviceUUID);
      return;
    }

    const device = new UniBLEDevice(deviceId, deviceOptions);
    device.setCallbacks({
      onConnected: (data) => this._globalOnConnected?.({ ...data, deviceId }),
      onDisconnected: (data) => this._globalOnDisconnected?.({ ...data, deviceId }),
      onDataReceived: (data) => this._globalOnDataReceived?.({ ...data, deviceId }),
      onError: (data) => this._globalOnError?.({ ...data, deviceId })
    });

    this.devices.set(deviceId, device);
    await device.connect(serviceUUID);
  }

  async disconnect(deviceId) {
    const dev = this.devices.get(deviceId);
    if (dev) {
      await dev.disconnect();
      // 注意：不自动删除实例，保留状态供重连
    }
  }

  async disconnectAll() {
    const promises = [];
    for (const [id, dev] of this.devices) {
      if (dev.isConnected) {
        promises.push(dev.disconnect());
      }
    }
    await Promise.allSettled(promises);
  }

  async destroy() {
    await this.disconnectAll();
    if (this.adapterInited) {
      uni.closeBluetoothAdapter({ complete: () => {} });
      this.adapterInited = false;
    }
    this.devices.clear();
  }

  // ==================== 数据操作 ====================

  async writeHex(deviceId, hexString) {
    const dev = this.getDevice(deviceId);
    if (!dev) throw new Error('设备未注册');
    return dev.writeHex(hexString);
  }

  // ==================== 回调注册 ====================

  onConnected(callback) {
    this._globalOnConnected = typeof callback === 'function' ? callback : null;
  }

  onDisconnected(callback) {
    this._globalOnDisconnected = typeof callback === 'function' ? callback : null;
  }

  onDataReceived(callback) {
    this._globalOnDataReceived = typeof callback === 'function' ? callback : null;
  }

  onError(callback) {
    this._globalOnError = typeof callback === 'function' ? callback : null;
  }

  // ==================== 工具 ====================

  getConnectedDevices() {
    return Array.from(this.devices.values()).filter(d => d.isConnected);
  }

  getAllDeviceIds() {
    return Array.from(this.devices.keys());
  }
}

export default UniBLEMultiManager;