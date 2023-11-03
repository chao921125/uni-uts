const CURRENT_PAGE_PATH =
  '/pages/API/set-navigation-bar-color/set-navigation-bar-color'

describe('setNavigationBarColor', () => {
  let page
  let originLifeCycleNum
  let lifeCycleNum
  beforeAll(async () => {
    page = await program.navigateTo(CURRENT_PAGE_PATH)
    await page.waitFor(1000)
    originLifeCycleNum = await page.callMethod('getLifeCycleNum')
  })

  afterAll(async () => {
    await page.callMethod('setLifeCycleNum', originLifeCycleNum)
    lifeCycleNum = await page.callMethod('getLifeCycleNum')
    expect(lifeCycleNum).toBe(originLifeCycleNum)
  })

  it('setNavigationBarColor1', async () => {
    await page.callMethod('setNavigationBarColor1')
    const image = await program.screenshot()
    expect(image).toMatchImageSnapshot()
  })
	it('setNavigationBarColor2', async () => {
	  await page.callMethod('setNavigationBarColor2')
	  const image = await program.screenshot()
	  expect(image).toMatchImageSnapshot()
	})
})
