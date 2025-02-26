jest.setTimeout(30000);
describe('test page-meta', () => {
  let page,titleEl,cellEl;
  if (!process.env.uniTestPlatformInfo.startsWith('mp')) {
    it('not support', () => {
      expect(1).toBe(1)
    })
    return
  }
  beforeAll(async () => {
    page = await program.reLaunch('/pages/component/page-meta/page-meta')
    await page.waitFor(3000);
    titleEl = await page.$(".title")
    cellEl = await page.$(".uni-list-cell")
  });
  it('check page-style', async () => {
    expect(await titleEl.style('color')).toEqual('rgb(0, 128, 0)');
    expect(await cellEl.style('color')).toEqual('rgb(0, 128, 0)');
  });
  it('check root-font-size', async () => {
    expect(await titleEl.style('font-size')).toEqual('30px');
  });
  it('check scrollTop', async () => {
    expect(await page.data('scrollTop')).toEqual('0px');
    const buttonEl = await page.$("button")
    await buttonEl.tap()
    await page.waitFor(2100)
    console.log('scrollType',await page.data('scrollType'));
    expect(await page.data('scrollTop')).toEqual('300px');
    expect(await page.data('scrollType')).toEqual('scroll');
    expect(await page.data('scrolldoneType')).toEqual('scrolldone');
  });
});
