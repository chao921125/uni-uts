const PAGE_PATH = '/pages/API/unicloud/unicloud/cloud-function'

describe('unicloud-call-function', () => {
  let page
  beforeAll(async () => {
    page = await program.reLaunch(PAGE_PATH)
    await page.waitFor(500)
    await page.setData({
      isUniTest: true
    })
  })

  it('UniCloudError', async () => {
    const result = await page.callMethod('jest_UniCloudError')
    expect(result).toBe(false)
  })

  it('callFunction', async () => {
    await page.callMethod('callFunction')
    const {
      callFunctionResult,
      callFunctionError,
    } = await page.data()
    console.error(callFunctionResult)
    console.error(callFunctionError)
    expect(callFunctionResult['showMessage']).toBe("Hello uniCloud function")
    expect(callFunctionResult['event']['num']).toBe(1)
    expect(callFunctionResult['event']['str']).toBe('ABC')
  })

  it('callFunctionWithGeneric', async () => {
    await page.callMethod('callFunctionWithGeneric')
    const {
      genericDemoShowMessage,
    } = await page.data()
    expect(genericDemoShowMessage).toBe("Hello uniCloud function")
  })
})
