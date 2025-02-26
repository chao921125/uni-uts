// uni-app自动化测试教程: uni-app自动化测试教程: https://uniapp.dcloud.net.cn/worktile/auto/hbuilderx-extension/

describe('component-native-scroll-view-props', () => {
    const platformInfo = process.env.uniTestPlatformInfo.toLocaleLowerCase()
    const isAndroid = platformInfo.startsWith('android')
    const isIOS = platformInfo.startsWith('ios')
    const isMP = platformInfo.startsWith('mp')
    const isWeb = platformInfo.startsWith('web')

    let page;
    beforeAll(async () => {
        page = await program.reLaunch('/pages/component/scroll-view/scroll-view-props');
        await page.waitFor(300);
    });

    if(!isMP) {
      //检测竖向可滚动区域
      it('check_scroll_height', async () => {
        await page.setData({
            scrollX: false
        })
        await page.waitFor(300);
        const value = await page.callMethod('checkScrollHeight')
        expect(value).toBe(true)
      })
    }

    //检测竖向scrolltop属性赋值
    it('check_scroll_top', async () => {
        await page.setData({
          scrollTop: 600
        })
        await page.waitFor(600)
        //检测滚动top 是否触发scroll 事件
        const scrollChangeTop = await page.data('scrollChangeTop')
        console.log("scrollChangeTop="+scrollChangeTop)
        expect(scrollChangeTop-600).toBeGreaterThanOrEqual(0)
        const element = await page.$('#scrollViewY')
        const scrollTop = await element.property("scrollTop")
        console.log("check_scroll_top---"+scrollTop)
        expect(scrollTop-600).toBeGreaterThanOrEqual(0)
    })

    //检测竖向scroll_into_view属性赋值
    it('check_scroll_into_view_top', async () => {
        await page.setData({
          scrollIntoView: "item3"
        })
        await page.waitFor(600)
        const element = await page.$('#scrollViewY')
        const scrollTop = await element.property("scrollTop")
        console.log("check_scroll_into_view_top--"+scrollTop)
        await page.setData({
            scrollIntoView: ""
        })
        expect(scrollTop-570).toBeGreaterThanOrEqual(0)
    })

    if(!isMP) {
      //检测横向可滚动区域
      it('check_scroll_width', async () => {
        await page.setData({
            scrollX: true
        })
        await page.waitFor(300);
        const value = await page.callMethod('checkScrollWidth')
        expect(value).toBe(true)
      })
    }

    //检测横向scrollLeft属性赋值
    it('check_scroll_left', async () => {
      await page.setData({
        scrollX: true
      })
      await page.setData({
        scrollLeft: 600
      })
      await page.waitFor(600)
      const element = await page.$('#scrollViewX')
      const scrollLeft = await element.property("scrollLeft")
      console.log("check_scroll_left---"+scrollLeft)
      expect(scrollLeft-600).toBeGreaterThanOrEqual(0)
    })

    //检测横向scroll_into_view属性赋值
    it('check_scroll_into_view_left', async () => {
      await page.setData({
        scrollX: true
      })
      await page.setData({
          scrollIntoView: "horizontal_item3"
      })
      await page.waitFor(600)
      const element = await page.$('#scrollViewX')
      const scrollLeft = await element.property("scrollLeft")
      console.log("check_scroll_into_view_left--"+scrollLeft)
      await page.setData({
          scrollIntoView: ""
      })
      expect(scrollLeft-930).toBeGreaterThanOrEqual(0)
    })

    //截图对比
    it('scroll-view-props-screenshot', async () => {
      //禁止滚动条
      await page.setData({
          showScrollbar: false
      })
      await page.waitFor(300);
      const image = await program.screenshot({fullPage: true});
      expect(image).toSaveImageSnapshot();
    })


    //截图末尾位置元素
    it('scroll-view-props-last-item-screenshot', async () => {
      //滚动到末尾位置
      await page.setData({
          scrollLeft: 10000
      })
      await page.waitFor(300);
      const image = await program.screenshot({fullPage: true});
      expect(image).toSaveImageSnapshot();
    })
});
