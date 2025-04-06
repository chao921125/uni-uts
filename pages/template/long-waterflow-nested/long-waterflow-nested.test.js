describe('long-waterflow-nested', () => {
  if (
    process.env.uniTestPlatformInfo.startsWith('web') ||
    process.env.uniTestPlatformInfo.startsWith('mp')
  ) {
    it('dummyTest', async () => {
      expect(1).toBe(1)
    })
    return
  }

  if (process.env.UNI_TEST_DEVICES_DIRECTION == 'landscape') {
    it('跳过横屏模式', () => {
      expect(1).toBe(1)
    })
    return
  }

  let page
  beforeAll(async () => {
    //打开list-view测试页
    page = await program.reLaunch('/pages/template/long-waterflow-nested/long-waterflow-nested')
    await page.waitFor(600)
  })

  it('check_refresherabort', async () => {
    //部分安卓设备需要延迟一段时间swipe才生效 此处暂时延迟1秒
    await page.waitFor(1000);
    // 仅App端支持手势下拉刷新
    await program.swipe({
      startPoint: {x: 100,y: 300},
      endPoint: {x: 100,y: 600},
      duration: 100
    })
    await page.waitFor(1500)
  });

})
