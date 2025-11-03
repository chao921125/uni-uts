/**
 * 缓存数据
 */

export default {
	// 异步操作
	setStorage(key, value) {
		let dataValue = "";
		if (typeof value === "string") {
			dataValue = value;
		} else {
			dataValue = JSON.stringify(value);
		}
		uni.setStorage({
			key: key,
			data: dataValue,
			success: function () {},
			fail: function () {},
		});
	},
	getStorage(key) {
		uni.getStorage({
			key: key,
			success: function (res) {
				let value = res.data;
				if (!value) return null;
				// 这点要判断是字符串还是对象
				let result = /^[{\\[].*[}\]]$/g.test(value);
				if (result) {
					return JSON.parse(value);
				} else {
					return value;
				}
			},
			fail: function () {
				return null;
			},
		});
	},
	removeStorage(key) {
		uni.removeStorage({
			key: key,
			success: function () {
				return true;
			},
			fail: function () {
				return false;
			},
		});
	},
	clearStorage() {
		uni.clearStorage();
	},
	// 同步操作
	setStorageSync(key, value) {
		let dataValue = "";
		if (typeof value === "string") {
			dataValue = value;
		} else {
			dataValue = JSON.stringify(value);
		}
		uni.setStorageSync(key, dataValue);
	},
	getStorageSync(key) {
		try {
			const value = uni.getStorageSync(key);
			if (!value) return null;
			// 这点要判断是字符串还是对象
			let result = /^[{\\[].*[}\]]$/g.test(value);
			if (result) {
				return JSON.parse(value);
			} else {
				return value;
			}
		} catch (e) {
			// error
		}
	},
	removeStorageSync(key) {
		try {
			uni.removeStorageSync(key);
		} catch (e) {
			// error
		}
	},
	clearStorageSync() {
		try {
			uni.clearStorageSync();
		} catch (e) {
			// error
		}
	},
};
