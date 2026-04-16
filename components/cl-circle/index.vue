<template>
	<view class="circle-progress" :style="{ width: size + 'rpx', height: size + 'rpx' }">
		<!-- 底层圆环 -->
		<!-- 使用转换后的px值 -->
		<canvas type="2d" class="circle-canvas" :width="canvasSize" :height="canvasSize" canvas-id="circleCanvas" ref="circleCanvas"></canvas>

		<!-- 自定义内容插槽 -->
		<view class="progress-content">
			<slot>
				<!-- 默认内容：进度百分比 -->
				<view
					class="progress-text"
					:style="{ 
          color: textColor,
          fontSize: textSize + 'rpx'  <!-- 文本大小使用rpx -->
        }">
					<text>{{ progress }}%</text>
				</view>
			</slot>
		</view>
	</view>
</template>

<script>
export default {
	name: "CircleProgress",
	props: {
		// 进度值，0-100
		progress: {
			type: Number,
			default: 0,
			validator: (value) => {
				return value >= 0 && value <= 100;
			},
		},
		// 圆环大小（rpx单位）
		size: {
			type: Number,
			default: 240, // 增大默认值，因为rpx相对px更小
		},
		// 圆环宽度（rpx单位）
		strokeWidth: {
			type: Number,
			default: 16, // rpx单位下适当增大
		},
		// 底层圆环颜色
		backgroundColor: {
			type: String,
			default: "#e5e5e5",
		},
		// 进度圆环颜色
		progressColor: {
			type: String,
			default: "#3498db",
		},
		// 文本颜色（仅用于默认内容）
		textColor: {
			type: String,
			default: "#333",
		},
		// 文本大小（rpx单位）
		textSize: {
			type: Number,
			default: 32, // rpx单位下适当增大
		},
		// 动画持续时间(ms)
		duration: {
			type: Number,
			default: 1000,
		},
	},
	computed: {
		// 将rpx转换为px，用于canvas绘制（canvas需要实际像素值）
		canvasSize() {
			// 获取屏幕宽度，微信小程序中1rpx = 屏幕宽度/750
			const screenWidth = uni.getWindowInfo().screenWidth || 750;
			// rpx转px公式：px = rpx * 屏幕宽度 / 750
			return (this.size * screenWidth) / 750;
		},
	},
	data() {
		return {
			ctx: null,
			animationTimer: null,
			currentProgress: 0,
			canvasReady: false,
			canvas: null,
		};
	},
	watch: {
		progress(newVal) {
			console.log("进度值变化:", newVal);
			this.drawProgress();
		},
		// 当size变化时重新初始化canvas
		size() {
			this.initCanvas();
		},
	},
	onReady() {
		console.log("组件onReady");
		this.initCanvas();
	},
	onUnload() {
		if (this.animationTimer) {
			clearInterval(this.animationTimer);
		}
	},
	methods: {
		// 初始化画布
		initCanvas() {
			console.log("开始初始化canvas，大小:", this.canvasSize);

			let query;
			// #ifdef MP-WEIXIN
			query = wx.createSelectorQuery().in(this);
			// #else
			query = uni.createSelectorQuery().in(this);
			// #endif

			query
				.select(".circle-canvas")
				.fields({ node: true, size: true })
				.exec((res) => {
					console.log("canvas查询结果:", res);

					if (!res || !res[0]) {
						console.error("获取canvas元素失败");
						return;
					}

					this.canvas = res[0].node;
					this.ctx = this.canvas.getContext("2d");

					if (!this.ctx) {
						console.error("获取2d上下文失败");
						return;
					}

					// 处理高清屏显示问题
					const dpr = uni.getWindowInfo().pixelRatio || 1;
					this.canvas.width = this.canvasSize * dpr; // 使用转换后的px值
					this.canvas.height = this.canvasSize * dpr;
					this.ctx.scale(dpr, dpr);

					this.canvasReady = true;
					console.log("canvas初始化完成");

					this.drawBackgroundCircle();
					this.drawProgress();
				});
		},

		// 绘制底层圆环
		drawBackgroundCircle() {
			if (!this.ctx) return;

			// 转换rpx为px用于绘制
			const center = this.canvasSize / 2;
			const strokeWidthPx = (this.strokeWidth * uni.getWindowInfo().screenWidth) / 750;
			const radius = center - strokeWidthPx / 2;

			this.ctx.beginPath();
			this.ctx.arc(center, center, radius, 0, 2 * Math.PI);
			this.ctx.lineWidth = strokeWidthPx;
			this.ctx.strokeStyle = this.backgroundColor;
			this.ctx.stroke();
		},

		// 绘制进度圆环
		drawProgressCircle(progress) {
			if (!this.ctx) return;

			// 转换rpx为px用于绘制
			const center = this.canvasSize / 2;
			const strokeWidthPx = (this.strokeWidth * uni.getWindowInfo().screenWidth) / 750;
			const radius = center - strokeWidthPx / 2;
			const startAngle = -0.5 * Math.PI;
			const endAngle = startAngle + (progress / 100) * 2 * Math.PI;

			this.ctx.clearRect(0, 0, this.canvasSize, this.canvasSize);
			this.drawBackgroundCircle();

			this.ctx.beginPath();
			this.ctx.arc(center, center, radius, startAngle, endAngle);
			this.ctx.lineWidth = strokeWidthPx;
			this.ctx.strokeStyle = this.progressColor;
			this.ctx.lineCap = "round";
			this.ctx.stroke();
		},

		// 带动画绘制进度
		drawProgress() {
			if (!this.canvasReady) {
				setTimeout(() => this.drawProgress(), 50);
				return;
			}

			if (this.animationTimer) {
				clearInterval(this.animationTimer);
			}

			const startProgress = this.currentProgress;
			const endProgress = this.progress;

			if (Math.abs(startProgress - endProgress) < 0.1) {
				this.drawProgressCircle(endProgress);
				return;
			}

			const totalFrames = Math.ceil(this.duration / 16);
			let frameCount = 0;
			const that = this;

			this.animationTimer = setInterval(() => {
				frameCount++;
				const progress = Math.min(frameCount / totalFrames, 1);
				const easeProgress = 1 - (1 - progress) * (1 - progress);
				that.currentProgress = startProgress + (endProgress - startProgress) * easeProgress;

				that.drawProgressCircle(that.currentProgress);

				if (progress >= 1) {
					clearInterval(that.animationTimer);
					that.animationTimer = null;
					that.currentProgress = endProgress;
				}
			}, 16);
		},
	},
};
</script>

<style scoped>
.circle-progress {
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
}

.circle-canvas {
	width: 100%;
	height: 100%;
	position: relative;
	z-index: 1;
}

.progress-content {
	position: absolute;
	z-index: 2;
	display: flex;
	justify-content: center;
	align-items: center;
}

.progress-text {
	font-weight: bold;
}
</style>
