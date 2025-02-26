jest.setTimeout(30000);
describe('test vant', () => {
  let page,vantBtnContainer,vantBtn;
  if (!process.env.uniTestPlatformInfo.startsWith('mp')) {
    it('not support', () => {
      expect(1).toBe(1)
    })
    return
  }
  beforeAll(async () => {
    page = await program.reLaunch('/pages/template/vant/vant')
    await page.waitFor(3000);
    vantBtnContainer = await page.$('vant-button');
    expect(await page.data('jest')).toBe(false);
  });
  afterAll(async () => {
    expect(await program.screenshot()).toSaveImageSnapshot();
  });
  it('check title onClick', async () => {
    const titleText = await vantBtnContainer.text();
    expect(titleText).toEqual('vant weapp的vant-button按钮组件');
    vantBtn = await vantBtnContainer.$('button')
    await vantBtn.tap()
    await page.waitFor(1000);
    console.log('jest',await page.data('jest'))
    expect(await page.data('jest')).toBe(true);
  });
});
