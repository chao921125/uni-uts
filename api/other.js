import config from "./index.js";
import request from "../request.js";

// 获取banner列表
export function getBanner(data) {
	return request({
		url: config.basePath + "/index/getbanner",
		method: "POST",
		data: data,
	});
}

/**
 * 获取统计信息
 * @param {Object} data
 * uid
 * cateid 分类id
 */
export function getIndexCount(data) {
	return request({
		url: config.basePath + "/index/getresult",
		method: "POST",
		data: data,
	});
}

/**
 * 获取排行榜
 * @param {Object} data
 * uid
 */
export function getRank(data) {
	return request({
		url: config.basePath + "/index/ranklist",
		method: "POST",
		data: data,
	});
}

/**
 * 反馈
 * @param {Object} data
 * uid
 * relation
 * content
 */
export function addFeedback(data) {
	return request({
		url: config.basePath + "/index/subcontent",
		method: "POST",
		data: data,
	});
}

/**
 * 反馈
 * @param {Object} data
 * uid
 * relation
 * content
 */
export function getAbout(data) {
	return request({
		url: config.basePath + "/index/about",
		method: "POST",
		data: data,
	});
}

/**
 * 评论
 * @param {Object} data
 * uid
 * tid
 * touid 用户id
 * toid 评论id
 * content
 */
export function addDiscuss(data) {
	return request({
		url: config.basePath + "/index/addcomment",
		method: "POST",
		data: data,
	});
}

/**
 * 获取评论
 * @param {Object} data
 * uid
 * tid
 */
export function getDiscuss(data) {
	return request({
		url: config.basePath + "/index/getcomment",
		method: "POST",
		data: data,
	});
}
