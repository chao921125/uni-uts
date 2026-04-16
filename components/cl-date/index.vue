<template>
	<view class="">
		<view v-if="show" class="remark" @tap="cancel"></view>
		<view class="dialog" :class="{ show: show }">
			<view class="title">
				<image class="h-ico" src="/static/icons/date.png" mode="aspectFit"></image>
				选择时期和时间
			</view>

			<view class="time-type">
				<text class="type-title">年</text>
				<text class="type-title">月</text>
				<text class="type-title">日</text>
				<text class="type-title">时</text>
				<text class="type-title">分</text>
			</view>

			<picker-view class="picker-view" immediate-change indicator-class="select-line" :indicator-style="`height: 42px`" mask-style="background: transparent" :value="pickeVal" @change="bindChangeDate">
				<picker-view-column class="column-left">
					<view :key="index" v-for="(item, index) in years" class="item flex_center" :class="index == pickeVal[0] ? 'picker-select' : ''">
						{{ item }}
					</view>
				</picker-view-column>
				<picker-view-column v-if="showLabel" class="column-center">
					<view class="item flex_center color_3 fs_14">年</view>
				</picker-view-column>

				<picker-view-column class="column-center column-line">
					<view :key="index" v-for="(item, index) in months" class="item flex_center" :class="index == pickeVal[showLabel ? 2 : 1] ? 'picker-select' : ''">
						{{ item }}
					</view>
				</picker-view-column>
				<picker-view-column v-if="showLabel" class="column-center">
					<view class="item flex_center color_3 fs_14">月</view>
				</picker-view-column>

				<picker-view-column class="column-center column-line">
					<view :key="index" v-for="(item, index) in days" class="item flex_center" :class="index == pickeVal[showLabel ? 4 : 2] ? 'picker-select' : ''">
						{{ item }}
					</view>
				</picker-view-column>
				<picker-view-column v-if="showLabel" class="column-center">
					<view class="item flex_center color_3 fs_14">日</view>
				</picker-view-column>

				<picker-view-column class="column-center column-line">
					<view :key="index" v-for="(item, index) in hours" class="item flex_center" :class="index == pickeVal[showLabel ? 6 : 3] ? 'picker-select' : ''">
						{{ item }}
					</view>
				</picker-view-column>
				<picker-view-column v-if="showLabel" class="column-center">
					<view class="item flex_center color_3 fs_14">时</view>
				</picker-view-column>

				<picker-view-column class="column-center column-line" :class="{ 'column-right': !showLabel }">
					<view :key="index" v-for="(item, index) in minutes" class="item flex_center" :class="index == pickeVal[showLabel ? 8 : 4] ? 'picker-select' : ''">
						{{ item }}
					</view>
				</picker-view-column>
				<picker-view-column v-if="showLabel" class="column-right">
					<view class="item flex_center color_3 fs_14">分</view>
				</picker-view-column>
			</picker-view>

			<view class="button-group">
				<view class="item cancel" @tap="cancel">取消</view>
				<view class="item confirm" @tap="confirm">确认</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: "DatePicker",
	props: {
		show: {
			type: Boolean,
			default: false,
		},
		value: {
			// 默认日期
			type: String,
			default: "",
		},
		showLabel: {
			// 显示年月日
			type: Boolean,
			default: true,
		},
		nowStatus: {
			// 日期显示范围 past 过去 future 未来
			type: String,
			default: "future",
		},
		yearStart: {
			// 起始年份
			type: Number,
			default: new Date().getFullYear() - 1,
		},
		yearEnd: {
			// 结束年份
			type: Number,
			default: new Date().getFullYear(),
		},
	},
	data() {
		return {
			indicatorStyle: "height: 100rpx;",
			years: [],
			months: [],
			days: [],
			hours: [],
			minutes: [],
			pickeVal: [],
		};
	},
	watch: {
		value() {
			this.init();
		},
	},
	created() {
		this.init();
	},
	methods: {
		confirm() {
			this.$emit("confirm", this._timeValue);
		},
		cancel() {
			this.$emit("cancel");
		},
		init() {
			let _default_date = this.parseDate(this.value);

			let date = new Date();
			let _year = date.getFullYear();
			if (_default_date && _default_date.length > 0) {
				date = new Date(_default_date.replace(/^\s+|\s+$/g, ""));
			}
			// 获取对应范围值
			const year = date.getFullYear();
			const month = date.getMonth() + 1;
			const day = date.getDate();
			const hour = date.getHours();
			const minute = date.getMinutes();

			const years = [];
			// 初始化小时和分钟数组
			const hours = [];
			const minutes = [];

			// 填充小时数组 (0-23)
			for (let i = 0; i <= 23; i++) {
				hours.push(this.padStart(i));
			}

			// 填充分钟数组 (0-59)
			for (let i = 0; i <= 59; i++) {
				minutes.push(this.padStart(i));
			}

			this.hours = hours;
			this.minutes = minutes;

			// 年份范围
			let yearIndexStart = this.yearStart;
			let yearIndexEnd = this.yearEnd;

			if (this.nowStatus == "past") {
				yearIndexStart = this.yearStart;
				yearIndexEnd = _year - 6;
			} else if (this.nowStatus == "future") {
				yearIndexStart = _year;
				yearIndexEnd = this.yearEnd;
			} else {
				yearIndexStart = this.yearStart;
				yearIndexEnd = this.yearEnd;
			}
			this.formate(year, month);

			// 年份数组
			for (let i = yearIndexStart; i <= yearIndexEnd; i++) {
				years.push(i);
			}
			this.years = years;

			// 定义默认选中初始值下标
			let index1 = 0;
			let index2 = 0;
			let index3 = 0;
			let index4 = 0;
			let index5 = 0;

			// 赋值默认选中日期
			if (_default_date) {
				const _date = new Date(_default_date.replace(/^\s+|\s+$/g, ""));
				index1 = this.years.findIndex((item) => item == _date.getFullYear());
				index1 = index1 >= 0 ? index1 : 0;
				index2 = this.months.findIndex((item) => item == _date.getMonth() + 1);
				index2 = index2 >= 0 ? index2 : 0;
				index3 = this.days.findIndex((item) => item == _date.getDate());
				index3 = index3 >= 0 ? index3 : 0;
				index4 = this.hours.findIndex((item) => item == this.padStart(_date.getHours()));
				index4 = index4 >= 0 ? index4 : 0;
				index5 = this.minutes.findIndex((item) => item == this.padStart(_date.getMinutes()));
				index5 = index5 >= 0 ? index5 : 0;
			} else {
				if (this.nowStatus == "past") {
					index1 = this.years.length - 1;
					index2 = this.months.length - 1;
					index3 = this.days.length - 1;
				} else if (this.nowStatus == "future") {
				}
			}

			const time = year + "-" + this.padStart(month) + "-" + this.padStart(day) + " " + this.padStart(hour) + ":" + this.padStart(minute);
			this._timeValue = time;
			this.$emit("change", time);

			this.$nextTick(() => {
				if (this.showLabel) {
					this.pickeVal = [index1, 0, index2, 0, index3, 0, index4, 0, index5, 0];
				} else {
					this.pickeVal = [index1, index2, index3, index4, index5];
				}
			});
		},
		// 监听选择事件
		bindChangeDate(e) {
			const { value } = e.detail;
			const year = parseInt(this.years[value[0]]);
			const month = parseInt(this.months[value[this.showLabel ? 2 : 1]]);
			let day = parseInt(this.days[value[this.showLabel ? 4 : 2]]);
			const hour = parseInt(this.hours[value[this.showLabel ? 6 : 3]]);
			const minute = parseInt(this.minutes[value[this.showLabel ? 8 : 4]]);

			// 选中月份的总天数
			const currentMonthDays = new Date(year, month, 0).getDate();
			// 判断日期没有31号的情况
			if (day > currentMonthDays) {
				day = currentMonthDays;
				value[this.showLabel ? 4 : 2] = day - 1;
			}
			this.pickeVal = value;
			this.formate(year, month, true, hour, minute);
		},

		// 动态计算 年月日
		formate(year, month, status = false, hour = 0, minute = 0) {
			// 排除今天日期
			let date = new Date(this.getAppointDate(this.currentDate(), 1));
			let totalMonth = 12;
			let totalDay = new Date(parseInt(year), parseInt(month), 0).getDate();

			let initMonth = 1;
			let initDay = 1;

			if (this.nowStatus == "past") {
				// 计算结束临界值
				if (year == date.getFullYear()) {
					totalMonth = date.getMonth() + 1;
					if (month == date.getMonth() + 1) {
						totalDay = date.getDate();
					}
				}
			} else if (this.nowStatus == "future") {
				// 计算开始临界值
				if (year == date.getFullYear()) {
					// initMonth = date.getMonth() + 1
				}
			}
			// 重新赋值 年月日
			let monthArr = [];
			let dayArr = [];

			for (let i = initMonth; i <= totalMonth; i++) {
				monthArr.push(this.padStart(i));
			}

			this.months = monthArr;

			for (let i = initDay; i <= totalDay; i++) {
				dayArr.push(this.padStart(i));
			}
			this.days = dayArr;

			if (status) {
				const year = parseInt(this.years[this.pickeVal[0]]);
				const month = parseInt(this.months[this.pickeVal[this.showLabel ? 2 : 1]]);
				const day = parseInt(this.days[this.pickeVal[this.showLabel ? 4 : 2]]);
				const hour = parseInt(this.hours[this.pickeVal[this.showLabel ? 6 : 3]] || 0);
				const minute = parseInt(this.minutes[this.pickeVal[this.showLabel ? 8 : 4]] || 0);
				const time = `${year}-${this.padStart(month)}-${this.padStart(day)} ${this.padStart(hour)}:${this.padStart(minute)}`;
				this._timeValue = time;
				this.$emit("change", time);
			}
		},

		// 一位数补0
		padStart(val) {
			return val.toString().padStart(2, 0);
		},

		/**
		 * 获取当前时间
		 * @param format 时间格式
		 * @returns 返回当前时间
		 */
		currentDate(format = "yyyy-mm-dd") {
			const date = new Date();
			const year = date.getFullYear();
			const month = this.padStart(date.getMonth() + 1);
			const day = this.padStart(date.getDate());
			const hour = this.padStart(date.getHours());
			const minute = this.padStart(date.getMinutes());

			if (format === "yyyy-mm-dd") {
				return `${year}-${month}-${day}`;
			}
			if (format === "yyyy/mm/dd") {
				return `${year}/${month}/${day}`;
			}
			if (format === "yyyy-mm-dd HH:MM") {
				return `${year}-${month}-${day} ${hour}:${minute}`;
			}
			if (format === "yyyy/mm/dd HH:MM") {
				return `${year}/${month}/${day} ${hour}:${minute}`;
			}
			return `${year}年${month}月${day}日 ${hour}:${minute}`;
		},
		/**
		 * 补齐当前时分并格式化为 yyyy-MM-dd HH:mm
		 * @param {Date|string|number} date 只含年月日的日期
		 * @returns {string} 形如 2025-07-20 15:06
		 */
		parseDate(date) {
			if (!date) return this.currentDate("yyyy-mm-dd HH:MM");
			const d = new Date(date);
			const now = new Date();
			d.setHours(now.getHours(), now.getMinutes(), 0, 0);

			const y = d.getFullYear();
			const m = String(d.getMonth() + 1).padStart(2, "0");
			const day = String(d.getDate()).padStart(2, "0");
			const h = String(d.getHours()).padStart(2, "0");
			const min = String(d.getMinutes()).padStart(2, "0");

			return `${y}-${m}-${day} ${h}:${min}`;
		},
		/**
		 * 获取指定日期
		 * @param {String} targetDate 开始日期
		 * @param {number} day 几天，正数为往后的日期，负数为往前的日期
		 * @returns {number} 返回 day 后的日期
		 * */
		getAppointDate(targetDate, day) {
			const datetmp = new Date(targetDate.replace(/-/g, "/")).getTime();
			let result = new Date(datetmp + 24 * 60 * 60 * 1000 * day);
			return `${result.getFullYear()}-${this.padStart(result.getMonth() + 1)}-${this.padStart(result.getDate())}`;
		},
	},
};
</script>

<style lang="scss" scoped>
.remark {
	width: 100vw;
	height: 100vh;
	position: fixed;
	left: 0;
	top: 0;
	background: rgba(0, 0, 0, 0.5);
	z-index: 99998;
	opacity: 0;
	animation: opacity 0.3s ease forwards;
}
.dialog {
	width: calc(100vw - 60rpx);
	padding: 52rpx 30rpx 29rpx;
	margin-left: 30rpx;
	box-sizing: border-box;
	position: fixed;
	left: 0;
	bottom: env(safe-area-inset-bottom);
	background: #fff;
	// padding-bottom: calc(40rpx + constant(safe-area-inset-bottom)) !important;
	// padding-bottom: calc(40rpx + env(safe-area-inset-bottom)) !important;
	border-radius: 50rpx;
	z-index: 99999;
	transform: translateY(1000px);
	transition: transform 0.3s ease-out;
	&.show {
		transform: translateY(0);
		transition: transform 0.3s ease-in;
	}
	.title {
		font-weight: 500;
		font-size: 30rpx;
		color: #333333;
		line-height: 42rpx;
		text-align: center;
		font-style: normal;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.h-ico {
		width: 30rpx;
		height: 30rpx;
		margin-right: 6rpx;
	}
}
::v-deep.column-line {
	border-left: 1rpx solid rgba(223, 223, 223, 1);
}
::v-deep.select-line::before,
::v-deep.select-line::after {
	border: none;
}
::v-deep.column-left,
::v-deep.column-center,
::v-deep.column-right {
	.select-line {
		background: #e2f9f9;
		z-index: -1;
	}
}
::v-deep.column-left .select-line {
	border-radius: 45rpx 0 0 45rpx;
}
::v-deep.column-right .select-line {
	border-radius: 0 45rpx 45rpx 0;
}

.time-type {
	display: flex;
	justify-content: space-between;
	text-align: center;
	padding-top: 51rpx;
}
.type-title {
	text-align: center;
	width: calc(100% / 5);
}

.picker-view {
	height: 415rpx;
	width: 100%;
	margin-top: 44rpx;
	margin-bottom: 30rpx;
	.fs_14 {
		font-size: 28rpx;
	}
	.flex_center {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.item {
		height: 80rpx;
		line-height: 80rpx;
		font-weight: 500;
		font-size: 26rpx;
		font-style: normal;
		color: rgba(51, 51, 51, 1);
		transition: all 0.2s ease;
		&.picker-select {
			color: rgba(77, 209, 207, 1);
			font-size: 26rpx;
			text-align: center;
			transition: all 0.2s ease;
		}
	}
}
.button-group {
	display: flex;
	justify-content: space-around;
	margin-top: 30rpx;
	.item {
		width: 300rpx;
		height: 90rpx;
		border-radius: 45rpx;
		font-weight: 500;
		font-size: 30rpx;
		line-height: 42rpx;
		text-align: center;
		font-style: normal;
		display: flex;
		align-items: center;
		justify-content: center;
		&.cancel {
			border: 1rpx solid #808080;
			color: #808080;
		}
		&.confirm {
			background: #4dd1cf;
			color: #ffffff;
		}
	}
}

.color_3 {
	color: #333 !important;
}

@keyframes opacity {
	0% {
		opacity: 0;
	}

	100% {
		opacity: 1;
	}
}
</style>
