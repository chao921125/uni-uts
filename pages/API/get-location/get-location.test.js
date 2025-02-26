const PAGE_PATH = "/pages/API/get-location/get-location";
const platformInfo = process.env.uniTestPlatformInfo.toLocaleLowerCase()
const isAndroid = platformInfo.startsWith('android')
const isIos = platformInfo.startsWith('ios')
const isApp = isAndroid || isIos
const isWeb = platformInfo.startsWith('web')
const isMP = platformInfo.startsWith('mp')

describe("get-location", () => {
    if(isMP) {
      // 微信上会有权限弹框，暂时屏蔽测试
      it('not support', async () => {
        expect(1).toBe(1)
      })
      return
    }
    beforeAll(async () => {
      page = await program.reLaunch(PAGE_PATH)
      await page.waitFor(600)
    });

    //system 定位
    it("system+type=wgs84+success", async () => {

      await page.setData({
        jest_provider: 'system',
        jest_type: 'wgs84',
        jest_isAltitude: true,
        jest_isGeocode: false,
        jest_isHighAccuracy: false
      })
      await page.callMethod('jestGetLocation')
      await page.waitFor(async () => {
        return await page.data('jest_complete') === true;
      });

      const data = await page.data()
      const jest_errCode = data['jest_errCode']

      if (jest_errCode > 0) {
        expect((await page.data())['jest_errCode']).toEqual(expect.any(Number));
      } else {
        //判断经纬度是否在正常范围
        expect((await page.data())['jest_longitude']).toBeGreaterThanOrEqual(-180);
        expect((await page.data())['jest_longitude']).toBeLessThanOrEqual(180);
        expect((await page.data())['jest_latitude']).toBeGreaterThanOrEqual(-90);
        expect((await page.data())['jest_latitude']).toBeLessThanOrEqual(90);
        //判断海拔是否正确
        expect((await page.data())['jest_altitude']).toEqual(expect.any(Number));
      }
    });

    //system 定位
    it("system+type=wgs84+success+geocode=true", async () => {

      await page.setData({
        jest_provider: 'system',
        jest_type: 'wgs84',
        jest_isAltitude: true,
        jest_isGeocode: true,
        jest_isHighAccuracy: false
      })
      await page.callMethod('jestGetLocation')
      await page.waitFor(async () => {
        return await page.data('jest_complete') === true;
      });

      const data = await page.data()
      const jest_errCode = data['jest_errCode']

      if (jest_errCode > 0) {
        if (isIos) {
          expect((await page.data())['jest_errCode']).toEqual(1505603);
        } else if (isAndroid) {
          expect((await page.data())['jest_errCode']).toEqual(1505700);
        } else {
          expect((await page.data())['jest_errCode']).toEqual(expect.any(Number));
        }
      }
    });

    //system 定位
    it("system+type=wgs84+success+altitude=false", async () => {

      await page.setData({
        jest_provider: 'system',
        jest_type: 'wgs84',
        jest_isAltitude: false,
        jest_isGeocode: true,
        jest_isHighAccuracy: false
      })
      await page.callMethod('jestGetLocation')
      await page.waitFor(async () => {
        return await page.data('jest_complete') === true;
      });

      const data = await page.data()
      const jest_errCode = data['jest_errCode']

      if (jest_errCode > 0) {
        //如果定位出错
        expect((await page.data())['jest_errCode']).toEqual(expect.any(Number));
      } else {
        expect((await page.data())['jest_altitude']).toEqual(0);
      }
    });

    //system 定位
    it("system+type=gcj02+fail", async () => {
      await page.setData({
        jest_provider: 'system',
        jest_type: 'gcj02',
        jest_isAltitude: true,
        jest_isGeocode: true,
        jest_isHighAccuracy: false
      })
      await page.callMethod('jestGetLocation')
      await page.waitFor(async () => {
        return await page.data('jest_complete') === true;
      });
      if (isApp) {
        expect((await page.data())['jest_errCode']).toEqual(1505601);
      }
    });


    //tencent 定位
    it("tencent+type=gcj02+success", async () => {
        await page.setData({
          jest_provider: 'tencent',
          jest_type: 'gcj02',
          jest_isAltitude: true,
          jest_isGeocode: true,
          jest_isHighAccuracy: true
        })
        await page.callMethod('jestGetLocation')
        await page.waitFor(async () => {
          return await page.data('jest_complete') === true;
        });

        const data = await page.data()
        const jest_errCode = data['jest_errCode']

        if (jest_errCode > 0) {
          //如果定位出错
          expect((await page.data())['jest_errCode']).toEqual(expect.any(Number));
        } else {
          //判断逆地理编码是否正确
          expect((await page.data())['jest_address']).toEqual(expect.any(String));
          //判断经纬度是否在正常范围
          expect((await page.data())['jest_longitude']).toBeGreaterThanOrEqual(-180);
          expect((await page.data())['jest_longitude']).toBeLessThanOrEqual(180);
          expect((await page.data())['jest_latitude']).toBeGreaterThanOrEqual(-90);
          expect((await page.data())['jest_latitude']).toBeLessThanOrEqual(90);
          //判断海拔是否正确
          expect((await page.data())['jest_altitude']).toEqual(expect.any(Number));
        }
    });

    //tencent 定位
    it("tencent+type=wgs84+fail", async () => {
      await page.setData({
        jest_provider: 'tencent',
        jest_type: 'wgs84',
        jest_isAltitude: true,
        jest_isGeocode: true,
        jest_isHighAccuracy: true
      })
      await page.callMethod('jestGetLocation')
      await page.waitFor(async () => {
        return await page.data('jest_complete') === true;
      });
      if (isApp) {
          expect((await page.data())['jest_errCode']).toEqual(1505607);
      }
    });
});
