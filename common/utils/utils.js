const dateUtils = {
	UNITS: {
		年: 31557600000,
		月: 2629800000,
		天: 86400000,
		小时: 3600000,
		分钟: 60000,
		秒: 1000,
	},
	humanize: function (milliseconds) {
		var humanize = "";
		for (var key in this.UNITS) {
			if (milliseconds >= this.UNITS[key]) {
				humanize = Math.floor(milliseconds / this.UNITS[key]) + key + "前";
				break;
			}
		}
		return humanize || "刚刚";
	},
	format: function (dateStr) {
		var date = this.parse(dateStr);
		var diff = Date.now() - date.getTime();
		if (diff < this.UNITS["天"]) {
			return this.humanize(diff);
		}
		var _format = function (number) {
			return number < 10 ? "0" + number : number;
		};
		return date.getFullYear() + "/" + _format(date.getMonth() + 1) + "/" + _format(date.getDate()) + "-" + _format(date.getHours()) + ":" + _format(date.getMinutes());
	},
	parse: function (str) {
		//将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
		var a = str.split(/[^0-9]/);
		return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
	},
};

/**
 * 数据处理
 * @author echo.
 * @version 1.5.0
 **/
const utils = {
	//去空格
	trim: function (value) {
		return value.replace(/(^\s*)|(\s*$)/g, "");
	},
	//内容替换
	replaceAll: function (text, repstr, newstr) {
		return text.replace(new RegExp(repstr, "gm"), newstr);
	},
	replaceBank: function (bankAccount) {
		let reg = /^(.{4})(?:\d+)(.{4})$/;
		let str = bankAccount.replace(reg, "$1 **** **** $2");
		return str;
	},
	//格式化手机号码
	formatNumber: function (num) {
		return num.length === 11 ? num.replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2") : num;
	},
	//金额格式化
	rmoney: function (money) {
		return parseFloat(money)
			.toFixed(2)
			.toString()
			.split("")
			.reverse()
			.join("")
			.replace(/(\d{3})/g, "$1,")
			.replace(/\,$/, "")
			.split("")
			.reverse()
			.join("");
	},
	//日期格式化
	formatDate: function (formatStr, fdate) {
		if (fdate) {
			if (~fdate.indexOf(".")) {
				fdate = fdate.substring(0, fdate.indexOf("."));
			}
			fdate = fdate.toString().replace("T", " ").replace(/\-/g, "/");
			var fTime,
				fStr = "ymdhis";
			if (!formatStr) formatStr = "y-m-d h:i:s";
			if (fdate) fTime = new Date(fdate);
			else fTime = new Date();
			var month = fTime.getMonth() + 1;
			var day = fTime.getDate();
			var hours = fTime.getHours();
			var minu = fTime.getMinutes();
			var second = fTime.getSeconds();
			month = month < 10 ? "0" + month : month;
			day = day < 10 ? "0" + day : day;
			hours = hours < 10 ? "0" + hours : hours;
			minu = minu < 10 ? "0" + minu : minu;
			second = second < 10 ? "0" + second : second;
			var formatArr = [fTime.getFullYear().toString(), month.toString(), day.toString(), hours.toString(), minu.toString(), second.toString()];
			for (var i = 0; i < formatArr.length; i++) {
				formatStr = formatStr.replace(fStr.charAt(i), formatArr[i]);
			}
			return formatStr;
		} else {
			return "";
		}
	},
	formatTime: function (time) {
		if (typeof time !== "number" || time < 0) {
			return time;
		}

		var hour = parseInt(time / 3600);
		time = time % 3600;
		var minute = parseInt(time / 60);
		time = time % 60;
		var second = time;

		return [hour, minute, second]
			.map(function (n) {
				n = n.toString();
				return n[1] ? n : "0" + n;
			})
			.join(":");
	},
	formatLocation: function (longitude, latitude) {
		if (typeof longitude === "string" && typeof latitude === "string") {
			longitude = parseFloat(longitude);
			latitude = parseFloat(latitude);
		}

		longitude = longitude.toFixed(2);
		latitude = latitude.toFixed(2);

		return {
			longitude: longitude.toString().split("."),
			latitude: latitude.toString().split("."),
		};
	},
	rgbToHex: function (r, g, b) {
		return "#" + utils.toHex(r) + utils.toHex(g) + utils.toHex(b);
	},
	toHex: function (n) {
		n = parseInt(n, 10);
		if (isNaN(n)) return "00";
		n = Math.max(0, Math.min(n, 255));
		return "0123456789ABCDEF".charAt((n - (n % 16)) / 16) + "0123456789ABCDEF".charAt(n % 16);
	},
	hexToRgb: function (hex) {
		let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result
			? {
					r: parseInt(result[1], 16),
					g: parseInt(result[2], 16),
					b: parseInt(result[3], 16),
				}
			: null;
	},
};

export default {
	trim: utils.trim,
	replaceAll: utils.replaceAll,
	formatNumber: utils.formatNumber,
	rmoney: utils.rmoney,
	formatDate: utils.formatDate,
	formatTime: utils.formatTime,
	formatLocation: utils.formatLocation,
	rgbToHex: utils.rgbToHex,
	hexToRgb: utils.hexToRgb,
};
