// uni-app自动化测试教程: https://uniapp.dcloud.net.cn/worktile/auto/hbuilderx-extension/
describe('css-font-family-icon', () => {
  const platformInfo = process.env.uniTestPlatformInfo.toLocaleLowerCase();
  const isMP = platformInfo.startsWith('mp');
  const isWeb = platformInfo.startsWith('web');
  let page;

  if (isWeb || isMP || process.env.UNI_AUTOMATOR_APP_WEBVIEW == 'true') {
    it('other platform', () => {
      expect(1).toBe(1);
    });
    return;
  }

  beforeAll(async () => {
    page = await program.reLaunch('/pages/CSS/text/font-family-icon');
    await page.waitFor(1000);
  });

  it('screenshot', async () => {
    const image = await program.screenshot({
      fullPage: true
    });
    expect(image).toSaveImageSnapshot();
  });

  it('screenshot after changeStyle', async () => {
    await page.callMethod('changeStyle');
    await page.waitFor(500);
    const image = await program.screenshot({
      fullPage: true
    });
    expect(image).toSaveImageSnapshot();
  });
});
