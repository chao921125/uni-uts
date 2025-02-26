const PAGE_PATH = '/pages/API/get-current-pages/set-page-style-disable-pull-down-refresh'

describe('getCurrentPages', () => {
  if (
    process.env.uniTestPlatformInfo.toLowerCase().startsWith('ios') ||
    process.env.uniTestPlatformInfo.startsWith('mp')
  ) {
    it('not-support', async () => {
      expect(1).toBe(1)
    })
    return
  }
  let page
  it('page-style', async () => {
    page = await program.navigateTo(PAGE_PATH)
    //onLoad会对currentPageStyle赋值
    await page.waitFor(200)
    const currentPageStyle = (await page.data()).currentPageStyle
    const isEnablePullDownRefresh1 = currentPageStyle.enablePullDownRefresh
    expect(isEnablePullDownRefresh1).toBe(false)
    //校验pageStyle数据是否完整
    expect(currentPageStyle.navigationStyle != undefined && currentPageStyle.onReachBottomDistance != undefined).toBe(true)

    await page.callMethod('setPageStyle', true)
    await page.waitFor(200)
    await page.callMethod('getPageStyle')
    await page.waitFor(200)
    const isEnablePullDownRefresh2 = (await page.data()).currentPageStyle.enablePullDownRefresh
    expect(isEnablePullDownRefresh2).toBe(true)
    await page.callMethod('startPullDownRefresh')
    await page.waitFor(500)
    const image3 = await program.screenshot({
      fullPage: true
    });
    expect(image3).toSaveImageSnapshot({customSnapshotIdentifier() {
      return 'set-page-style-disable-pull-down-refresh-test-js-get-current-pages-page-style-before-set-page-style'
    }});

    await page.waitFor(3500)

    // setPageStyle
    await page.callMethod('setPageStyle', false)
    await page.waitFor(200)
    await page.callMethod('startPullDownRefresh')
    await page.waitFor(500)
    const image2 = await program.screenshot({
      fullPage: true
    });
    expect(image2).toSaveImageSnapshot({customSnapshotIdentifier() {
      return 'set-page-style-disable-pull-down-refresh-test-js-get-current-pages-page-style-after-set-page-style'
    }});

  })
})
