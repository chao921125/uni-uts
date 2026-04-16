## 2.0.7（2026-02-05）
- fix: 修复非web无法缩放问题
## 2.0.6（2025-12-13）
- feat: 修复类型问题
## 2.0.5（2025-12-12）
- fix: 修复uniappx 微信小程序模糊问题
## 2.0.4（2025-12-12）
- fix: 修复uniapp vue2 app引入依赖报错问题
## 2.0.3（2025-12-04）
- feat: autoHideTooltip默认为false
## 2.0.2（2025-11-24）
- feat: 增加`autoHideTooltip`属性
## 2.0.1（2025-10-28）
- chore: 更新文档
## 2.0.0（2025-10-28）
- feat: 基于 Vue 3 Composition API 重构 uni-app 端组件，提升代码可维护性和性能
- feat: 升级内置 ECharts 至 v6 版本，支持最新图表特性和性能优化
## 1.0.4（2025-05-16）
- fix: 修复uniappx ios尺寸
## 1.0.3（2025-05-10）
- fix: 修复nvue缺少`isDisposed`
## 1.0.2（2025-03-21）
- fix: 修复词云无法设置字体大小的问题
## 1.0.1（2025-03-14）
- fix: 修复抖音小程序不显示问题
## 1.0.0（2025-02-27）
- fix: 修复uniappx微信小程序不显示问题
## 0.9.9（2025-02-24）
- feat: 更新v4
## 0.9.8（2024-12-20）
- fix: 修复 APP 无法放大问题
## 0.9.7（2024-12-02）
- feat: uniapp 增加`landscape`，当`landscape`为`true`时旋转90deg达到横屏效果。
- feat: 支持uniapp x 微信小程序
## 0.9.6（2024-07-23）
- fix: 修复 uni is not defined
## 0.9.5（2024-07-19）
- chore: 鸿蒙`measureText`为异步，异步字体不正常，使用模拟方式。
## 0.9.4（2024-07-18）
- chore: 更新文档
## 0.9.3（2024-07-16）
- feat: 鸿蒙 canvas 事件缺失，待官方修复，如何在鸿蒙使用请看文档`常见问题 vue3` 
## 0.9.2（2024-07-12）
- chore: 删除多余文件
## 0.9.1（2024-07-12）
- fix: 修复 安卓5不显示图表问题
## 0.9.0（2024-06-13）
- chore: 合并nvue和uvue
## 0.8.9（2024-05-19）
- chore: 更新文档
## 0.8.8（2024-05-13）
- chore: 更新文档和uvue示例
## 0.8.7（2024-04-26）
- fix: uniapp x需要HBX 4.13以上
## 0.8.6（2024-04-10）
- feat: 支持 uniapp x ios
## 0.8.5（2024-04-03）
- fix: 修复 nvue `reset`传值不生效问题
- feat: 支持 uniapp x web
## 0.8.4（2024-01-27）
- chore: 更新文档
## 0.8.3（2024-01-21）
- chore: 更新文档
## 0.8.2（2024-01-21）
- feat: 支持 `uvue`
## 0.8.1（2023-08-24）
- fix: app 的`touch`事件为`object` 导致无法显示 `tooltip`
## 0.8.0（2023-08-22）
- fix: 离屏 报错问题
- fix: 微信小程序PC无法使用事件
- chore: 更新文档
## 0.7.9（2023-07-29）
- chore: 更新文档
## 0.7.8（2023-07-29）
- fix: 离屏 报错问题
## 0.7.7（2023-07-27）
- chore: 更新文档
- chore: lime-echart 里的示例使用自定tooltips
- feat: 对支持离屏的使用离屏创建(微信、字节、支付宝)
## 0.7.6（2023-06-30）
- fix: vue3 报`width`的错
## 0.7.5（2023-05-25）
- chore: 更新文档 和 demo, 使用`lime-echart`这个标签即可查看示例
## 0.7.4（2023-05-22）
- chore: 增加关于钉钉小程序上传时提示安全问题的说明及修改建议
## 0.7.3（2023-05-16）
- chore: 更新 vue3 非微信小程序平台可能缺少`wx`的说明
## 0.7.2（2023-05-16）
- chore: 更新 vue3 非微信小程序平台的可以缺少`wx`的说明
## 0.7.1（2023-04-26）
- chore: 更新demo，使用`lime-echart`这个标签即可查看示例
- chore：微信小程序的`tooltip`文字有阴影，怀疑是微信的锅，临时解决方法是`tooltip.shadowBlur = 0`
## 0.7.0（2023-04-24）
- fix: 修复`setAttribute is not a function`
## 0.6.9（2023-04-15）
- chore: 更新文档，vue3请使用echarts esm的包
## 0.6.8（2023-03-22）
- feat: mac pc无法使用canvas 2d
## 0.6.7（2023-03-17）
- feat: 更新文档
## 0.6.6（2023-03-17）
- feat: 微信小程序PC已经支持canvas 2d，故去掉判断PC
## 0.6.5（2022-11-03）
- fix: 某些手机touches为对象，导致无法交互。
## 0.6.4（2022-10-28）
- fix: 优化点击事件的触发条件
## 0.6.3（2022-10-26）
- fix: 修复 dataZoom 拖动问题
## 0.6.2（2022-10-23）
- fix: 修复 飞书小程序 尺寸问题
## 0.6.1（2022-10-19）
- fix: 修复 PC mousewheel 事件 鼠标位置不准确的BUG，不兼容火狐！
- feat: showLoading 增加传参
## 0.6.0（2022-09-16）
- feat: 增加PC的mousewheel事件
## 0.5.4（2022-09-16）
- fix: 修复 nvue 动态数据不显示问题
## 0.5.3（2022-09-16）
- feat: 增加enableHover属性， 在PC端时当鼠标进入显示tooltip，不必按下。
- chore: 更新文档
## 0.5.2（2022-09-16）
- feat: 增加enableHover属性， 在PC端时当鼠标进入显示tooltip，不必按下。
## 0.5.1（2022-09-16）
- fix: 修复nvue报错
## 0.5.0（2022-09-15）
- feat: init(echarts, theme?:string, opts?:{}, callback: function(chart))
## 0.4.8（2022-09-11）
- feat: 增加 @finished
## 0.4.7（2022-08-24）
- chore: 去掉 stylus
## 0.4.6（2022-08-24）
- feat: 增加 beforeDelay
## 0.4.5（2022-08-12）
- chore: 更新文档
## 0.4.4（2022-08-12）
- fix: 修复 resize 无参数时报错
## 0.4.3（2022-08-07）
# 评论有说本插件对新手不友好，让我做不好就不要发出来。 还有的说跟官网一样，发出来做什么，给我整无语了。
# 所以在此提醒一下准备要下载的你，如果你从未使用过 echarts 请不要下载 或 谨慎下载。
# 如果你确认要下载，麻烦看完文档。还有请注意插件是让echarts在uniapp能运行，API 配置请自行去官网查阅!
# 如果你不会echarts 但又需要图表，市场上有个很优秀的图表插件 uchart 你可以去使用这款插件，uchart的作者人很好，也热情。
# 每个人都有自己的本职工作，如果你能力强可以自行兼容，如果使用了他人的插件也麻烦尊重他人的成果和劳动时间。谢谢。
# 为了心情愉悦，本人已经使用插件屏蔽差评。
- chore: 更新文档
## 0.4.2（2022-07-20）
- feat: 增加 resize
## 0.4.1（2022-06-07）
- fix: 修复 canvasToTempFilePath 不生效问题
## 0.4.0（2022-06-04）
- chore 为了词云 增加一个canvas 标签
- 词云下载地址[echart-wordcloud](https://ext.dcloud.net.cn/plugin?id=8430)
## 0.3.9（2022-06-02）
- chore: 更新文档
- tips: lines 不支持 `trailLength`
## 0.3.8（2022-05-31）
- fix: 修复 因mouse事件冲突tooltip跳动问题
## 0.3.7（2022-05-26）
- chore: 更新文档
- chore: 设置默认宽高300px
- fix: 修复 vue3 微信小程序 拖影BUG
- chore: 支持PC
## 0.3.5（2022-04-28）
- chore: 更新使用方式
- 🔔 必须使用hbuilderx 3.4.8-alpha以上
## 0.3.4（2021-08-03）
- chore: 增加 setOption的参数值
## 0.3.3（2021-07-22）
- fix: 修复 径向渐变报错的问题
## 0.3.2（2021-07-09）
- chore: 统一命名规范，无须主动引入组件
## [代码示例站点1](https://limeui.qcoon.cn/#/echart-example)
## [代码示例站点2](http://liangei.gitee.io/limeui/#/echart-example)
## 0.3.1（2021-06-21）
- fix: 修复 app-nvue ios is-enable 无效的问题
## [代码示例站点1](https://limeui.qcoon.cn/#/echart-example)
## [代码示例站点2](http://liangei.gitee.io/limeui/#/echart-example)
## 0.3.0（2021-06-14）
- fix: 修复 头条系小程序 2d 报 JSON.stringify 的问题
- 目前 头条系小程序 2d 无法在开发工具上预览，划动图表页面无法滚动，axisLabel 字体颜色无法更改，建议使用非2d。
## 0.2.9（2021-06-06）
- fix: 修复 头条系小程序 2d 放大的BUG 
- 头条系小程序 2d 无法在开发工具上预览，也存在划动图表页面无法滚动的问题。
## [代码示例：http://liangei.gitee.io/limeui/#/echart-example](http://liangei.gitee.io/limeui/#/echart-example)
## 0.2.8（2021-05-19）
- fix: 修复 微信小程序 PC 显示过大的问题
## 0.2.7（2021-05-19）
- fix: 修复 微信小程序 PC 不显示问题
## [代码示例：http://liangei.gitee.io/limeui/#/echart-example](http://liangei.gitee.io/limeui/#/echart-example)
## 0.2.6（2021-05-14）
- feat: 支持 `image`
- feat: props 增加 `ec.clear`，更新时是否先删除图表样式 
- feat: props 增加 `isDisableScroll` ，触摸图表时是否禁止页面滚动
- feat: props 增加 `webviewStyles` ，webview 的样式, 仅nvue有效
## 0.2.5（2021-05-13）
- docs: 插件用到了css 预编译器 [stylus](https://ext.dcloud.net.cn/plugin?name=compile-stylus) 请安装它
## 0.2.4（2021-05-12）
- fix: 修复 百度平台 多个图表ctx 和 渐变色 bug
- ## [代码示例：http://liangei.gitee.io/limeui/#/echart-example](http://liangei.gitee.io/limeui/#/echart-example)
## 0.2.3（2021-05-10）
- feat: 增加 `canvasToTempFilePath` 方法，用于生成图片
```js
this.$refs.chart.canvasToTempFilePath({success: (res) => {
	console.log('tempFilePath:', res.tempFilePath)
}})
```
## 0.2.2（2021-05-10）
- feat: 增加 `dispose` 方法，用于销毁实例
- feat: 增加 `isClickable` 是否派发点击
- feat: 实验性的支持 `nvue` 使用要慎重考虑
- ## [代码示例：http://liangei.gitee.io/limeui/#/echart-example](http://liangei.gitee.io/limeui/#/echart-example)
## 0.2.1（2021-05-06）
- fix：修复 微信小程序 json 报错
- chore: `reset` 更改为 `setChart`
- feat: 增加 `isEnable` 开启初始化 启用这个后 无须再使用`init`方法
```html
<l-echart ref="chart" is-enable />
```
```js
// 显示加载
this.$refs.chart.showLoading()
// 使用实例回调
this.$refs.chart.setChart(chart => ...code)
// 直接设置图表配置
this.$refs.chart.setOption(data)
```
## 0.2.0（2021-05-05）
- fix：修复 头条 百度 偏移的问题
- docs: 更新文档
## [代码示例：http://liangei.gitee.io/limeui/#/echart-example](http://liangei.gitee.io/limeui/#/echart-example)
## 0.1.0（2021-05-02）
- chore:  第一次上传，基本全端兼容，使用方法与官网一致。
- 已知BUG：非2d 无法使用背景色，已反馈官方
- 已知BUG：头条 百度 有许些偏移
- 后期计划：兼容nvue
