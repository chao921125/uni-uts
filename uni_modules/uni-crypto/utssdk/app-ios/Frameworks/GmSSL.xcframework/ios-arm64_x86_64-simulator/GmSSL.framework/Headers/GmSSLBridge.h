#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * Objective-C 桥接类
 * 负责将 C 函数封装为 Objective-C 方法供 UTS 调用
 */
@interface GmSSLBridge : NSObject

/**
 * 获取版本号
 * @return 版本号字符串
 */
- (nullable NSString *)getVersion;

/**
 * SM3 哈希计算
 * @param data 输入数据（hex 字符串）
 * @return 哈希结果（hex 字符串）
 */
- (nullable NSString *)sm3HashWithData:(NSString *)data;

/**
 * SM4 加密
 * @param key 加密密钥（hex 字符串，32字符=16字节）
 * @param data 待加密数据（hex 字符串，32字符=16字节）
 * @return 加密结果（hex 字符串）
 */
- (nullable NSString *)sm4EncryptWithKey:(NSString *)key data:(NSString *)data;

/**
 * SM4 解密
 * @param key 解密密钥（hex 字符串，32字符=16字节）
 * @param encrypted 加密数据（hex 字符串，32字符=16字节）
 * @return 解密结果（hex 字符串）
 */
- (nullable NSString *)sm4DecryptWithKey:(NSString *)key encrypted:(NSString *)encrypted;

/**
 * 回声
 * @param message 消息
 * @return 相同的消息
 */
- (nullable NSString *)echoMessage:(NSString *)message;

// ==================== SM4-CBC ====================

/**
 * SM4-CBC 加密
 * @param key 加密密钥（hex 字符串，32字符=16字节）
 * @param iv 初始化向量（hex 字符串，32字符=16字节）
 * @param data 待加密数据（hex 字符串，任意长度）
 * @return 加密结果（hex 字符串）
 */
- (nullable NSString *)sm4CbcEncryptWithKey:(NSString *)key iv:(NSString *)iv data:(NSString *)data;

/**
 * SM4-CBC 解密
 * @param key 解密密钥（hex 字符串，32字符=16字节）
 * @param iv 初始化向量（hex 字符串，32字符=16字节）
 * @param encrypted 加密数据（hex 字符串）
 * @return 解密结果（hex 字符串）
 */
- (nullable NSString *)sm4CbcDecryptWithKey:(NSString *)key iv:(NSString *)iv encrypted:(NSString *)encrypted;

// ==================== SM2 ====================

/**
 * SM2 密钥生成
 * @return JSON 格式的密钥对字符串，格式：{"privateKey":"...","publicKey":"..."}
 */
- (nullable NSString *)sm2KeyGenerate;

/**
 * SM2 加密
 * @param publicKey 公钥（hex 字符串）
 * @param plaintext 明文（hex 字符串）
 * @return 密文（hex 字符串）
 */
- (nullable NSString *)sm2EncryptWithPublicKey:(NSString *)publicKey plaintext:(NSString *)plaintext;

/**
 * SM2 解密
 * @param privateKey 私钥（hex 字符串）
 * @param ciphertext 密文（hex 字符串）
 * @return 明文（hex 字符串）
 */
- (nullable NSString *)sm2DecryptWithPrivateKey:(NSString *)privateKey ciphertext:(NSString *)ciphertext;

/**
 * SM2 签名
 * @param privateKey 私钥（hex 字符串）
 * @param message 待签名消息（hex 字符串）
 * @return 签名（hex 字符串）
 */
- (nullable NSString *)sm2SignWithPrivateKey:(NSString *)privateKey message:(NSString *)message;

/**
 * SM2 验证签名
 * @param publicKey 公钥（hex 字符串）
 * @param message 原始消息（hex 字符串）
 * @param signature 签名（hex 字符串）
 * @return "1"表示验证成功，"0"表示失败
 */
- (nullable NSString *)sm2VerifyWithPublicKey:(NSString *)publicKey message:(NSString *)message signature:(NSString *)signature;

// ==================== SM3-HMAC ====================

/**
 * SM3-HMAC 消息认证码
 * @param key 密钥（hex 字符串）
 * @param data 数据（hex 字符串）
 * @return HMAC 值（hex 字符串）
 */
- (nullable NSString *)sm3HmacWithKey:(NSString *)key data:(NSString *)data;

// ==================== SHA-256 ====================

/**
 * SHA-256 哈希计算
 * @param data 输入数据（hex 字符串）
 * @return 哈希结果（hex 字符串）
 */
- (nullable NSString *)sha256HashWithData:(NSString *)data;

// ==================== MD5 ====================

/**
 * MD5 哈希计算
 * @param data 输入数据（hex 字符串）
 * @return 哈希结果（hex 字符串，32字符=16字节）
 */
- (nullable NSString *)md5HashWithData:(NSString *)data;

// ==================== AES ====================

/**
 * AES 加密（ECB 模式）
 * @param key 加密密钥（hex 字符串，32/48/64字符=16/24/32字节）
 * @param data 待加密数据（hex 字符串，16字节的倍数）
 * @return 加密结果（hex 字符串）
 */
- (nullable NSString *)aesEncryptWithKey:(NSString *)key data:(NSString *)data;

/**
 * AES 解密（ECB 模式）
 * @param key 解密密钥（hex 字符串，32/48/64字符=16/24/32字节）
 * @param encrypted 加密数据（hex 字符串，16字节的倍数）
 * @return 解密结果（hex 字符串）
 */
- (nullable NSString *)aesDecryptWithKey:(NSString *)key encrypted:(NSString *)encrypted;

/**
 * AES-CBC 加密
 * @param key 加密密钥（hex 字符串，32/48/64字符=16/24/32字节）
 * @param iv 初始化向量（hex 字符串，32字符=16字节）
 * @param data 待加密数据（hex 字符串，任意长度）
 * @return 加密结果（hex 字符串）
 */
- (nullable NSString *)aesCbcEncryptWithKey:(NSString *)key iv:(NSString *)iv data:(NSString *)data;

/**
 * AES-CBC 解密
 * @param key 解密密钥（hex 字符串，32/48/64字符=16/24/32字节）
 * @param iv 初始化向量（hex 字符串，32字符=16字节）
 * @param encrypted 加密数据（hex 字符串）
 * @return 解密结果（hex 字符串）
 */
- (nullable NSString *)aesCbcDecryptWithKey:(NSString *)key iv:(NSString *)iv encrypted:(NSString *)encrypted;

/**
 * AES-GCM 加密
 * @param key 加密密钥（hex 字符串，32/48/64字符=16/24/32字节）
 * @param iv 初始化向量（hex 字符串，推荐24字符=12字节）
 * @param aad 附加认证数据（hex 字符串，可为空）
 * @param data 待加密数据（hex 字符串，任意长度）
 * @return 加密结果（hex 字符串，包含密文+标签）
 */
- (nullable NSString *)aesGcmEncryptWithKey:(NSString *)key iv:(NSString *)iv aad:(NSString *)aad data:(NSString *)data;

/**
 * AES-GCM 解密
 * @param key 解密密钥（hex 字符串，32/48/64字符=16/24/32字节）
 * @param iv 初始化向量（hex 字符串，推荐24字符=12字节）
 * @param aad 附加认证数据（hex 字符串，可为空）
 * @param encrypted 加密数据（hex 字符串，包含密文+标签）
 * @return 解密结果（hex 字符串）
 */
- (nullable NSString *)aesGcmDecryptWithKey:(NSString *)key iv:(NSString *)iv aad:(NSString *)aad encrypted:(NSString *)encrypted;

@end

NS_ASSUME_NONNULL_END

