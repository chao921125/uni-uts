# 该项目使用的UI
1. 微信内置的
2. [vant v1.10.23](https://github.com/youzan/vant-weapp)
3. [uni-ui v1.4.27](https://github.com/dcloudio/uni-ui)
4. [uviewui 未用](https://uviewui.com/)
5. [ucharts 图表 收费 未用](https://www.ucharts.cn/v2/#/)

# 注意事项
###### vant 样式修改方式：1、行内；2、标签加名称，内容额外使用view等内置组件；3、添加 ::v-deep 修改
###### pages/demo 目录下页面需要手动添加path访问，并且部分引用文件需要自行修改对应的正确的目录
###### pages/components 目录下页面需要手动引用，针对性引用，并非所有页面都适合
###### uni-modules 目录下文件无需引用直接使用，此类组件封装注意兼容性
###### components 根目录下这个目录存放的是公共的组件，和uni-modules类似，但是需要自行引用

# 适配暗黑模式，还未测试
https://developers.weixin.qq.com/miniprogram/dev/framework/ability/darkmode.html
1、小程序和H5一定要用UNI的判断隔断，同时配置好代理
2、调试小程序的时候一定将请求地址修改为IPV4，即非127.0.0.1和localhost的地址

# APP 离线打包
###### [APK](https://nativesupport.dcloud.net.cn/AppDocs/download/android.html)
###### [IOS](https://nativesupport.dcloud.net.cn/AppDocs/download/ios.html)
