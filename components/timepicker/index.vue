<template>
	<!-- 半透明遮罩 -->
	<view v-if="visible" class="mask" @tap="close" />

	<!-- 主体 -->
	<view v-if="visible" class="picker-wrapper" :class="{ show: visible }">
		<!-- 顶部标题 -->
		<view class="header">
			<text class="title">{{ title }}</text>
			<text class="close" @tap="close">×</text>
		</view>

		<!-- 滚轮区域 -->
		<picker-view :value="pickerValue" class="picker-view" @change="onChange">
			<picker-view-column>
				<view v-for="y in years" :key="y" class="item">{{ y }}年</view>
			</picker-view-column>
			<picker-view-column>
				<view v-for="m in months" :key="m" class="item">{{ m }}月</view>
			</picker-view-column>
			<picker-view-column>
				<view v-for="d in days" :key="d" class="item">{{ d }}日</view>
			</picker-view-column>
			<picker-view-column>
				<view v-for="h in hours" :key="h" class="item">{{ h }}时</view>
			</picker-view-column>
			<picker-view-column>
				<view v-for="min in minutes" :key="min" class="item">{{ min }}分</view>
			</picker-view-column>
		</picker-view>

		<!-- 底部按钮 -->
		<view class="footer">
			<button class="btn cancel" @tap="close">取消</button>
			<button class="btn sure" @tap="confirm">确定</button>
		</view>
	</view>
</template>
<template>
	<!-- 遮罩 -->
	<view v-if="visible" class="mask" @tap="close" />

	<!-- 主体 -->
	<view v-if="visible" class="picker-wrapper" :class="{ show: visible }">
		<!-- 标题 -->
		<view class="header">
			<text class="title">{{ title }}</text>
			<text class="close" @tap="close">×</text>
		</view>

		<!-- 滚轮 -->
		<picker-view :value="pickerValue" class="picker-view" @change="onChange">
			<picker-view-column>
				<view v-for="y in years" :key="y" class="item">{{ y }}年</view>
			</picker-view-column>
			<picker-view-column>
				<view v-for="m in months" :key="m" class="item">{{ m }}月</view>
			</picker-view-column>
			<picker-view-column>
				<view v-for="d in days" :key="d" class="item">{{ d }}日</view>
			</picker-view-column>
			<picker-view-column>
				<view v-for="h in hours" :key="h" class="item">{{ h }}时</view>
			</picker-view-column>
			<picker-view-column>
				<view v-for="min in minutes" :key="min" class="item">{{ min }}分</view>
			</picker-view-column>
		</picker-view>

		<!-- 按钮 -->
		<view class="footer">
			<button class="btn cancel" @tap="close">取消</button>
			<button class="btn sure" @tap="confirm">确定</button>
		</view>
	</view>
</template>

<script>
export default {
	name: "DatePicker",
	props: {
		value: {
			// v-model 绑定
			type: Boolean,
			default: false,
		},
		title: {
			type: String,
			default: "请选择时间",
		},
		defaultValue: {
			// 默认日期
			type: Date,
			default() {
				return new Date();
			},
		},
	},
	data() {
		return {
			years: [], // 2020-2040
			months: [], // 1-12
			days: [], // 1-31
			hours: [], // 0-23
			minutes: [], // 0-59
			pickerValue: [0, 0, 0, 0, 0],
		};
	},
	computed: {
		visible: {
			get() {
				return this.value;
			},
			set(v) {
				this.$emit("input", v);
			},
		},
	},
	watch: {
		defaultValue: {
			handler(d) {
				this.initPicker(d);
			},
			immediate: true,
		},
	},
	created() {
		// 生成数据
		this.years = this.range(2020, 2040);
		this.months = this.range(1, 12);
		this.days = this.range(1, 31);
		this.hours = this.range(0, 23);
		this.minutes = this.range(0, 59);
	},
	methods: {
		// 工具：返回 [start..end] 数组
		range(start, end) {
			const arr = [];
			for (let i = start; i <= end; i++) arr.push(i);
			return arr;
		},
		// 根据 Date 计算索引
		initPicker(d) {
			this.pickerValue = [this.years.indexOf(d.getFullYear()), d.getMonth(), d.getDate() - 1, d.getHours(), d.getMinutes()];
		},
		onChange(e) {
			this.pickerValue = e.detail.value;
		},
		close() {
			this.visible = false;
		},
		confirm() {
			const [yIdx, mIdx, dIdx, hIdx, minIdx] = this.pickerValue;
			const date = new Date(this.years[yIdx], mIdx, this.days[dIdx], this.hours[hIdx], this.minutes[minIdx]);
			this.$emit("confirm", date);
			this.close();
		},
	},
};
</script>

<style scoped>
/* 样式与 TS 版本完全一致，直接复用即可 */
.mask {
	position: fixed;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.4);
	z-index: 998;
}
.picker-wrapper {
	position: fixed;
	left: 0;
	bottom: 0;
	width: 100%;
	background: #fff;
	border-radius: 24rpx 24rpx 0 0;
	z-index: 999;
	transform: translateY(100%);
	transition: transform 0.3s;
}
.picker-wrapper.show {
	transform: translateY(0);
}
.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 32rpx;
	border-bottom: 1rpx solid #eee;
}
.title {
	font-size: 34rpx;
	font-weight: 500;
}
.close {
	font-size: 40rpx;
	color: #999;
}
.picker-view {
	height: 400rpx;
}
.item {
	line-height: 80rpx;
	text-align: center;
	font-size: 32rpx;
}
.footer {
	display: flex;
	padding: 20rpx 40rpx 60rpx;
}
.btn {
	flex: 1;
	margin: 0 20rpx;
	border-radius: 48rpx;
	font-size: 32rpx;
	height: 88rpx;
}
.cancel {
	background: #f2f2f2;
	color: #333;
}
.sure {
	background: #07c160;
	color: #fff;
}
</style>
<script setup lang="ts">
import { computed, ref, watch } from "vue";

const props = defineProps<{
	modelValue: boolean;
	title?: string;
	defaultValue?: Date;
}>();

const emit = defineEmits(["update:modelValue", "confirm"]);

const visible = computed({
	get: () => props.modelValue,
	set: (v) => emit("update:modelValue", v),
});

// 生成数据
const years = Array.from({ length: 21 }, (_, i) => 2020 + i);
const months = Array.from({ length: 12 }, (_, i) => i + 1);
const days = Array.from({ length: 31 }, (_, i) => i + 1);
const hours = Array.from({ length: 24 }, (_, i) => i);
const minutes = Array.from({ length: 60 }, (_, i) => i);

// 当前选中索引
const pickerValue = ref([0, 0, 0, 0, 0]);

// 根据 defaultValue 初始化
watch(
	() => props.defaultValue,
	(d = new Date()) => {
		pickerValue.value = [years.indexOf(d.getFullYear()), d.getMonth(), d.getDate() - 1, d.getHours(), d.getMinutes()];
	},
	{ immediate: true },
);

function onChange(e: any) {
	pickerValue.value = e.detail.value;
}

function close() {
	visible.value = false;
}

function confirm() {
	const [yIdx, mIdx, dIdx, hIdx, minIdx] = pickerValue.value;
	const date = new Date(years[yIdx], mIdx, days[dIdx], hours[hIdx], minutes[minIdx]);
	emit("confirm", date);
	close();
}
</script>

<style scoped>
.mask {
	position: fixed;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.4);
	z-index: 998;
}
.picker-wrapper {
	position: fixed;
	left: 0;
	bottom: 0;
	width: 100%;
	background: #fff;
	border-radius: 24rpx 24rpx 0 0;
	z-index: 999;
	transform: translateY(100%);
	transition: transform 0.3s;
}
.picker-wrapper.show {
	transform: translateY(0);
}
.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 32rpx;
	border-bottom: 1rpx solid #eee;
}
.title {
	font-size: 34rpx;
	font-weight: 500;
}
.close {
	font-size: 40rpx;
	color: #999;
}
.picker-view {
	height: 400rpx;
}
.item {
	line-height: 80rpx;
	text-align: center;
	font-size: 32rpx;
}
.footer {
	display: flex;
	padding: 20rpx 40rpx 60rpx;
}
.btn {
	flex: 1;
	margin: 0 20rpx;
	border-radius: 48rpx;
	font-size: 32rpx;
	height: 88rpx;
}
.cancel {
	background: #f2f2f2;
	color: #333;
}
.sure {
	background: #07c160;
	color: #fff;
}
</style>
