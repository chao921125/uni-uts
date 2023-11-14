const PAGE_PATH = '/pages/lifecycle/page/page'
const HOME_PATH = '/pages/index'
let page
let lifeCycleNum

describe('app-lifecycle', () => {
  it('onLaunch onShow', async () => {
    page = await program.reLaunch(HOME_PATH)
    await page.waitFor(1000)
    lifeCycleNum = await page.callMethod('getLifeCycleNum')
    expect(lifeCycleNum).toBe(1100)
  })
  it('onLastPageBackPress', async () => {
    page = await program.navigateBack()
    await page.waitFor(1000)
    lifeCycleNum = await page.callMethod('getLifeCycleNum')
    expect(lifeCycleNum).toBe(100)

    await page.callMethod('setLifeCycleNum', 0)
    lifeCycleNum = await page.callMethod('getLifeCycleNum')
    expect(lifeCycleNum).toBe(0)
  })
})

describe('page-lifecycle', () => {
  afterAll(async () => {
    const resetLifecycleNum = 1100
    await page.callMethod('setLifeCycleNum', resetLifecycleNum)
    lifeCycleNum = await page.callMethod('getLifeCycleNum')
    expect(lifeCycleNum).toBe(resetLifecycleNum)
  })

  it('onLoad onShow onReady', async () => {
    page = await program.reLaunch(PAGE_PATH)
    await page.waitFor(1000)
    lifeCycleNum = await page.callMethod('getLifeCycleNum')
    expect(lifeCycleNum).toBe(120)
    await page.callMethod('setLifeCycleNum', 0)
  })
  it('onPullDownRefresh', async () => {
    await page.callMethod('pullDownRefresh')
    await page.waitFor(1500)
    lifeCycleNum = await page.callMethod('getLifeCycleNum')
    expect(lifeCycleNum).toBe(10)
    await page.callMethod('setLifeCycleNum', 0)
  })
  it('onPageScroll onReachBottom', async () => {
    await program.pageScrollTo(2000)
    const data = await page.data()
    expect(data.isScrolled).toBe(true)
    lifeCycleNum = await page.callMethod('getLifeCycleNum')
    expect(lifeCycleNum).toBe(10)
    await page.callMethod('setLifeCycleNum', 0)
  })
  it('onHide', async () => {
    page = await program.navigateTo(HOME_PATH)
    await page.waitFor(1000)
    lifeCycleNum = await page.callMethod('getLifeCycleNum')
    expect(lifeCycleNum).toBe(-10)
    page = await program.navigateBack()
    await page.waitFor(1000)
    lifeCycleNum = await page.callMethod('getLifeCycleNum')
    expect(lifeCycleNum).toBe(0)
  })
  it('onUnload', async () => {
    page = await program.redirectTo(HOME_PATH)
    await page.waitFor(1000)
    lifeCycleNum = await page.callMethod('getLifeCycleNum')
    expect(lifeCycleNum).toBe(-100)
    await page.callMethod('setLifeCycleNum', 0)
  })
  it('onBackPress', async () => {
    page = await program.navigateTo(PAGE_PATH)
    await page.waitFor(1000)
    lifeCycleNum = await page.callMethod('getLifeCycleNum')
    expect(lifeCycleNum).toBe(120)
    page = await program.navigateBack()
    await page.waitFor(1000)
    lifeCycleNum = await page.callMethod('getLifeCycleNum')
    expect(lifeCycleNum).toBe(10)
    await page.callMethod('setLifeCycleNum', 0)
  })
})