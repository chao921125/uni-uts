package com.dcloud.gmssl

/**
 * Android JNI 桥接类
 * 负责加载 .so 库并声明 native 方法供 UTS 调用
 * 
 * 注意：
 * - System.loadLibrary("gmssl") 会查找 libgmssl.so
 * - 库文件必须放在 libs/{架构}/libgmssl.so
 */
class GmSSLBridge {
    companion object {
        init {
            // 加载 native 库（去掉 lib 前缀和 .so 后缀）
            System.loadLibrary("gmssl")
        }
    }
    
    /**
     * 获取版本号
     */
    external fun getVersion(): String?
    
    /**
     * MD5 哈希计算
     */
    external fun md5HashWithData(data: String): String?
    
    /**
     * 回声函数
     */
    external fun echoMessage(message: String): String?
    
    /**
     * SM3 哈希计算
     */
    external fun sm3HashWithData(data: String): String?
    
    /**
     * SM4 加密
     */
    external fun sm4EncryptWithKey(key: String, data: String): String?
    
    /**
     * SM4 解密
     */
    external fun sm4DecryptWithKey(key: String, encrypted: String): String?
    
    /**
     * SM4-CBC 加密
     */
    external fun sm4CbcEncryptWithKey(key: String, iv: String, data: String): String?
    
    /**
     * SM4-CBC 解密
     */
    external fun sm4CbcDecryptWithKey(key: String, iv: String, encrypted: String): String?
    
    /**
     * SM2 密钥生成
     */
    external fun sm2KeyGenerate(): String?
    
    /**
     * SM2 加密
     */
    external fun sm2EncryptWithPublicKey(publicKey: String, plaintext: String): String?
    
    /**
     * SM2 解密
     */
    external fun sm2DecryptWithPrivateKey(privateKey: String, ciphertext: String): String?
    
    /**
     * SM2 签名
     */
    external fun sm2SignWithPrivateKey(privateKey: String, message: String): String?
    
    /**
     * SM2 验证签名
     */
    external fun sm2VerifyWithPublicKey(publicKey: String, message: String, signature: String): String?
    
    /**
     * SM3-HMAC 计算
     */
    external fun sm3HmacWithKey(key: String, data: String): String?
    
    /**
     * SHA-256 哈希计算
     */
    external fun sha256HashWithData(data: String): String?
    
    /**
     * AES 加密
     */
    external fun aesEncryptWithKey(key: String, data: String): String?
    
    /**
     * AES 解密
     */
    external fun aesDecryptWithKey(key: String, encrypted: String): String?
    
    /**
     * AES-CBC 加密
     */
    external fun aesCbcEncryptWithKey(key: String, iv: String, data: String): String?
    
    /**
     * AES-CBC 解密
     */
    external fun aesCbcDecryptWithKey(key: String, iv: String, encrypted: String): String?
    
    /**
     * AES-GCM 加密
     */
    external fun aesGcmEncryptWithKey(key: String, iv: String, aad: String?, data: String): String?
    
    /**
     * AES-GCM 解密
     */
    external fun aesGcmDecryptWithKey(key: String, iv: String, aad: String?, encrypted: String): String?
}

