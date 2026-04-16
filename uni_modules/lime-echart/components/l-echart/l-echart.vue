<template>
	<!-- #ifndef APP-NVUE || WEB -->
	<view class="lime-echart" 
		:style="[lStyle]" 
		v-if="canvasId" 
		ref="chartContainer" 
		:aria-label="'图表'">
		<canvas class="lime-echart__canvas" 
			type="2d" 
			:style="[styles]"
			:id="canvasId" 
			:disable-scroll="isDisableScroll"
			:canvas-id="canvasId"
			@touchstart="handleTouchStart" 
			@touchmove="handleTouchMove"
			@touchend="handleTouchEnd">
		</canvas>
	</view>
	<!-- #endif -->
	<!-- #ifdef WEB -->
	<div class="lime-echart" ref="chartContainer" :style="[styles, lStyle]"></div>
	<!-- #endif -->
	<!-- #ifdef APP-NVUE -->
	<view class="lime-echart" :style="[lStyle]">
		<web-view class="lime-echart__canvas" 
			:webview-styles="webviewStyles" 
			:style="[styles]"
			ref="chartContainer"
			src="/uni_modules/lime-echart/static/app/uvue.html?v=1" 
			@pagefinish="isInitialized = true"
			@onPostMessage="handleWebviewMessage"></web-view>
	</view>
	<!-- #endif -->
</template>

<script lang="ts">
	// @ts-nocheck
	import { defineComponent, getCurrentInstance, ref, onMounted, nextTick, onBeforeUnmount, watch, computed } from './vue'
	import echartProps from './props'
	
	// #ifndef APP-NVUE || WEB
	import { Canvas, setCanvasCreator, dispatch } from './canvas';
	import { wrapTouch, convertTouchesToArray, devicePixelRatio ,sleep, canIUseCanvas2d, getRect, getDeviceInfo } from './utils';
	// #endif
	// #ifdef APP-NVUE
	import { base64ToPath, sleep } from './utils';
	import { Echarts } from './nvue'
	// #endif
	// #ifdef WEB
	import * as echartsLibrary from '@/uni_modules/lime-echart/static/web/echarts.esm.min.js';
	// #endif
	
	// #ifdef APP-VUE
	// #ifdef VUE3
	import '@/uni_modules/lime-echart/static/app/echarts.min.js';
	const echartsLibrary = globalThis.echarts
	// #endif
	// #ifdef VUE2
	import * as echartsLibrary from '@/uni_modules/lime-echart/static/web/echarts.esm.min.js';
	// #endif
	// #endif
	export default defineComponent({
		props: echartProps,
		emits: ['finished'],
		setup(props, { emit, expose }) {
			// #ifndef APP-NVUE || WEB || APP-VUE
			let echartsLibrary = null
			// #endif
			
			const instance = getCurrentInstance()!;
			const canvasId = `lime-echart-${instance.uid}`
			const isInitialized = ref(false)
			const chartContainer = ref(null)
			
			type ChartOptions = Record<string, any>
			type EChartsInstance = typeof echartsLibrary
			type EChartsResolveCallback = (value: EChartsInstance) => void
			
			const initializationQueue = [] as EChartsResolveCallback[]
			const callbackQueue = [] as EChartsResolveCallback[]
			
			let chartInstance: null | EChartsInstance = null
			
			const styles = computed(()=> {
				if(props.landscape) {
					return {
						transform: 'translate(-50%,-50%) rotate(90deg)', 
						top: '50%',
						left: '50%',
					}
				}
				return {}
			})
			
			const checkInitialization = (): boolean => {
				if(chartInstance) return false
				console.warn(`组件还未初始化，请先使用 init`)
				return true
			}
			
			const setOption = (options: ChartOptions) => {
				if (checkInitialization()) return
				chartInstance!.setOption(options);
			}
			
			const hideLoading = () => {
				if (checkInitialization()) return
				chartInstance!.showLoading();
			}
			
			const showLoading = () => {
				if (checkInitialization()) return
				chartInstance!.hideLoading();
			}
			
			const clear = () => {
				if (checkInitialization()) return
				chartInstance!.clear();
			}
			
			const dispose = () => {
				if (checkInitialization()) return
				chartInstance!.dispose();
			}
			const processInitializationQueue = () => {
				while (initializationQueue.length > 0) {
					if (chartInstance != null) {
						const resolve = initializationQueue.pop() as EChartsResolveCallback
						resolve(chartInstance!)
					}
				}
				
				if (chartInstance != null) {
					while (callbackQueue.length > 0) {
						const callback = callbackQueue.pop() as EChartsResolveCallback
						callback(chartInstance!)
					}
				}
			}
			
			const resize = (dimensions?: { width?: number; height?: number }) => {
				if (checkInitialization()) return
				// #ifdef APP-NVUE || WEB
				chartInstance!.resize(dimensions);
				// #endif
				// #ifndef APP-NVUE || WEB
				getRect(`#${canvasId}`, instance.proxy).then(res => {
					chartInstance!.resize({width: res.width, height: res.height});
				})
				// #endif
			}
			
			// #ifdef APP-NVUE
			let chartFile = ref(null);
			const handleWebviewMessage = (e) => {
				const detail = e?.detail?.data[0] || null;
				const data = detail?.data
				const key = detail?.event
				const options = data?.options
				const event = data?.event
				const file = detail?.file
				if (key == 'log' && data) {
					console.log(data)
				}
				if(event) {
					chartInstance.dispatchAction(event.replace(/"/g,''), options)
				}
				if(file) {
					chartFile.value = file
				}
			}
			
			const canvasToTempFilePath = (options: ChartOptions) => {
				if (checkInitialization()) return
				chartContainer.value.evalJs(`canvasToTempFilePath()`);
				watch(chartFile, async (file) =>{
					if(!file) return
					const tempFilePath = await base64ToPath(file)
					options.success({tempFilePath})
				})
			}
			
			const getContext = () => {
				if(isInitialized.value) {
					return Promise.resolve(isInitialized.value)
				}
				return new Promise(resolve => {
					watch(isInitialized, (val) =>{
						if(!val) return
						resolve(val)
					})
				})
			}
			const init = async (echarts, ...args) => {
				let theme: string | null = null
				let config:Record<string, any> = {}
				let callback: Function | null = null;
							
				args.forEach(item => {
					if (typeof item === 'function') {
						callback = item
					} else if (typeof item === 'string') {
						theme = item
					} else if (typeof item === 'object') {
						config = item
					}
				})
				if(props.beforeDelay) {
					await sleep(props.beforeDelay)
				}
				await getContext();
				chartInstance = new Echarts(chartContainer.value)
				chartContainer.value.evalJs(`init(null, null, ${JSON.stringify(config)}, ${theme})`)
				if (callback && typeof callback === 'function') {
					callbackQueue.push(callback)
				}
				
				return new Promise<EChartsInstance>((resolve) => {
					nextTick(()=>{
						initializationQueue.push(resolve)
						processInitializationQueue()
					})
				})
			}
			
			// #endif
			
			
			// #ifndef APP-NVUE || WEB
			let canvasNode;
			const canvasToTempFilePath = (options: ChartOptions) => {
				if (checkInitialization()) return
				if(canvasNode) {
					options.success?.({
						tempFilePath: canvasNode.toDataURL()
					}) 
				} else {
					uni.canvasToTempFilePath({
						...options,
						canvasId
					}, instance.proxy);
				}
			}
			
			const getContext = () => {
				return getRect(`#${canvasId}`, instance.proxy).then(res => {
					let dpr = devicePixelRatio
					let {width, height, node} = res
					let canvas: Canvas | null = null;
					if(!(width || height)) {
						return Promise.reject('no rect')
					}
					if(node && node.getContext) {
						const ctx = node.getContext('2d');
						canvas = new Canvas(ctx, instance.proxy, true, node);
						canvasNode = node
					} else {
						dpr = 1
						const ctx = uni.createCanvasContext(canvasId, instance.proxy);
						canvas = new Canvas(ctx, instance.proxy, false);
					}
					return { canvas, width, height, devicePixelRatio: dpr, node }
				})
			}
			const getTouch = (e) => {
				const touches = e.touches[0]
				const touch = props.landscape 
					? 	{
							x: touches.y,
							y: touches.x
						}
					:  {
							x: touches.x,
							y: touches.y
						}
				return touch
			}
			const handleTouchStart = (e) => {
				if (chartInstance == null) return
				const handler = chartInstance.getZr().handler;
				const touch = getTouch(e)
				dispatch.call(handler, 'mousedown', touch)
				dispatch.call(handler, 'mousemove', touch)
				handler.processGesture(wrapTouch(e), 'start');
			}
			const handleTouchMove = (e) => {
				if (chartInstance == null) return
				const handler = chartInstance.getZr().handler;
				const touch = getTouch(e)
				dispatch.call(handler, 'mousemove', touch)
				handler.processGesture(wrapTouch(e), 'change');
			}
			const handleTouchEnd = (e) => {
				if (chartInstance == null) return
				const handler = chartInstance.getZr().handler;
				const touch = e.changedTouches ? e.changedTouches[0] : {}
				handler.processGesture(wrapTouch(e), 'end');
				dispatch.call(handler, 'mouseup', touch)
				dispatch.call(handler, 'click', touch)
			}
			const init = async (echartsLib: EChartsInstance = echartsLibrary, ...args: any[]): Promise<EChartsInstance> => {
				const library = echartsLib || echartsLibrary
				if (!library) {
					console.error('ECharts library is required');
					return Promise.reject('ECharts library is required');
				}
				let theme: string | null = null
				let config:Record<string, any> = {}
				let callback: Function | null = null;
			
				args.forEach(item => {
					if (typeof item === 'function') {
						callback = item
					} else if (typeof item === 'string') {
						theme = item
					} else if (typeof item === 'object') {
						config = item
					}
				})
				if(props.beforeDelay) {
					await sleep(props.beforeDelay)
				}
				let options = await getContext();
				setCanvasCreator(library, options)
				chartInstance = library.init(options.canvas, theme, Object.assign({}, options, config))
				if (callback && typeof callback === 'function') {
					callbackQueue.push(callback)
				}
				return new Promise<EChartsInstance>((resolve) => {
					initializationQueue.push(resolve)
					processInitializationQueue()
				})
			}
			
			// #endif
			
			
			// #ifdef WEB
			const canvasToTempFilePath = (options: ChartOptions) => {
				if (checkInitialization()) return
				options.success?.({
					tempFilePath: chartInstance._api.getDataURL()
				}) 
			}
			
			const init = async (echarts: EChartsInstance = echartsLibrary, ...args: any[]): Promise<EChartsInstance> => {
				const library = echarts || echartsLibrary
				if (!library) {
					console.error('ECharts library is required');
					return Promise.reject('ECharts library is required');
				}
				
				let theme: string | null = null
				let config = {}
				let callback: Function | null = null;

				args.forEach(item => {
					if (typeof item === 'function') {
						callback = item
					} else if (typeof item === 'string') {
						theme = item
					} else if (typeof item === 'object') {
						config = item
					}
				})
				
				// Configure ECharts environment
				library.env.domSupported = true
				library.env.hasGlobalWindow = true
				library.env.node = false
				library.env.pointerEventsSupported = false
				library.env.svgSupported = true
				library.env.touchEventsSupported = true
				library.env.transform3dSupported = true
				library.env.transformSupported = true
				library.env.worker = false
				library.env.wxa = false
				
				chartInstance = library.init(chartContainer.value, theme, config)
				
				if (callback != null && typeof callback === 'function') {
					callbackQueue.push(callback)
				}
				
				return new Promise<EChartsInstance>((resolve) => {
					initializationQueue.push(resolve)
					processInitializationQueue()
				})
			}
			// #endif
			
			
			
			
			onMounted(() => {
				nextTick(() => {
					// #ifndef APP-NVUE
					isInitialized.value = true
					// #endif
					emit('finished')
					processInitializationQueue()
				})
			})
			onBeforeUnmount(()=> {
				clear()
				dispose()
			})
			
			// #ifdef VUE3
			expose({
				init,
				setOption,
				hideLoading,
				showLoading,
				clear,
				dispose,
				resize,
				canvasToTempFilePath
			})
			// #endif

			return {
				canvasId,
				chartContainer,
				styles,
				// #ifndef WEB || APP-NVUE
				handleTouchStart,
				handleTouchMove,
				handleTouchEnd,
				// #endif
				
				// #ifdef APP-NVUE
				handleWebviewMessage,
				isInitialized,
				// #endif
				
				// #ifdef VUE2
				init,
				setOption,
				hideLoading,
				showLoading,
				clear,
				dispose,
				resize,
				canvasToTempFilePath,
				// #endif
			}
		}
	})
</script>

<style>
	.lime-echart {
		position: relative;
		/* #ifndef APP-NVUE */
		width: 100%;
		height: 100%;
		/* #endif */
		/* #ifdef APP-NVUE */
		flex: 1;
		/* #endif */
	}

	.lime-echart__canvas {
		/* #ifndef APP-NVUE */
		width: 100%;
		height: 100%;
		/* #endif */
		/* #ifdef APP-NVUE */
		flex: 1;
		/* #endif */
	}

	/* #ifndef APP-NVUE */
	.lime-echart__mask {
		position: absolute;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		z-index: 1;
	}
	/* #endif */
</style>