const PAGE_PATH = '/pages/API/interceptor/interceptor'

const platformInfo = process.env.uniTestPlatformInfo.toLocaleLowerCase()
const isMP = platformInfo.startsWith('mp')

describe('interceptor', () => {
  let page
  beforeEach(async () => {
    page = await program.reLaunch(PAGE_PATH)
    await page.waitFor('view')
  })

  if (!isMP) {
    // 小程序不支持拦截navigator组件
    it('no Interceptor', async () => {
      const newPage = await program.navigateTo('./page1')
      await newPage.waitFor('text')
      const num = (await newPage.data()).page
      await program.navigateBack()
      expect(num).toBe(1)
      // 新增 navigator 元素
      const elementNavigatorButton = await page.$('.navigatorButton')
      await elementNavigatorButton.tap()
      await page.waitFor(500)

      const currentPage = await program.currentPage()
      expect(currentPage.path).toBe('pages/API/interceptor/page1')
      await program.navigateBack()
    })

    it('addInterceptor', async () => {
      await page.callMethod('addInterceptor')
      const newPage = await program.navigateTo('./page1')
      await newPage.waitFor('text')
      const num = (await newPage.data()).page
      await program.navigateBack()
      expect(num).toBe(2)
      // 新增 navigator 元素
      const elementNavigatorButton = await page.$('.navigatorButton')
      await elementNavigatorButton.tap()
      await page.waitFor(500)

      const currentPage = await program.currentPage()
      expect(currentPage.path).toBe('pages/API/interceptor/page2')
      await program.navigateBack()
    })

    it('removeInterceptor', async () => {
      await page.callMethod('removeInterceptor')
      const newPage = await program.navigateTo('./page1')
      await newPage.waitFor('text')
      const num = (await newPage.data()).page
      await program.navigateBack()
      expect(num).toBe(1)
      // 新增 navigator 元素
      const elementNavigatorButton = await page.$('.navigatorButton')
      await elementNavigatorButton.tap()
      await page.waitFor(500)

      const currentPage = await program.currentPage()
      expect(currentPage.path).toBe('pages/API/interceptor/page1')
      await program.navigateBack()
    })
  }

  it('addInterceptor navigateTo api', async () => {
    page = await program.reLaunch(PAGE_PATH)
    await page.waitFor('view')
    await page.callMethod('addInterceptor')
    await page.callMethod('navigateTo')
    await page.waitFor(500)

    const currentPage = await program.currentPage()
    expect(currentPage.path).toBe('pages/API/interceptor/page2')
    await program.navigateBack()
  })

  it('removeInterceptor', async () => {
    page = await program.reLaunch(PAGE_PATH)
    await page.waitFor('view')
    await page.callMethod('addInterceptor')
    await page.callMethod('removeInterceptor')
    await page.callMethod('navigateTo')
    await page.waitFor(500)

    const currentPage = await program.currentPage()
    expect(currentPage.path).toBe('pages/API/interceptor/page1')
    await program.navigateBack()
  })

  it('addSwitchTabInterceptor', async () => {
    await page.callMethod('addSwitchTabInterceptor')
    await page.callMethod('switchTab')
    await page.waitFor(500)
    const currentPage = await program.currentPage()
    expect(currentPage.path).toBe('pages/tabBar/API')
  })

  it('removeSwitchTabInterceptor', async () => {
    await page.callMethod('addSwitchTabInterceptor')
    await page.callMethod('removeSwitchTabInterceptor')
    await page.callMethod('switchTab')
    await page.waitFor(500)
    const currentPage = await program.currentPage()
    expect(currentPage.path).toBe('pages/tabBar/component')
  })

})
