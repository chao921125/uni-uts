export default {
	// #ifndef H5
	getBaseUrl: function () {
		if (process.env.NODE_ENV === "development") {
			return "http://127.0.0.1:8080/"; // qe & 本地环境
		} else {
			return "https://ip"; // 生产环境
		}
	},
	// #endif
	// #ifdef H5
	getBaseUrl: function () {
		if (process.env.NODE_ENV === "development") {
			return "/"; // qe & 本地环境
		} else {
			return "/"; // 生产环境
		}
	},
	// #endif
	httpCode: {
		unLogin: 1001,
		error: 5000,
		success: 9999,
	},
	httpCodeStr: {},
};
