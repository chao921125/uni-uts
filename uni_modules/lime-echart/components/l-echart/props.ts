export default {
	// #ifdef MP-WEIXIN || MP-TOUTIAO
	type: {
		type: String,
		default: '2d'
	},
	// #endif
	// #ifdef APP-NVUE
	webviewStyles: Object,
	// #endif
	lStyle: String,
	isDisableScroll: Boolean,
	isClickable: {
		type: Boolean,
		default: true
	},
	enableHover: Boolean,
	beforeDelay: {
		type: Number,
		default: 30
	},
	landscape: Boolean,
	autoHideTooltip: {
		type: Boolean,
		default: false
	}
}