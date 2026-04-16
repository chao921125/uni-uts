# lime-echart 📊

为 UniApp 和 UniAppX 提供 ECharts 图表兼容支持，使 ECharts 图表能在 H5、小程序、App 等多端环境中正常运行。

## 特性 ✨

- 📱 **跨平台兼容**：支持 H5、微信小程序、支付宝小程序、App 等多端
- 🎯 **简单易用**：统一 API，使用方式与原生 ECharts 基本一致
- ⚡ **性能优化**：针对不同平台进行了渲染优化
- 🔄 **双框架支持**：同时支持 uni-app 和 uni-app-x

## 文档与示例 📚

更多详细文档与示例：
- [lime-echart 组件文档](https://limeui.qcoon.cn/#/echart)
- [在线示例](https://limeui.qcoon.cn/#/echart-example)
- [ECharts 官方示例](https://echarts.apache.org/examples/zh/index.html)
- [lime-echart 组件文档2](https://limex.qcoon.cn/components/echart.html) (将来用到，目前未上线)

## 安装方法 📦

### 插件市场安装

1. 在uni-app插件市场中搜索并导入`lime-echart`
2. 导入后重新编译项目
3. 在页面中直接使用 `l-echart` 组件

### CLI 项目安装

```bash
# 下载插件到项目的 src/uni_modules 目录
mkdir -p src/uni_modules
# 将插件解压到上述目录
```

## 前置依赖 ⚙️

### 小程序平台（重点说明）

小程序平台必须下载并引入 ECharts 自定义构建包：

1. 小程序中引入ECharts方式：
   - **本地构建文件**
     - 访问 [ECharts 在线构建](https://echarts.apache.org/zh/builder.html) 下载所需图表类型的精简版
     - 注意：在线构建工具**仅支持生成UMD格式**（默认，`echarts.min.js`），通过 `require` 引入
   - 建议只勾选项目所需的图表类型和组件，以减小文件体积

2. **文件放置位置**：
   - 📁 **主包**：将文件放入项目根目录的 `static` 文件夹
   - 📁 **分包**：将文件放入对应分包的 `static` 文件夹（如 `pagesB/static/`）

3. **相对路径引用示例**：
   ```js
   // UMD格式 - 页面位于主包根目录 - 相对路径引用示例（仅在线构建或本地文件使用）
   // ├─pages
   // │  └─index
   // │     └─index.vue
   // └─static
   const echarts = require('../../static/echarts.min.js')
   
   // UMD格式 - 页面位于主包三层目录 - 相对路径引用示例（仅在线构建或本地文件使用）
   // ├─pages
   // │  └─user
   // │     └─settings
   // │        └─profile.vue
   // └─static
   const echarts = require('../../../static/echarts.min.js')
   
   // UMD格式 - 页面位于分包中 - 相对路径引用示例（仅在线构建或本地文件使用）
   // ├─pagesB (分包)
   // │  ├─static
   // │  └─detail
   // │     └─detail.vue
   const echarts = require('../static/echarts.min.js')
   
   // ES模块格式 
   import * as echarts from 'echarts'
   ```

   > 注意：
   > - `require` 是小程序平台特有的API，仅在小程序环境下使用
   > - 路径是相对于当前页面文件的路径，请根据实际项目结构调整路径


## 使用示例 🎯

### 图表配置项示例

以下是一个柱状图的配置项示例，在后续使用示例中将引用此配置：

```js
// 图表配置项示例 - 柱状图
const chartOption = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
    confine: true
  },
  legend: {
    data: ['热度', '正面', '负面']
  },
  xAxis: [
    {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#999999'
        }
      },
      axisLabel: {
        color: '#666666'
      }
    }
  ],
  yAxis: [
    {
      type: 'category',
      axisTick: { show: false },
      data: ['汽车之家', '今日头条', '百度贴吧', '一点资讯', '微信', '微博', '知乎'],
      axisLine: {
        lineStyle: {
          color: '#999999'
        }
      },
      axisLabel: {
        color: '#666666'
      }
    }
  ],
  series: [
    {
      name: '热度',
      type: 'bar',
      label: {
        show: true,
        position: 'inside'
      },
      data: [300, 270, 340, 344, 300, 320, 310]
    },
    {
      name: '正面',
      type: 'bar',
      stack: '总量',
      label: {
        show: true
      },
      data: [120, 102, 141, 174, 190, 250, 220]
    },
    {
      name: '负面',
      type: 'bar',
      stack: '总量',
      label: {
        show: true,
        position: 'left'
      },
      data: [-20, -32, -21, -34, -90, -130, -110]
    }
  ]
}
```

> **说明**：在实际项目中，可以根据需求修改上述配置项。
> - 更多配置选项请参考 [ECharts 官方文档](https://echarts.apache.org/zh/option.html)
> - 查看更多图表样式请访问 [ECharts 官方示例](https://echarts.apache.org/examples/zh/index.html)

### uni-app 使用方式

#### 组合式 API 方式

```html
<template>
  <view style="width: 750rpx; height: 750rpx;">
    <l-echart ref="chartRef" @finished="initChart"></l-echart>
  </view>
</template>
```

```js
import { ref } from 'vue';

const chartRef = ref(null)

// 仅在小程序环境下引入 ECharts
// #ifdef MP
const echarts = require('../../static/echarts.min.js') // 根据实际路径调整
// #endif
// #ifndef MP
const echarts = null // H5 和 App 环境不需要手动引入
// #endif

// 使用上面定义的图表配置项
const option = chartOption

// 初始化图表
const initChart = async () => {
  if (!chartRef.value) return
  
  try {
    const chart = await chartRef.value.init(echarts)
    chart.setOption(option)
  } catch (error) {
    console.error('图表初始化失败:', error)
  }
}
```

#### 选项式 API 方式

```html
<template>
  <view style="width: 750rpx; height: 750rpx;">
    <l-echart ref="chartRef" @finished="initChart"></l-echart>
  </view>
</template>
```

```js
// 仅在小程序环境下引入 ECharts
// #ifdef MP
const echarts = require('../../static/echarts.min.js') // 根据实际路径调整
// #endif
// #ifndef MP
const echarts = null // H5 和 App 环境不需要手动引入
// #endif

export default {
  data() {
    return {
      // 使用上面定义的图表配置项
      option: chartOption,
      // 图表实例，用于后续操作
      chartInstance: null,
    }
  },
  methods: {
    // 初始化图表
    async initChart() {
      if (!this.$refs.chartRef) return
      
      try {
        this.chartInstance = await this.$refs.chartRef.init(echarts)
        this.chartInstance.setOption(this.option)
      } catch (error) {
        console.error('图表初始化失败:', error)
      }
    },
    // 更新图表数据
    updateChart(newOption) {
      if (this.chartInstance) {
        this.chartInstance.setOption(newOption)
      } else if (this.$refs.chartRef) {
        this.$refs.chartRef.setOption(newOption)
      }
    },
    // 调整图表大小
    resizeChart() {
      if (this.$refs.chartRef) {
        this.$refs.chartRef.resize()
      }
    }
  },
  // 页面卸载时销毁图表实例
  beforeUnmount() {
    if (this.$refs.chartRef) {
      this.$refs.chartRef.dispose()
    }
  }
}
```

### uni-app-x 使用方式

```html
<template>
  <view style="width: 100%; height: 408px;">
    <l-echart ref="chartRef" @finished="initChart"></l-echart>
  </view>
</template>
```

```ts
const chartRef = ref<LEchartComponentPublicInstance | null>(null)

// 仅在小程序环境下引入 ECharts
// #ifdef MP
const echarts = require('../../static/echarts.min.js') // 根据实际路径调整
// #endif
// #ifndef MP
const echarts = null
// #endif

// 使用上面定义的图表配置项
const option = chartOption

// 初始化图表
const initChart = async () => {
  if (chartRef.value === null) return
  
  try {
    const chart = await chartRef.value.init(echarts, null)
    chart.setOption(option)
  } catch (error) {
    console.error('图表初始化失败:', error)
  }
}
```


## 高级功能 💪

### 数据更新 🔄

图表支持动态更新数据，有两种常用方式：

#### 方式一：通过组件引用更新

```js
// Vue 3 Composition API
chartRef.value?.setOption(newOption)

// Vue 2 Options API
this.$refs.chart.setOption(newOption)
```

#### 方式二：通过图表实例更新

```js
// 在初始化时保存图表实例
let chartInstance = null

const initChart = async () => {
  if (!chartRef.value) return
  chartInstance = await chartRef.value.init(echarts)
  chartInstance.setOption(option)
}

// 后续更新数据
const updateChart = () => {
  if (chartInstance) {
    chartInstance.setOption(newData)
  }
}
```

### 图表大小调整 📏

当容器大小改变时，可以调用 `resize` 方法重新调整图表尺寸：

```js
// 自动适应容器大小
chartRef.value?.resize()

// 手动指定尺寸
chartRef.value?.resize({
  width: 375,  // 像素值
  height: 375  // 像素值
})
```

**💡 提示**：在窗口大小变化或屏幕旋转时，可以监听相应事件并调用 `resize` 方法。

### Vue 2 兼容配置 🔄

如果您的项目使用 Vue 2，需要先安装并引入 Vue Composition API：

```js
// main.js
import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
Vue.use(VueCompositionAPI)
```

详细配置请参考：[Vue Composition API 官方文档](https://uniapp.dcloud.net.cn/tutorial/vue-composition-api.html)

### 组件标签说明 🏷️

| 标签名 | 说明 |
|-------|------|
| `l-echart` | 正式使用的组件标签 |
| `lime-echart` | 演示用组件标签 |

### 快速预览 🚀

导入插件后，可以直接使用演示标签查看效果：

```html
<template>
  <view style="width: 100%; height: 400px;">
    <!-- 演示组件 -->
    <lime-echart />
  </view>
</template>
```

## 常见问题与解决方案 🐛

### 平台特殊问题

#### 微信小程序
- **画布层级问题**：微信开发工具中 canvas 可能出现层级过高或不跟随页面滚动的情况，真机环境下通常不受影响
- **Tooltip 阴影**：如需去除文字阴影，可添加配置：`tooltip.shadowBlur = 0`

#### 钉钉小程序
- **文字测量精度**：由于钉钉小程序没有原生 `measureText`，字体粗细测量可能不够精确
- **安全扫描警告**：如遇到 `Uint8Clamped` 安全问题，可按以下方式修改 ECharts 文件：
  ```js
  // 查找类似代码并修改
  // 原代码
  ["Int8","Uint8","Uint8Clamped","Int16","Uint16","Int32","Uint32","Float32","Float64"],(function(t,e){return t["[object "+e+"Array]"]
  // 修改为
  ["Int8","Uint8","Uint8_Clamped","Int16","Uint16","Int32","Uint32","Float32","Float64"],(function(t,e){return t["[object "+e.replace('_','')+"Array]"]
  ```

### 功能限制 ⚠️
- **Toolbox**：不支持 `saveImage` 功能
- **Lines 图表**：不支持 `trailLength` 属性，请设置为 `0`
- **DataZoom**：H5 平台不建议设置 `showDetail` 属性
- **自定义 Tooltips**：uvue 和 vue 中不支持 DOM 操作相关的自定义 Tooltips

## API 参考 📝

### Props

| 参数 | 说明 | 类型 | 默认值 | 版本 |
|------|------|------|--------|------|
| l-style | 自定义样式 | string | - | - |
| type | 指定 canvas 类型（废除） | string | "2d" | - |
| is-disable-scroll | 触摸图表时是否禁止页面滚动 | boolean | false | - |
| beforeDelay | 延迟初始化时间（毫秒） | number | 30 | - |
| enableHover | PC端是否启用鼠标悬浮效果（废除） | boolean | false | - |
| landscape | 是否旋转90度，模拟横屏效果 | boolean | false | - |
| autoHideTooltip | 是否自动隐藏Tooltip | boolean | false | - |

### 组件方法

| 方法名 | 参数 | 返回值 | 说明 |
|--------|------|--------|------|
| init | `echarts: Object, config?: Object` | `Promise<ChartInstance>` | 初始化图表实例 |
| setOption | `option: Object` | `void` | 设置或更新图表配置项 |
| resize | `size?: {width: number, height: number}` | `void` | 调整图表尺寸 |
| clear | `-` | `void` | 清空图表内容 |
| dispose | `-` | `void` | 销毁图表实例 |
| showLoading | `-` | `void` | 显示加载动画 |
| hideLoading | `-` | `void` | 隐藏加载动画 |
| canvasToTempFilePath | `options: Object` | `Promise<Object>` | 生成图表图片，与 uni-app 官方 API 类似，但无需传入 canvasId |

### 事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| finished | 无 | 图表准备就绪时触发，此时可调用 init 方法 |

## 其他平台依赖说明 🌐

### uni-app 非 nvue 端

- **推荐使用 `npm` 安装**
- 通过 npm 安装可以获得完整的 ES 模块格式支持
  ```bash
  npm install echarts --save
  ```
- 安装后可直接在代码中通过 `import` 引入
  ```js
  import * as echarts from 'echarts'
  ```

### uni-app-x 非 App 端

- **推荐使用 npm 安装**获取 ES 模块格式
  ```bash
  npm install echarts --save
  ```
- ES 模块格式具有更好的性能和构建优化支持
- 通过 `import` 引入使用
  ```js
  import * as echarts from 'echarts'
  ```

> 💡 注意：H5 和 App 原生环境通常不需要手动引入 ECharts，组件会自动处理。只有在需要自定义 ECharts 版本或配置时才需要手动引入。

## 技术支持 🆘

如果您在使用过程中遇到问题，可以通过以下方式获取帮助：

1. 查看 [在线文档](https://limeui.qcoon.cn/#/echart) 获取详细使用说明
2. 检查 [常见问题](#常见问题与解决方案) 章节查找解决方案

## 贡献与支持 💙

如果您觉得本插件对您有帮助，欢迎给作者点个赞或提供支持：

| 支付宝 | 微信 |
|--------|------|
| ![支付宝](https://testingcf.jsdelivr.net/gh/liangei/image@1.9/alipay.png) | ![微信](https://testingcf.jsdelivr.net/gh/liangei/image@1.9/wpay.png) |

您的支持是作者持续开发和维护的动力！ 🌟