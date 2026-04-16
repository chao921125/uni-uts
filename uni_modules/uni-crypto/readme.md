# uni-crypto 使用文档

## 📋 目录

- [插件简介](#插件简介)
- [功能特性](#功能特性)
- [平台支持](#平台支持)
- [快速开始](#快速开始)
- [API 文档](#api-文档)
  - [国密算法 (SM2/SM3/SM4)](#国密算法-sm2sm3sm4)
  - [国际标准算法 (AES/SHA)](#国际标准算法-aessha)
- [代码示例](#代码示例)
- [常见问题](#常见问题)
- [技术架构](#技术架构)

---

## 插件简介

**uni-crypto** 是一个高性能的加密算法库插件，专为 uni-app 和 uni-app-x 设计，支持：

- **国密算法**：SM2（非对称加密/签名）、SM3（哈希）、SM4（对称加密）
- **国际标准算法**：AES、SHA-256、MD5

**设计理念：**
- API 设计与 **Web Crypto API** 和 **sm-crypto** npm 包完全一致
- 无缝迁移：Web 端代码可直接移植到 uni-app-x
- 三端统一：Web、Android、iOS 使用相同的 API

---

## 功能特性

### ✅ 国密算法支持

| 算法 | 功能 | 密钥长度 | 用途 |
|------|------|---------|------|
| **SM2** | 非对称加密/签名 | 公钥 256 位 / 私钥 256 位 | 加密、解密、签名、验签 |
| **SM3** | 哈希算法 | - | 生成 256 位摘要 |
| **SM4** | 对称加密 | 128 位 | ECB/CBC 模式加密解密 |

### ✅ 国际标准算法支持

| 算法 | 功能 | 密钥长度 | 模式 |
|------|------|---------|------|
| **AES** | 对称加密 | 128/192/256 位 | CBC、GCM |
| **SHA** | 哈希算法 | - | SHA-256、SHA-384、SHA-512 |
| **MD5** | 哈希算法 | - | 128 位摘要 |


## 快速开始

### 1. 安装插件

将 `uni_modules/uni-crypto` 目录复制到你的项目中。

### 2. 导入插件

```typescript
import crypto from '@/uni_modules/uni-crypto/index.uts'
```

### 3. 基本使用

```typescript
// SM3 哈希
const hash = crypto.sm3('Hello World')
console.log('SM3 哈希:', hash)

// SM2 加密
const keyPair = crypto.sm2.generateKeyPairHex()
const encrypted = crypto.sm2.doEncrypt('Secret Message', keyPair.publicKey)
const decrypted = crypto.sm2.doDecrypt(encrypted, keyPair.privateKey)

// SM4 加密
const key = '0123456789abcdef0123456789abcdef' // 32 个 hex 字符
const ciphertext = crypto.sm4.encrypt('Hello', key)
const plaintext = crypto.sm4.decrypt(ciphertext, key)
```

---

## API 文档

### 国密算法 (SM2/SM3/SM4)

#### SM3 - 哈希算法

SM3 是中国国家密码管理局发布的哈希算法，输出 256 位摘要。

**函数签名：**
```typescript
crypto.sm3(msg: string, options?: SM3Options): string
```

**参数：**
- `msg`: 待哈希的消息（字符串）
- `options`: 可选配置
- `inputEncoding`: 输入编码，`'text'`（默认）或 `'hex'`

**返回值：** 64 个字符的 hex 字符串（256 位）

**示例：**
```typescript
// 基本使用
const hash = crypto.sm3('Hello World')
console.log(hash) // 输出: 64 个 hex 字符

// Hex 输入
const hexHash = crypto.sm3('48656c6c6f', { inputEncoding: 'hex' })
```

---

#### SM2 - 非对称加密/签名

SM2 是中国国家密码管理局发布的椭圆曲线公钥密码算法。

##### 1. 生成密钥对

```typescript
crypto.sm2.generateKeyPairHex(): SM2KeyPairHex
```

**返回值：**
```typescript
{
  publicKey: string,  // 130 个 hex 字符（65 字节，含 04 前缀）
  privateKey: string  // 64 个 hex 字符（32 字节）
}
```

**示例：**
```typescript
const keyPair = crypto.sm2.generateKeyPairHex()
console.log('公钥:', keyPair.publicKey)  // 130 字符
console.log('私钥:', keyPair.privateKey) // 64 字符
```

##### 2. 加密

```typescript
crypto.sm2.doEncrypt(msg: string, publicKey: string, cipherMode?: number): string
```

**参数：**
- `msg`: 待加密消息（字符串）
- `publicKey`: 公钥（130 个 hex 字符）
- `cipherMode`: 加密模式，默认 `1`（C1C3C2）

**返回值：** 密文（hex 字符串）

**示例：**
```typescript
const encrypted = crypto.sm2.doEncrypt('Secret Message', keyPair.publicKey)
console.log('密文:', encrypted)
```

##### 3. 解密

```typescript
crypto.sm2.doDecrypt(cipherText: string, privateKey: string, cipherMode?: number): string
```

**参数：**
- `cipherText`: 密文（hex 字符串）
- `privateKey`: 私钥（64 个 hex 字符）
- `cipherMode`: 加密模式，默认 `1`（C1C3C2）

**返回值：** 明文（字符串）

**示例：**
```typescript
const decrypted = crypto.sm2.doDecrypt(encrypted, keyPair.privateKey)
console.log('明文:', decrypted) // 输出: Secret Message
```

##### 4. 签名

```typescript
crypto.sm2.doSignature(msg: string, privateKey: string, options?: any): string
```

**参数：**
- `msg`: 待签名消息（字符串）
- `privateKey`: 私钥（64 个 hex 字符）
- `options`: 签名选项（可选）

**返回值：** 签名（128 个 hex 字符）

**示例：**
```typescript
const signature = crypto.sm2.doSignature('Hello World', keyPair.privateKey)
console.log('签名:', signature) // 128 字符
```

##### 5. 验证签名

```typescript
crypto.sm2.doVerifySignature(msg: string, signHex: string, publicKey: string, options?: any): boolean
```

**参数：**
- `msg`: 原始消息（字符串）
- `signHex`: 签名（128 个 hex 字符）
- `publicKey`: 公钥（130 个 hex 字符）
- `options`: 验证选项（可选）

**返回值：** `true` 表示验签成功，`false` 表示失败

**示例：**
```typescript
const isValid = crypto.sm2.doVerifySignature('Hello World', signature, keyPair.publicKey)
console.log('验签结果:', isValid) // true
```

---

#### SM4 - 对称加密

SM4 是中国国家密码管理局发布的分组密码算法，密钥长度 128 位。

##### 1. ECB 模式加密

```typescript
crypto.sm4.encrypt(msg: string, key: string, options?: SM4EncryptOptions): string
```

**参数：**
- `msg`: 待加密消息（字符串或 hex 字符串）
- `key`: 密钥（32 个 hex 字符 = 16 字节）
- `options`: 可选配置
  - `inputEncoding`: 输入编码，`'text'`（默认）或 `'hex'`
  - `outputEncoding`: 输出编码，`'hex'`（默认）或 `'base64'`

**返回值：** 密文（hex 或 base64 字符串）

**示例：**
```typescript
const key = '0123456789abcdef0123456789abcdef'
const ciphertext = crypto.sm4.encrypt('Hello World', key)
console.log('密文:', ciphertext)
```

##### 2. ECB 模式解密

```typescript
crypto.sm4.decrypt(cipherText: string, key: string, options?: SM4DecryptOptions): string
```

**参数：**
- `cipherText`: 密文（hex 或 base64 字符串）
- `key`: 密钥（32 个 hex 字符）
- `options`: 可选配置
  - `inputEncoding`: 输入编码，`'hex'`（默认）或 `'base64'`
  - `outputEncoding`: 输出编码，`'text'`（默认）或 `'hex'`

**返回值：** 明文（字符串）

**示例：**
```typescript
const plaintext = crypto.sm4.decrypt(ciphertext, key)
console.log('明文:', plaintext) // Hello World
```

##### 3. CBC 模式加密

```typescript
crypto.sm4.encryptCBC(msg: string, key: string, iv: string, options?: SM4EncryptOptions): string
```

**参数：**
- `msg`: 待加密消息
- `key`: 密钥（32 个 hex 字符）
- `iv`: 初始化向量（32 个 hex 字符 = 16 字节）
- `options`: 可选配置（同 ECB）

**示例：**
```typescript
const key = '0123456789abcdef0123456789abcdef'
const iv = '00000000000000000000000000000000'
const ciphertext = crypto.sm4.encryptCBC('Hello World', key, iv)
```

##### 4. CBC 模式解密

```typescript
crypto.sm4.decryptCBC(cipherText: string, key: string, iv: string, options?: SM4DecryptOptions): string
```

**参数：**
- `cipherText`: 密文
- `key`: 密钥（32 个 hex 字符）
- `iv`: 初始化向量（32 个 hex 字符）
- `options`: 可选配置（同 ECB）

**示例：**
```typescript
const plaintext = crypto.sm4.decryptCBC(ciphertext, key, iv)
console.log('明文:', plaintext) // Hello World
```

---

### 国际标准算法 (AES/SHA)

uni-crypto 提供了与 **Web Crypto API** 完全兼容的接口。

#### SubtleCrypto API

通过 `crypto.subtle` 访问标准加密算法：

```typescript
const subtle = crypto.subtle
```

#### SHA-256 哈希

```typescript
// 1. 将字符串转为 Uint8Array
const encoder = new TextEncoder()
const data = encoder.encode('Hello World')

// 2. 计算哈希
const hashBuffer = await crypto.subtle.digest('SHA-256', data)

// 3. 转换为 hex 字符串
const hashArray = Array.from(new Uint8Array(hashBuffer))
const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
console.log('SHA-256:', hashHex)
```

#### AES-CBC 加密/解密

```typescript
// 1. 生成密钥
const key = await crypto.subtle.generateKey(
  { name: 'AES-CBC', length: 256 },
  true,
  ['encrypt', 'decrypt']
)

// 2. 生成 IV
const iv = crypto.getRandomValues(new Uint8Array(16))

// 3. 加密
const encoder = new TextEncoder()
const data = encoder.encode('Secret Message')
const encrypted = await crypto.subtle.encrypt(
  { name: 'AES-CBC', iv: iv },
  key,
  data
)

// 4. 解密
const decrypted = await crypto.subtle.decrypt(
  { name: 'AES-CBC', iv: iv },
  key,
  encrypted
)
const decoder = new TextDecoder()
const plaintext = decoder.decode(decrypted)
console.log('明文:', plaintext)
```

#### AES-GCM 加密/解密

```typescript
// 1. 生成密钥
const key = await crypto.subtle.generateKey(
  { name: 'AES-GCM', length: 256 },
  true,
  ['encrypt', 'decrypt']
)

// 2. 生成 IV（GCM 推荐 12 字节）
const iv = crypto.getRandomValues(new Uint8Array(12))

// 3. 加密
const encoder = new TextEncoder()
const data = encoder.encode('Secret Message')
const encrypted = await crypto.subtle.encrypt(
  { name: 'AES-GCM', iv: iv },
  key,
  data
)

// 4. 解密
const decrypted = await crypto.subtle.decrypt(
  { name: 'AES-GCM', iv: iv },
  key,
  encrypted
)
```

---

## 代码示例

### 完整示例：SM2 加密通信

```typescript
<script setup lang="uts">
import crypto from '@/uni_modules/uni-crypto/index.uts'

// 1. 生成密钥对
const keyPair = crypto.sm2.generateKeyPairHex()
console.log('公钥:', keyPair.publicKey)
console.log('私钥:', keyPair.privateKey)

// 2. 加密消息
const message = 'This is a secret message!'
const encrypted = crypto.sm2.doEncrypt(message, keyPair.publicKey)
console.log('密文:', encrypted)

// 3. 解密消息
const decrypted = crypto.sm2.doDecrypt(encrypted, keyPair.privateKey)
console.log('明文:', decrypted)

// 验证
console.log('加密解密成功:', message === decrypted)
</script>
```

### 完整示例：SM2 数字签名

```typescript
<script setup lang="uts">
import crypto from '@/uni_modules/uni-crypto/index.uts'

// 1. 生成密钥对
const keyPair = crypto.sm2.generateKeyPairHex()

// 2. 签名
const document = 'Important contract content...'
const signature = crypto.sm2.doSignature(document, keyPair.privateKey)
console.log('签名:', signature)

// 3. 验证签名
const isValid = crypto.sm2.doVerifySignature(
  document,
  signature,
  keyPair.publicKey
)
console.log('签名验证:', isValid ? '✅ 有效' : '❌ 无效')

// 4. 篡改测试
const tamperedDoc = 'Important contract content... (modified)'
const isTamperedValid = crypto.sm2.doVerifySignature(
  tamperedDoc,
  signature,
  keyPair.publicKey
)
console.log('篡改后验证:', isTamperedValid ? '✅ 有效' : '❌ 无效')
</script>
```

### 完整示例：SM4 文件加密

```typescript
<script setup lang="uts">
import crypto from '@/uni_modules/uni-crypto/index.uts'

// 1. 生成随机密钥（实际使用中应安全存储）
const keyBytes = crypto.getRandomValues(new Uint8Array(16))
const key = Array.from(keyBytes).map(b => b.toString(16).padStart(2, '0')).join('')
console.log('密钥:', key)

// 2. 生成随机 IV（CBC 模式）
const ivBytes = crypto.getRandomValues(new Uint8Array(16))
const iv = Array.from(ivBytes).map(b => b.toString(16).padStart(2, '0')).join('')

// 3. 加密文件内容
const fileContent = 'This is the content of my file...'
const encrypted = crypto.sm4.encryptCBC(fileContent, key, iv)
console.log('加密后:', encrypted)

// 4. 解密文件内容
const decrypted = crypto.sm4.decryptCBC(encrypted, key, iv)
console.log('解密后:', decrypted)

// 验证
console.log('文件加密解密成功:', fileContent === decrypted)
</script>
```

### 完整示例：SM3 数据完整性校验

```typescript
<script setup lang="uts">
import crypto from '@/uni_modules/uni-crypto/index.uts'

// 1. 计算数据哈希
const data = 'Important data to verify'
const hash = crypto.sm3(data)
console.log('数据哈希:', hash)

// 2. 模拟数据传输后验证
const receivedData = 'Important data to verify'
const receivedHash = crypto.sm3(receivedData)

// 3. 验证完整性
if (hash === receivedHash) {
  console.log('✅ 数据完整，未被篡改')
} else {
  console.log('❌ 数据已被篡改！')
}

// 4. 篡改测试
const tamperedData = 'Important data to verify (modified)'
const tamperedHash = crypto.sm3(tamperedData)
console.log('篡改后哈希匹配:', hash === tamperedHash) // false
</script>
```

---

## 常见问题

### 1. 密钥格式说明

**Q: SM2 密钥的格式是什么？**

A:
- **公钥**: 130 个 hex 字符（65 字节），格式为 `04 + X坐标(64字符) + Y坐标(64字符)`
- **私钥**: 64 个 hex 字符（32 字节）

示例：
```typescript
const keyPair = crypto.sm2.generateKeyPairHex()
console.log(keyPair.publicKey.length)  // 130
console.log(keyPair.privateKey.length) // 64
```

**Q: SM4 密钥的长度是多少？**

A: SM4 密钥固定为 **128 位**（16 字节），用 hex 表示为 **32 个字符**。

```typescript
const key = '0123456789abcdef0123456789abcdef' // 32 个字符
```


### 2. 性能问题

**Q: 加密操作会阻塞 UI 吗？**

A:
- **Web 端**: WASM 运行在主线程，大数据量操作可能短暂阻塞
- **Android/iOS**: 原生实现，性能更好，不会明显阻塞

建议：
- 小数据（< 1MB）：直接调用
- 大数据（> 1MB）：考虑分块处理或使用 Worker

---

### 3. 错误处理

**Q: 如何处理加密失败？**

A: 所有加密操作都可能抛出异常，建议使用 try-catch：

```typescript
try {
  const encrypted = crypto.sm2.doEncrypt(message, publicKey)
  console.log('加密成功:', encrypted)
} catch (e) {
  // @ts-ignore
  console.error('加密失败:', e.toString())
}
```

常见错误：
- **密钥格式错误**: 检查长度和 hex 格式
- **密文格式错误**: 解密时确保密文是有效的 hex 字符串
- **密钥不匹配**: SM2 解密时公私钥必须匹配

---

### 4. 与 sm-crypto 的兼容性

**Q: 可以与 sm-crypto npm 包互操作吗？**

A: **完全兼容**！uni-crypto 的 API 设计与 sm-crypto 保持一致：


## 技术架构

### 底层实现

```
uni-crypto
├── Web 平台
│   ├── Emscripten 编译为 WASM
│   └── JavaScript API 封装
├── Android 平台
│   ├── JNI 桥接 (Kotlin)
│   └── UTS 接口封装
└── iOS 平台
    ├── GmSSL C 库
    ├── Objective-C 桥接
    └── UTS 接口封装
```

### C 库版本

- **GmSSL**: 3.x（支持国密 SM2/SM3/SM4/SM9）

## 许可证

本插件基于 GmSSL 开源项目，遵循其许可证。