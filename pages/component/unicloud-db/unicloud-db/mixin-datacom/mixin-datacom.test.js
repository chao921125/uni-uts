const PAGE_PATH = '/pages/component/unicloud-db/unicloud-db/mixin-datacom/mixin-datacom'

describe('mixin-datacom', () => {
  if (process.env.uniTestPlatformInfo.startsWith('web')) {
    it('dummyTest', async () => {
      expect(1).toBe(1)
    })
    return
  }
  let page
  beforeAll(async () => {
    page = await program.reLaunch(PAGE_PATH)
    await page.waitFor(500)
  })
  it('mixinDatacomGet', async () => {
    const datacom = await page.$('.datacom')
    const children = await datacom.$$('.list-item')
    expect(children.length > 0).toBe(true)
  })
})
