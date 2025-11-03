export default {
	testPath: "/test",
	basePath: "",
	paramsReauired: function (params) {
		// 参数允许为非JSON Object格式，但如果传值为number 0 那么默认为没有传参
		if (!params || Object.keys(params).length === 0) {
			// uni.
			return false;
		}
		return true;
	},
};
