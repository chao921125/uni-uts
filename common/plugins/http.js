import defaultConfig from "@/common/config/index.js";
import utils from "@/common/plugins/uni-methods.js";
// 文档参考：https://uniapp.dcloud.net.cn/api/request/request.html
let ajaxTimes = 1;
let defaultHeader = {
	"Content-Type": "application/json;charset=utf-8",
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Max-Age": "3600",
	Access: "application/json",
	accept: "application/json",
	token: utils.getToken(),
	Authorization: utils.getToken(),
};
let defaultHeaderFile = {
	token: utils.getToken(),
	Authorization: utils.getToken(),
	"Content-Type": "application/x-www-form-urlencoded",
};
export default {
	/**
	 * 请求数据处理
	 * @param string url 请求地址
	 * @param string method 请求方式 GET or POST
	 * @param {*} postData 请求参数
	 * @param boolean isForm 数据格式 true: "application/x-www-form-urlencoded" false:"application/json"
	 * @param boolean hideLoading 是否隐藏loading true: 隐藏 false:显示
	 */
	request: async function (url, method, params, isForm = false, hideLoading = false) {
		//接口请求
		let loadding = false;
		if (!hideLoading) {
			loadding = true;
			utils.showLoading();
		}
		if (isForm) {
			Object.assign(defaultHeader, {
				"Content-Type": "application/x-www-form-urlencoded",
			});
		}
		Object.assign(defaultHeader, {
			token: utils.getToken(),
			Authorization: utils.getToken(),
		});

		return new Promise((resolve, reject) => {
			uni.request({
				url: defaultConfig.baseUrl + url,
				data: params,
				header: defaultHeader,
				method: method, //"GET","POST"
				dataType: "json",
				success: (res) => {
					uni.stopPullDownRefresh();
					if (loadding && !hideLoading) {
						uni.hideLoading();
					}
					switch (res.data.code) {
						case 1111:
							utils.removeUserInfo();
							utils.gotoUrl(defaultConfig.routePath.login, false);
							break;
						case 301:
							utils.toast(res.data.msg);
							break;
						case 500:
							utils.toast(res.data.msg);
							break;
						default:
							resolve(res.data);
							break;
					}
					/* if (res.code === defaultConfig.httpCode.unLogin) {
                        utils.href(defaultConfig.routePath.loginPermission, false);
                    } else {
                        resolve(res.data);
                    } */
				},
				fail: (res) => {
					uni.stopPullDownRefresh();
					uni.hideLoading();
					utils.toast("网络不给力，请稍后再试~");
					reject(res);
				},
				complete: () => {
					ajaxTimes--;
					if (ajaxTimes <= 0) {
						// 关闭正在等待的图标
						uni.hideLoading();
					}
				},
			});
		});
	},
	/**
	 * 上传文件
	 * @param {Object} url 请求地址
	 * @param {Object} [files, filePath] 要上传的文件,Array[File]/String，理论上不推荐使用path
	 * @param {Object} name
	 * @param {Object} fileType 文件类型
	 * @param {Object} formData
	 * @param boolean hideLoading 是否隐藏loading
	 */
	upload: async function (url, files, name = "imageKey", fileType = "image", formData = {}, hideLoading = false) {
		let loadding = false;
		if (!hideLoading) {
			loadding = true;
			utils.showLoading();
		}
		let filePath = "";
		let fileArray = [];
		if (typeof files === "string") {
			filePath = files;
		} else {
			fileArray = files;
		}
		Object.assign(defaultHeaderFile, {
			token: utils.getToken(),
			Authorization: utils.getToken(),
		});
		return new Promise((resolve, reject) => {
			uni.uploadFile({
				url: defaultConfig.baseUrl + url,
				files: fileArray,
				filePath: filePath,
				name: name,
				fileType: fileType,
				header: defaultHeaderFile,
				formData: formData,
				success: function (res) {
					if (loadding && !hideLoading) {
						uni.hideLoading();
					}
					let d = JSON.parse(res.data.replace(/\ufeff/g, "") || "{}");
					if (d.code % 100 == 0) {
						//返回图片地址
						let fileObj = d.data;
						resolve(fileObj);
					} else {
						utils.toast(res.msg);
					}
				},
				fail: function (res) {
					uni.hideLoading();
					utils.toast(res.msg);
					reject(res);
				},
				complete: () => {
					ajaxTimes--;
					if (ajaxTimes <= 0) {
						// 关闭正在等待的图标
						uni.hideLoading();
					}
				},
			});
		});
	},
	httpJsonp: function (url, callback, callbackname) {
		// #ifdef H5
		window[callbackname] = callback;
		let httpScript = document.createElement("script");
		httpScript.src = url;
		httpScript.type = "text/javascript";
		document.head.appendChild(httpScript);
		document.head.removeChild(httpScript);
		// #endif
	},
};
