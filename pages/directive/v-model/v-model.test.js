const PAGE_PATH = '/pages/directive/v-model/v-model'

describe('v-model', () => {
  let page
  beforeAll(async () => {
    page = await program.reLaunch(PAGE_PATH)
    await page.waitFor(500)
  })
  it('input', async () => {
    const value = Date.now() + ''

    const inputElement = await page.$('.input')
    await inputElement.input(value)

    const inputValueElement = await page.$('.input-value')
    expect(await inputValueElement.text()).toBe(value)
  })
})
