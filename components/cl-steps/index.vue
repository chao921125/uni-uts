<template>
  <view class="vertical-steps">
    <view
      class="step"
      v-for="(item, idx) in steps"
      :key="idx"
    >
      <!-- 左侧：点 + 线（用伪元素） -->
      <view class="step-left">
        <view class="dot" :class="{ active: idx <= current }">
		</view>
      </view>
  
      <!-- 右侧：完全自定义内容 -->
      <view class="step-right">
        <view class="custom-box">
			<view class="time-opt">
				<text>2025-05-22 13:14:20</text>
				<view v-if="idx < 2" class="to-btn btn-sys">系统操作</view>
				<view v-else class="to-btn btn-day">日常记录</view>
			</view>
			<view class="opt-text">进行人工浇水，浇灌时间4分钟</view>
			<view class="opt-imgs" v-if="item.img">
				<image class="opt-img" :src="item.img" mode="aspectFit" />
			</view>
			<view class="opt-desc">看叶子有点儿打蔫，补补光试试看</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      current: 999999999,
      steps: [
        {
          title: '提交订单',
          desc: '2025-07-19 10:00\n这里可以写很多行文字\n甚至可以换行\n高度会自动撑开',
          img: '/static/logo.png',
          btn: '查看详情'
        },
        {
          title: '商家接单',
          desc: '商家已接单，正在备餐',
          btn: '联系商家'
        },
        {
          title: '配送中',
          desc: '骑手已取餐，预计 11:00 送达'
        },
        {
          title: '已完成',
          desc: '订单已送达\n感谢惠顾！'
        }
      ]
    };
  },
  methods: {
    handleBtn(idx) {
      uni.showToast({ title: `点击了第 ${idx + 1} 步按钮`, icon: 'none' });
    }
  }
};
</script>

<style scoped>
.vertical-steps {
  min-height: 10rpx;
  display: flex;
  flex-direction: column;
}

.step {
  display: flex;
  position: relative;
}

/* 左侧：点 + 竖线（用伪元素） */
.step-left {
  width: 60rpx;
  display: flex;
  justify-content: center;
  position: relative;
}

/* 竖线：伪元素，自动撑满父级高度 */
.step-left::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2rpx;
  background: rgba(77, 209, 207, 1);
  z-index: 0;
}

.dot {
  width: 23rpx;
  height: 23rpx;
  border-radius: 50%;
  background: #FFF;
  border: 1rpx solid rgba(77, 209, 207, 1);
  z-index: 1;
}

.dot.active::after {
  content: '';
  position: absolute;
  top: 4rpx;
  left: 22rpx;
  width: 19rpx;
  height: 19rpx;
  border-radius: 50%;
  background: rgba(77, 209, 207, 1);
  z-index: 0;
}

/* 最后一个步骤不画线 */
.step:last-child .step-left::before {
  display: none;
}

.step-right {
  flex: 1;
  margin-left: 10rpx;
  padding-bottom: 30rpx;
}

.custom-box {
	background: #FFFFFF;
	border-radius: 20rpx;
	padding: 30rpx;
}

.time-opt {
	font-weight: 400;
	font-size: 24rpx;
	color: #808080;
	line-height: 33rpx;
	text-align: left;
	font-style: normal;
	display: flex;
	justify-content: space-between;
}

.to-btn {
	display: inline-block;
	padding: 3rpx 15rpx 2rpx 16rpx;
	border-radius: 6rpx;
	font-weight: 400;
	font-size: 24rpx;
	line-height: 33rpx;
	text-align: center;
	font-style: normal;
}
.btn-sys {
	background: #F1FFFC;
	border: 1rpx solid #00B385;
	color: #00B385;
}
.btn-day {
	background: #F7F0FF;
	border: 1rpx solid #6524A5;
	color: #6524A5;
}

.opt-text {
	font-weight: 400;
	font-size: 24rpx;
	color: #808080;
	line-height: 33rpx;
	text-align: left;
	font-style: normal;
	margin-top: 17rpx;
}

.opt-imgs {
	margin-top: 30rpx;
}
.opt-img {
	width: 124rpx;
	height: 124rpx;
	border-radius: 10rpx;
	margin-right: 20rpx;
}

.opt-desc {
	font-weight: 400;
	font-size: 24rpx;
	color: #000000;
	line-height: 33rpx;
	text-align: left;
	font-style: normal;
	margin-top: 30rpx;
}
</style>