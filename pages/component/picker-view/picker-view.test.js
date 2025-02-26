const PAGE_PATH = '/pages/component/picker-view/picker-view'
let page, pickerViewEl;
describe('PickerView.uvue', () => {
  const platformInfo = process.env.uniTestPlatformInfo.toLocaleLowerCase()
  const isAndroid = platformInfo.startsWith('android')
  const isIOS = platformInfo.startsWith('ios')
  const isMP = platformInfo.startsWith('mp')
  const isWeb = platformInfo.startsWith('web')
  beforeAll(async () => {
    page = await program.reLaunch(PAGE_PATH)
    await page.waitFor('view')
    await page.callMethod('setEventCallbackNum', 0)
    pickerViewEl = await page.$('.picker-view')
  })

  afterEach(async () => {
    await page.callMethod('setEventCallbackNum', 0)
  })

  async function toScreenshot(imgName) {
    const image = await program.screenshot({
      fullPage: true
    });
    expect(image).toSaveImageSnapshot({
      customSnapshotIdentifier() {
        return imgName
      }
    })
    await page.waitFor(500);
  }

  it('value', async () => {
    await page.callMethod('setValue')
    await page.waitFor(1000)


    const newValue1 = await pickerViewEl.property('value')
    // TODO
    expect(newValue1.toString()).toEqual('0,1,30')
    if (process.env.UNI_PLATFORM === 'app-android') {
      expect(await page.data('result')).toEqual([0, 0, 0])
    }
    await page.callMethod('setValue1')
    await page.waitFor(1000)
    const newValue2 = await pickerViewEl.property('value')
    // TODO
    expect(newValue2.toString()).toEqual('10,10,10')
    if (process.env.UNI_PLATFORM === 'app-android') {
      expect(await page.data('result')).toEqual([10, 10, 10])
    }
  })

  it('length', async () => {
    const els = await page.$$('.picker-view')
    expect(els.length).toBe(1)
    const els1 = await page.$$('.picker-view-column')
    expect(els1.length).toBe(3)
  })

  it('indicator-style', async () => {
    // App端动态设置indicatorStyle无效
    const indicatorStyle = "height: 50px;border:#ff5500 solid 1px;background:rgba(182, 179, 255, 0.4);"
    await page.setData({
      indicatorStyle
    })
    await page.waitFor(500)
    expect(await pickerViewEl.attribute(isMP ? 'indicator-style' : 'indicatorStyle')).toBe(indicatorStyle)
    await toScreenshot('picker-view-indicator-style')
  })

  if (isWeb || isMP) {
    // indicator-class、mask-style、mask-class 仅web支持
    it('indicator-class', async () => {
      await page.setData({
        indicatorStyle: "", //清空indicatorStyle
        indicatorClass: "indicator-test", //设置indicatorClass为indicator-test
      })
      expect(await pickerViewEl.attribute(isMP ? 'indicator-class': 'indicatorClass')).toBe("indicator-test")
      await toScreenshot('picker-view-web-indicator-class')
      await page.setData({
        indicatorClass: "", //清空indicatorClass
      })
    })
    it('mask-style', async () => {
      const maskStyle = "background-image: linear-gradient(to bottom, #d8e5ff, rgba(216, 229, 255, 0));"
      await page.setData({
        maskStyle
      })
      expect(await pickerViewEl.attribute(isMP ? 'mask-style' : 'maskStyle')).toBe(maskStyle)
      await toScreenshot('picker-view-web-mask-style')
    })
    it('mask-class', async () => {
      await page.setData({
        maskClass: "mask-test"
      })
      expect(await pickerViewEl.attribute(isMP ? 'mask-class' : 'maskClass')).toBe("mask-test")
      await toScreenshot('picker-view-web-mask-class')
    })
    return
  }

  if (process.env.UNI_AUTOMATOR_APP_WEBVIEW !== 'true' && !isMP) {
    it('mask-top-bottom-style', async () => {
      // App端动态设置mask-top-style、mask-bottom-style无效
      const linearToTop = "background-image: linear-gradient(to bottom, #f4ff73, rgba(216, 229, 255, 0));"
      const linearToBottom = "background-image: linear-gradient(to top, #f4ff73, rgba(216, 229, 255, 0));"
      await page.setData({
        maskTopStyle: linearToTop,
        maskBottomStyle: linearToBottom,
      })
      await page.waitFor(500)
      expect(await pickerViewEl.attribute('mask-top-style')).toBe(linearToTop)
      expect(await pickerViewEl.attribute('mask-bottom-style')).toBe(linearToBottom)
      await page.waitFor(2000)
      await toScreenshot('picker-view-app-mask-top-bottom-style')
    })

    it('reopen-picker-view-page', async () => {
      page = await program.switchTab('/pages/tabBar/component')
      await page.waitFor(500)
      page = await program.navigateTo(PAGE_PATH)
      await page.waitFor(500)

      const {
        year,
        month,
        day
      } = await page.data()
      expect(year).toEqual(2018)
      expect(month).toEqual(1)
      expect(day).toEqual(12)
    })

    it('trigger UniPickerViewChangeEvent', async () => {
      await page.callMethod('setValue')
      await page.waitFor(1500)
      const eventCallbackNum = await page.callMethod('getEventCallbackNum')
      // 年月日滚动三次，测试 e.tagName +1 和 e.type+2，正常为9
      expect(eventCallbackNum).toBe(9)
    })
  }

})