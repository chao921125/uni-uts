const PAGE_PATH = '/pages/component/form/form'

const DEFAULT_NICK_NAME = ''
const DEFAULT_GENDER = '0'
const DEFAULT_LOVES = ['0']
const DEFAULT_AGE = 18
const DEFAULT_SWITCH = true
const DEFAULT_COMMENT = ''

const CHANGE_NICK_NAME = 'hello'
const CHANGE_GENDER = '1'
const CHANGE_LOVES = ['0', '1']
const CHANGE_AGE = 50
const CHANGE_SWITCH = false
const CHANGE_COMMENT = '备注'

describe('form', () => {
  const isMP = process.env.uniTestPlatformInfo.startsWith('mp')
  let page
  beforeAll(async () => {
    page = await program.reLaunch(PAGE_PATH)
    await page.waitFor(500)
  })
  it('submit', async () => {
    await changeData(page)

    const btnSubmit = await page.$('.btn-submit')
    await btnSubmit.tap()
    await page.waitFor(200)

    const {
      formData,
      testVerifySubmit
    } = await page.data()

    expect(formData['nickname']).toBe(CHANGE_NICK_NAME)
    expect(formData['gender']).toBe(CHANGE_GENDER)
    expect(formData['loves'][0]).toBe(CHANGE_LOVES[0])
    expect(formData['loves'][1]).toBe(CHANGE_LOVES[1])
    expect(formData['age']).toBe(CHANGE_AGE)
    expect(formData['switch']).toBe(CHANGE_SWITCH)
    expect(formData['comment']).toBe(CHANGE_COMMENT)
    if(!isMP) {
      expect(testVerifySubmit).toBe(true)
    }
  })
  if(isMP) {
    // 微信小程序reset和app、web表现不一致。暂时屏蔽reset测试例，后续如果拉齐再放开
    return
  }
  it('reset', async () => {
    await changeData(page)

    const btnReset = await page.$('.btn-reset')
    await btnReset.tap()
    await page.waitFor(100)

    const btnSubmit = await page.$('.btn-submit')
    await btnSubmit.tap()
    await page.waitFor(100)

    const {
      formData,
      testVerifyReset
    } = await page.data()

    expect(formData['nickname']).toBe(DEFAULT_NICK_NAME)
    expect(formData['gender']).toBe(DEFAULT_GENDER)
    expect(formData['loves'][0]).toBe(DEFAULT_LOVES[0])
    expect(formData['age']).toBe(DEFAULT_AGE)
    expect(formData['switch']).toBe(DEFAULT_SWITCH)
    expect(formData['comment']).toBe(DEFAULT_COMMENT)

    expect(testVerifyReset).toBe(true)
  })
})

async function changeData(page) {
  await page.setData({
    nickname: CHANGE_NICK_NAME,
    gender: CHANGE_GENDER,
    loves: CHANGE_LOVES,
    age: CHANGE_AGE,
    switch: CHANGE_SWITCH,
    comment:CHANGE_COMMENT
  })
  await page.waitFor(100)
}
