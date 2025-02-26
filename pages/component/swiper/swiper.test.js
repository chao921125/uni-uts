jest.setTimeout(30000);
describe('test swiper', () => {
  const platformInfo = process.env.uniTestPlatformInfo.toLocaleLowerCase()
  const isAndroid = platformInfo.startsWith('android')
  const isIOS = platformInfo.startsWith('ios')
  const isMP = platformInfo.startsWith('mp')
  const isWeb = platformInfo.startsWith('web')
  let page;
  const webDetailRes = {
    current: 1,
    currentItemId: 'B',//web端多了currentItemId
    source: 'autoplay' ,
  }
  const appDetailRes = {
    current: 1,
    source: 'autoplay' ,
  }
  beforeAll(async () => {
    page = await program.reLaunch('/pages/component/swiper/swiper')
    await page.waitFor(600)
  })
  it('check indicator show', async () => {
    await page.setData({
      dotsSelect: true,
    })
    await page.waitFor(600)
    await page.setData({
      dotsSelect: false,
    })
    await page.waitFor(600)
    /**
     * todo 暂无判断条件
     */
  });

  if(!isMP) {
    it('check autoplay loop', async () => {
      await page.setData({
        currentValChange: 0,
        autoplaySelect: true,
      })
      await page.waitFor(2400)
      expect(await page.data('currentValChange')).toEqual(1)
      await page.waitFor(2000)
      expect(await page.data('currentValChange')).toEqual(2)
      await page.waitFor(2000)
      expect(await page.data('currentValChange')).toEqual(0)

      await page.setData({
        autoplaySelect: false
      })
      await page.waitFor(300)
    });
  }

  it('check current', async () => {
    if(isMP) {
      // 微信小程序表现较为怪异，interval显式的设置非0的情况下，会无视autoplay属性。interval默认值5000
      await page.setData({
        intervalSelect: 0,
      })
    }
    await page.setData({
      currentVal: 2,
    })
    await page.waitFor(600)
    expect(await page.data('currentValChange')).toEqual(2)
    await page.setData({
      currentVal: 0,
    })
    await page.waitFor(600)
    expect(await page.data('currentValChange')).toEqual(0)

    if(isMP) {
      await page.setData({
        intervalSelect: 2000,
      })
    }
  });

  it('check currentId', async () => {
    await page.setData({
      currentItemIdVal: 'C',
    })
    await page.waitFor(600)
    expect(await page.data('currentValChange')).toEqual(2)

    await page.setData({
      currentItemIdVal: 'A',
    })
    await page.waitFor(600)
    expect(await page.data('currentValChange')).toEqual(0)
  });

  it('Trigger Event', async () => {
    await page.setData({
      swiperChangeSelect: true,
      swiperTransitionSelect: true,
      swiperAnimationfinishSelect: true,
      autoplaySelect:true
    })
    await page.waitFor(2000)
    await page.waitFor(async()=>{
      return await page.data('currentValChange') == 1
    })
    await page.setData({
      autoplaySelect:false
    })
  });

  it('Event transitiont', async () => {
    const transitionDetailInfo = await page.data('transitionDetailTest')
    expect(transitionDetailInfo.dy).toBe(0)
    expect(transitionDetailInfo.dx).not.toBe(0)
    expect(await page.data('isTransitionTest')).toBe('transition:Success')
  });

  it('Event change', async () => {
    const changeDetailInfo = await page.data('changeDetailTest')
    if(isWeb || isMP){
      expect(changeDetailInfo).toEqual(webDetailRes)
    }else{
      expect(changeDetailInfo).toEqual(appDetailRes)
    }
    expect(await page.data('isChangeTest')).toBe('change:Success')
  });

  it('Event animationfinish', async () => {
    await page.waitFor(1000)
    const animationfinishDetailInfo = await page.data('animationfinishDetailTest')
    if(isWeb || isMP){
      expect(animationfinishDetailInfo).toEqual(webDetailRes)
    }else{
      expect(animationfinishDetailInfo).toEqual(appDetailRes)
    }
    expect(await page.data('isAnimationfinishTest')).toBe('animationfinish:Success')
  });
});
