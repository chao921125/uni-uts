jest.setTimeout(50000)

const platformInfo = process.env.uniTestPlatformInfo.toLocaleLowerCase()
const isWeb = platformInfo.startsWith('web')
const isAndroid = platformInfo.startsWith('android')
const isIos = platformInfo.startsWith('ios')
const isMP = platformInfo.startsWith('mp')
const FIRST_PAGE_PATH = '/pages/API/dialog-page/dialog-page'
const NEXT_PAGE_PATH = '/pages/API/dialog-page/next-page'

describe('dialog page', () => {
  if (process.env.UNI_AUTOMATOR_APP_WEBVIEW == 'true') {
    it('skip app-webview', () => {
      expect(1).toBe(1)
    })
    return
  }
  if (isMP) {
    it('skip mp', () => {
      expect(1).toBe(1)
    })
    return
  }

  let page;
  let initLifeCycleNum;
  let lifecycleNum;
  beforeAll(async () => {
    page = await program.reLaunch(FIRST_PAGE_PATH)
    await page.waitFor('view');
    initLifeCycleNum = await page.callMethod('getLifeCycleNum');
    await page.callMethod('setLifeCycleNum', 0)
    lifecycleNum = await page.callMethod('getLifeCycleNum')
    expect(lifecycleNum).toBe(0)
  });

  it('open dialog1', async () => {
    await page.callMethod('openDialog1');
    // 无法通过获取 dom 元素来判断是否打开了 dialogPage
    await page.waitFor(1000)
    if (isWeb) {
      await page.waitFor(2000)
    }
    const image = await program.screenshot({
      deviceShot: true,
      area: {
        x: 0,
        y: 200,
      }
    });
    expect(image).toSaveImageSnapshot();
    lifecycleNum = await page.callMethod('getLifeCycleNum')
    // 不应触发父页面的生命周期,应该触发:
    // 1. openDialogPage success & complete callback
    // 2. dialog page 生命周期
    expect(lifecycleNum).toBe(7)
    await page.callMethod('setLifeCycleNum', 0)
  });
  it('check dialogPage methods', async () => {
    expect(await page.callMethod('dialogPageCheckGetDialogPages')).toBe(true)
    let dialogPageStyle = await page.callMethod('dialogPageGetPageStyle')
    expect(dialogPageStyle.backgroundColorContent).not.toBe('red')
    await page.callMethod('dialogPageSetPageStyle')
    dialogPageStyle = await page.callMethod('dialogPageGetPageStyle')
    expect(dialogPageStyle.backgroundColorContent).toBe('red')
    expect(await page.callMethod('dialogPageCheckGetElementById')).toBe(true)
    expect(await page.callMethod('dialogCheckGetAndroidView')).toBe(isAndroid)
    expect(await page.callMethod('dialogCheckGetIOSView')).toBe(false)
    expect(await page.callMethod('dialogCheckGetHTMLElement')).toBe(isWeb)
  })

  it('closeDialogPage', async () => {
    await page.callMethod('closeDialog');
    const image = await program.screenshot({
      deviceShot: true,
      area: {
        x: 0,
        y: 200,
      }
    });
    expect(image).toSaveImageSnapshot();
    // closeDialogPage success & complete callback 应被触发
    // dialogPage onUnload 应被触发
    lifecycleNum = await page.callMethod('getLifeCycleNum')
    expect(lifecycleNum).toBe(-3)
    await page.callMethod('setLifeCycleNum', 0)
  })

  it('openDialog with wrong path', async () => {
    await page.callMethod('openDialog1WrongPath')
    lifecycleNum = await page.callMethod('getLifeCycleNum')
    expect(lifecycleNum).toBe(-3)
    await page.callMethod('setLifeCycleNum', 0)
  })

  it('navigateTo nextPage & open Dialog', async () => {
    await page.callMethod('goNextPageOpenDialog1')
    await page.waitFor(2500)
    if (isWeb) {
      await page.waitFor(3000)
    }
    page = await program.currentPage()
    expect(page.path).toBe(NEXT_PAGE_PATH.substring(1))
    await page.waitFor(1000)
    if (isWeb) {
      await page.waitFor(2000)
    }
    const image = await program.screenshot({
      deviceShot: true,
      area: {
        x: 0,
        y: 200,
      }
    });
    expect(image).toSaveImageSnapshot();
    lifecycleNum = await page.callMethod('getLifeCycleNum')
    expect(lifecycleNum).toBe(-4)
    await page.callMethod('setLifeCycleNum', 0)
  })

  it('dialog1 navigateBack', async () => {
    await program.navigateBack()
    page = await program.currentPage()
    // dialogPage onBackPress 返回 true, 应可以拦截 navigateBack
    expect(page.path).toBe(NEXT_PAGE_PATH.substring(1))
    const image = await program.screenshot({
      deviceShot: true,
      area: {
        x: 0,
        y: 200,
      }
    });
    expect(image).toSaveImageSnapshot();
    lifecycleNum = await page.callMethod('getLifeCycleNum')
    // onBackPress 生命周期应该被触发
    expect(lifecycleNum).toBe(1)
    await page.callMethod('setLifeCycleNum', 0)
  })

  it('open dialog2', async () => {
    await page.callMethod('openDialog2')
    await page.waitFor(1000)
    if (isWeb) {
      await page.waitFor(2000)
    }
    lifecycleNum = await page.callMethod('getLifeCycleNum')
    // 应触发前一个 dialogPage 的 onHide
    expect(lifecycleNum).toBe(4)
    await page.callMethod('setLifeCycleNum', 0)
  })

  it('closeDialogPage', async () => {
    await page.callMethod('closeDialog')
    await page.waitFor(1000)
    lifecycleNum = await page.callMethod('getLifeCycleNum')
    // 应触发 success & complete 回调
    // 应触发 dialogPage 的 unload，下层的 dialogPage 会先 show 再 unload
    expect(lifecycleNum).toBe(-7)

    const image = await program.screenshot({
      deviceShot: true,
      area: {
        x: 0,
        y: 200,
      }
    });
    expect(image).toSaveImageSnapshot();
    await page.callMethod('setLifeCycleNum', 0)
  })

  it('open multiple dialog page', async () => {
    await page.callMethod('openDialog1')
    await page.waitFor(1000)
    if (isWeb) {
      await page.waitFor(2000)
    }
    const image1 = await program.screenshot({
      deviceShot: true,
      area: {
        x: 0,
        y: 200,
      }
    });
    expect(image1).toSaveImageSnapshot();
    lifecycleNum = await page.callMethod('getLifeCycleNum')
    expect(lifecycleNum).toBe(4)

    await page.callMethod('openDialog2')
    await page.waitFor(1000)
    if (isWeb) {
      await page.waitFor(2000)
    }
    const image2 = await program.screenshot({
      deviceShot: true,
      area: {
        x: 0,
        y: 200,
      }
    });
    expect(image2).toSaveImageSnapshot();
    lifecycleNum = await page.callMethod('getLifeCycleNum')
    expect(lifecycleNum).toBe(8)
    await page.callMethod('setLifeCycleNum', 0)
  })

  it('openDialogPage to home page', async () => {
    // 本测试例中是在 FIRST_PAGE_PATH 中打开
    await page.callMethod('openDialogPage1ToHomePage')
    await page.waitFor(1000)
    if (isWeb) {
      await page.waitFor(2000)
    }
    lifecycleNum = await page.callMethod('getLifeCycleNum')
    expect(lifecycleNum).toBe(4)
    await page.callMethod('setLifeCycleNum', 0)
  })

  it('dialog2 navigateBack', async () => {
    await program.navigateBack()
    page = await program.currentPage()
    expect(page.path).toBe(FIRST_PAGE_PATH.substring(1))
    const image = await program.screenshot({
      deviceShot: true,
      area: {
        x: 0,
        y: 200,
      }
    });
    expect(image).toSaveImageSnapshot();
    lifecycleNum = await page.callMethod('getLifeCycleNum')
    // dialogPage2 onBackPress +1 dialogPage1 show +1 dialogPage unload -5*2 firstPage show +10
    expect(lifecycleNum).toBe(2)
    await page.callMethod('setLifeCycleNum', 0)
  })

  it('close specified dialogPage', async () => {
    await page.callMethod('openDialog2')
    await page.waitFor(1000)
    if (isWeb) {
      await page.waitFor(2000)
    }
    const image1 = await program.screenshot({
      deviceShot: true,
      area: {
        x: 0,
        y: 200,
      }
    });
    expect(image1).toSaveImageSnapshot();
    lifecycleNum = await page.callMethod('getLifeCycleNum')
    expect(lifecycleNum).toBe(4)

    await page.callMethod('openDialog1')
    await page.waitFor(1000)
    if (isWeb) {
      await page.waitFor(2000)
    }
    const image2 = await program.screenshot({
      deviceShot: true,
      area: {
        x: 0,
        y: 200,
      }
    });
    expect(image2).toSaveImageSnapshot();
    lifecycleNum = await page.callMethod('getLifeCycleNum')
    expect(lifecycleNum).toBe(10)

    await page.callMethod('closeSpecifiedDialog', 0)
    const image3 = await program.screenshot({
      deviceShot: true,
      area: {
        x: 0,
        y: 200,
      }
    });
    expect(image3).toSaveImageSnapshot();
    lifecycleNum = await page.callMethod('getLifeCycleNum')
    expect(lifecycleNum).toBe(7)

    await page.callMethod('closeSpecifiedDialog', 1)
    const image4 = await program.screenshot({
      deviceShot: true,
      area: {
        x: 0,
        y: 200,
      }
    });
    expect(image4).toSaveImageSnapshot();
    lifecycleNum = await page.callMethod('getLifeCycleNum')
    expect(lifecycleNum).toBe(5)

    await page.callMethod('closeSpecifiedDialog', 0)
    const image5 = await program.screenshot({
      deviceShot: true,
      area: {
        x: 0,
        y: 200,
      }
    });
    expect(image5).toSaveImageSnapshot();
    lifecycleNum = await page.callMethod('getLifeCycleNum')
    expect(lifecycleNum).toBe(2)
    await page.callMethod('setLifeCycleNum', 0)
  })

  it('check triggerParentHide', async () => {
    // no triggerParentHide should not trigger parent hide
    await page.callMethod('openDialog4')
    await page.waitFor(1000)
    if (isWeb) {
      await page.waitFor(2000)
    }
    // dialog4 show +1
    expect(await page.callMethod('getLifeCycleNum')).toBe(1)
    await page.callMethod('closeDialog')
    await page.waitFor(200)
    // dialog4 unload -5 closeDialog callback +2
    expect(await page.callMethod('getLifeCycleNum')).toBe(-2)


    // triggerParentHide should trigger parent hide
    await page.callMethod('openDialogWithTriggerParentHide')
    await page.waitFor(1000)
    if (isWeb) {
      await page.waitFor(2000)
    }
    // openDialog callback +2 dialog4 show +1 parent hide -10
    expect(await page.callMethod('getLifeCycleNum')).toBe(-9)
    await page.callMethod('closeDialog')
    await page.waitFor(200)
    // dialog4 unload -5 parent show +10 closeDialog callback +2
    expect(await page.callMethod('getLifeCycleNum')).toBe(-2)


    // triggerParentHide should trigger parent hide
    await page.callMethod('openDialogWithTriggerParentHide')
    await page.waitFor(1000)
    if (isWeb) {
      await page.waitFor(2000)
    }
    // openDialog callback +2 dialog4 show +1 parent hide -10
    expect(await page.callMethod('getLifeCycleNum')).toBe(-9)

    // second triggerParentHide should not trigger parent hide
    await page.callMethod('openDialogWithTriggerParentHide')
    await page.waitFor(1000)
    if (isWeb) {
      await page.waitFor(2000)
    }
    // openDialog callback +2 dialog4 show +1
    expect(await page.callMethod('getLifeCycleNum')).toBe(-6)

    await page.callMethod('closeSpecifiedDialog', 1)
    await page.waitFor(200)
    // close not last triggerParentHide should not trigger parent show
    // close callback +2 dialog4 unload -5 dialog4 show +1
    expect(await page.callMethod('getLifeCycleNum')).toBe(-8)

    await page.callMethod('closeSpecifiedDialog', 0)
    await page.waitFor(200)
    // close last triggerParentHide should trigger parent show
    // close callback +2 dialog4 unload -5 parent show +10
    expect(await page.callMethod('getLifeCycleNum')).toBe(-1)


    // no triggerParentHide should not trigger parent hide
    await page.callMethod('openDialog4')
    await page.waitFor(1000)
    if (isWeb) {
      await page.waitFor(2000)
    }
    // dialog4 show +1
    expect(await page.callMethod('getLifeCycleNum')).toBe(0)
    // triggerParentHide should trigger parent hide
    await page.callMethod('openDialogWithTriggerParentHide')
    await page.waitFor(1000)
    if (isWeb) {
      await page.waitFor(2000)
    }
    // openDialog callback +2 dialog4 show +1 parent hide -10
    expect(await page.callMethod('getLifeCycleNum')).toBe(-7)

    // second triggerParentHide should not trigger parent hide
    await page.callMethod('openDialogWithTriggerParentHide')
    await page.waitFor(1000)
    if (isWeb) {
      await page.waitFor(2000)
    }
    // openDialog callback +2 dialog4 show +1
    expect(await page.callMethod('getLifeCycleNum')).toBe(-4)
    // close middle triggerParentHide dialogPage
    await page.callMethod('closeSpecifiedDialog', 1)
    await page.waitFor(200)
    // close callback +2 dialog4 unload -5
    expect(await page.callMethod('getLifeCycleNum')).toBe(-7)
    // close last triggerParentHide dialogPage shoud trigger parent show
    await page.callMethod('closeSpecifiedDialog', 1)
    await page.waitFor(200)
    // close callback +2 dialog4 unload -5 dialog4 show +1 parent show +10
    expect(await page.callMethod('getLifeCycleNum')).toBe(1)
    await page.callMethod('closeDialog')
    await page.waitFor(200)
    // close callback +2 dialog4 unload -5
    expect(await page.callMethod('getLifeCycleNum')).toBe(-2)
  })


  if (isAndroid || isIos) {
    it('after closeDialogPage reset statusBar color', async () => {
      const adbScreenShotArea = {
        x: 900,
        y: 50,
        width: 100,
        height: 70
      };
      if (isIos && platformInfo.indexOf('13.7') != -1) {
        adbScreenShotArea.x = 690
        adbScreenShotArea.y = 25
        adbScreenShotArea.width = 50
        adbScreenShotArea.height = 50
      } else if (process.env.uniTestPlatformInfo.startsWith('android 6')) {
        adbScreenShotArea.x = 535
        adbScreenShotArea.width = 90
        adbScreenShotArea.height = 50
      } else if (process.env.uniTestPlatformInfo.startsWith('android 12')) {
        adbScreenShotArea.x = 1160
        adbScreenShotArea.width = 70
        adbScreenShotArea.height = 80
      }

      const imageForParentInit = await program.screenshot({
        deviceShot: true,
        area: adbScreenShotArea,
      });
      expect(imageForParentInit).toSaveImageSnapshot();

      await page.callMethod('openDialog4')
      await page.waitFor(1000)
      const imageForDialog4_1 = await program.screenshot({
        deviceShot: true,
        area: adbScreenShotArea,
      });
      expect(imageForDialog4_1).toSaveImageSnapshot();

      await page.callMethod('openDialog3')
      await page.waitFor(1000)
      const imageForDialog3 = await program.screenshot({
        deviceShot: true,
        area: adbScreenShotArea,
      });
      expect(imageForDialog3).toSaveImageSnapshot();

      await page.callMethod('closeSpecifiedDialog', 1)
      await page.waitFor(1000)

      const imageForDialog4_2 = await program.screenshot({
        deviceShot: true,
        area: adbScreenShotArea,
      });
      expect(imageForDialog4_2).toSaveImageSnapshot();

      await page.callMethod('closeSpecifiedDialog', 0)
      await page.waitFor(1000)

      const imageForParentEnd = await program.screenshot({
        deviceShot: true,
        area: adbScreenShotArea,
      });
      expect(imageForParentEnd).toSaveImageSnapshot();
    })
  }
  it('input-hold-keyboard in dialog', async () => {
    await page.callMethod('jest_OpenDialog1')
    await page.waitFor(2000);
    await page.callMethod('jest_getTapPoint')
    const point_x = await page.data('jest_click_x');
    const point_y = await page.data('jest_click_y');
    if (isAndroid) {
      await program.adbCommand("input tap" + " " + point_x + " " + point_y)
      console.log("input tap" + " " + point_x + " " + point_y);
    } else {
      await program.tap({
        x: point_x,
        y: point_y
      })
    }

    await page.waitFor(1000);
    const image = await program.screenshot({
      deviceShot: true,
      area: {
        x: 0,
        y: 200,
      }
    })
    expect(image).toSaveImageSnapshot()
    await page.waitFor(2000);
    await page.callMethod('jest_CloseDialog1')
  })

  it('dialogPage hideStatusBar hideBottomNavigationIndicator', async () => {
    if (isAndroid) {
      await page.callMethod('openDialog2ForTest');
      await page.waitFor(1000);
      await page.callMethod('setPageStyleForTest', {
        hideStatusBar: true,
        hideBottomNavigationIndicator: true
      });
      await page.waitFor(2000);
      const image = await program.screenshot({
        deviceShot: true
      });
      expect(image).toSaveImageSnapshot();
      await page.waitFor(2000);
      await page.callMethod('closeDialog2ForTest');
    }
  });

  it('dialogPage androidThreeButtonNavigationTranslucent', async () => {
    if (isAndroid) {
      await page.callMethod('openDialog2ForTest');
      await page.waitFor(1000);
      await page.callMethod('setPageStyleForTest', {
        androidThreeButtonNavigationTranslucent: false
      });
      await page.waitFor(2000);
      const image = await program.screenshot({
        deviceShot: true
      });
      expect(image).toSaveImageSnapshot();
      await page.waitFor(2000);
      await page.callMethod('closeDialog2ForTest');
    }
  });

  afterAll(async () => {
    await page.callMethod('setLifeCycleNum', initLifeCycleNum)
  });
});
