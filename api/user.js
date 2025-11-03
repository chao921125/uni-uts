/**
 * 用户相关
 */
import config from "@/api/index.js";
import http from "@/common/plugins/http.js";

/**
 * 获取验证码
 * @param {Object} params
 * tel: string
 * codeType: string 1 注册；2 找回密码；3 修改手机号；
 */
export function getPhoneCode(params) {
	return http.request(config.basePath + "/system/artsuser/front/sendMessage", "POST", params, false, false);
}

/**
 * 注册
 * @param {Object} params
 * uname: string
 * upassword: string
 * inviteCode: string
 * tel: string
 * code: string
 */
export function register(params) {
	return http.request(config.basePath + "/system/artsuser/front/regesitor", "POST", params, false, false);
}

/**
 * 登录
 * @param {Object} params
 * uname: string
 * upassword: string
 * deptId: string 画室编号
 */
export function login(params) {
	return http.request(config.basePath + "/front/login", "POST", params, false, false);
}

/**
 * 找回密码/修改密码
 * @param {Object} params
 * tel: string
 * validationCode: string
 * upassword: string
 */
export function updatePwd(params) {
	return http.request(config.basePath + "/system/artsuser/front/updatePassword", "POST", params, false, false);
}

/**
 * 退出
 * @param {Object} params
 */
export function logout(params) {
	return http.request(config.basePath + "/front/logout", "POST", params, false, false);
}

/**
 * 查询用户信息
 * @param {Object} params
 */
export function selectUserInfo(params) {
	return http.request(config.basePath + "/system/artsuser/front/getUserDetail", "POST", params, false, false);
}

/**
 * 编辑用户信息
 * @param {Object} params
 * userNo: string
 * userName: string
 * userTel: string
 * remark: string
 */
export function userEdit(params) {
	return http.request(config.basePath + "/profic/user/updateUser", "POST", params, false, false);
}
