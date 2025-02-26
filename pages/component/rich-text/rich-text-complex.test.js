const PAGE_PATH = '/pages/component/rich-text/rich-text-complex'

describe('rich-text-test', () => {
  const platformInfo = process.env.uniTestPlatformInfo.toLocaleLowerCase()
  const isAndroid = platformInfo.startsWith('android')
  const isIOS = platformInfo.startsWith('ios')
  const isMP = platformInfo.startsWith('mp')
  const isWeb = platformInfo.startsWith('web')

  // 先屏蔽 android 及 web 平台
  if (isAndroid || isWeb || isMP) {
    it('other platform', () => {
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
    page = await program.reLaunch(PAGE_PATH)
    await page.waitFor(1500);
  })


  it('click-event', async () => {
    await program.tap({
      x: 210,
      y: 280,
      duration: 100
    })

    await page.waitFor(1000);
    const fViewClicked = await page.data('fViewClicked')
    const selfClicked = await page.data('selfClicked')
    expect(fViewClicked).toBe(true)
    expect(selfClicked).toBe(true)
  })


  it('itemclick-event', async () => {
    await program.tap({
      x: 66,
      y: 266,
      duration: 100
    })

    await page.waitFor(500);

    // 关闭弹窗逻辑各平台需要适配不同机型
    if (process.env.uniTestPlatformInfo.startsWith('IOS')) {
        // 关闭弹窗 iPhone Pro 机型
        await program.tap({
          x: 200,
          y: 433,
          duration: 100
        })

        // 关闭弹窗 iPhone ProMax 机型
        await program.tap({
          x: 220,
          y: 476,
          duration: 100
        })

        // 关闭弹窗 iPhone mini 机型
        await program.tap({
          x: 186,
          y: 400,
          duration: 100
        })
    }

    const imageClicked = await page.data('imageClicked')
    expect(imageClicked).toBe(true)
  })

})
