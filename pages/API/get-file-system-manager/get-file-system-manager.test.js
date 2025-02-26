jest.setTimeout(50000);
const PAGE_PATH = '/pages/API/get-file-system-manager/get-file-system-manager'


describe('ExtApi-FileManagerTest', () => {
  const platformInfo = process.env.uniTestPlatformInfo.toLocaleLowerCase()
  const isIOS = platformInfo.startsWith('ios')
  const isMP = platformInfo.startsWith('mp')
  const isWeb = platformInfo.startsWith('web')
  if (isWeb || process.env.UNI_AUTOMATOR_APP_WEBVIEW == 'true') {
    it('not support', () => {
      expect(1).toBe(1)
    })
    return
  }
  let page;
  let mBasePath;
  let mGlobalTempPath;
  let mGlobalRootPath


  function getData(key = '') {
    return new Promise(async (resolve, reject) => {
      const data = await page.data()
      resolve(key ? data[key] : data)
    })
  }


  beforeAll(async () => {
    page = await program.reLaunch(PAGE_PATH)
    await page.waitFor(600);
  });

  async function isDone() {
    let isDone = await page.waitFor(async () => {
      return await page.data('done')
    })
    await page.setData({
      done: false
    })
    return isDone
  }

  it('USER_DATA_PATH test', async () => {
    // 测试 USER_DATA_PATH
    let globalUserDataPath = await getData('globalUserDataPath')
    mBasePath = await getData('basePath')
    mGlobalRootPath = await getData('globalRootPath')
    mGlobalTempPath = await getData('globalTempPath')

    await page.setData({
      logAble: false,
      recursiveVal: true,
      copyToBasePath: globalUserDataPath,
      basePath: globalUserDataPath,
      rmDirFile: 'a',
      readDir: 'a',
      writeFile: 'a/1.txt',
      readFile: 'a/1.txt',
      unlinkFile: 'a/1.txt',
      writeFileContent: '锄禾日当午，汗滴禾下土，谁知盘中餐，粒粒皆辛苦'
    })

    // 先清除文件,需要清除全部可能存在的历史测试文件，避免运行失败
    const btnUnLinkFileButton = await page.$('#btn-clear-file')
    await btnUnLinkFileButton.tap()
    await isDone()


    // 清除文件夹
    const btnRmDirButton = await page.$('#btn-remove-dir')
    await btnRmDirButton.tap()
    await isDone()
    // 重新创建测试目录
    const btnMkdDirButton = await page.$('#btn-mkdir')
    await btnMkdDirButton.tap()
    await isDone()

    const btnReadDirButton = await page.$('#btn-read-dir')
    await btnReadDirButton.tap()
    await isDone()


    // 期望通过 recursive = true的 文件夹删除，得到一个空的 /a 目录
    let fileListComplete = await getData('fileListComplete')
    expect(JSON.stringify(fileListComplete)).toEqual('[]')
    let fileListSuccess = await getData('fileListSuccess')
    expect(JSON.stringify(fileListSuccess)).toEqual('[]')

    // 先测试 recursive = false 文件夹创建，期望失败
    await page.setData({
      recursiveVal: false,
      mkdirFile: 'a/b/c'
    })

    if (!isMP) {
      await btnMkdDirButton.tap()
      await isDone()


      let lastFailError = await getData('lastFailError')
      expect(lastFailError.errCode).toEqual(1300002)
      expect(lastFailError.errMsg).toEqual('No such file or directory')
      let lastCompleteError = await getData('lastCompleteError')
      expect(lastCompleteError.errCode).toEqual(1300002)
      expect(lastCompleteError.errMsg).toEqual('No such file or directory')
    }


    // 测试 recursive = true 期望文件夹创建成功
    await page.setData({
      recursiveVal: true
    })
    await btnMkdDirButton.tap()
    await isDone()

    await btnReadDirButton.tap()
    await isDone()

    // 期望通过 recursive = true的 文件夹删除，得到一个空的 /a 目录
    fileListComplete = await getData('fileListComplete')
    expect(JSON.stringify(fileListComplete)).toEqual("[\"b\"]")
    fileListSuccess = await getData('fileListSuccess')
    expect(JSON.stringify(fileListSuccess)).toEqual("[\"b\"]")

    // 测试写入文件
    const btnWriteFileButton = await page.$('#btn-write-file')
    await btnWriteFileButton.tap()
    await isDone()
    // 检查目录列表数量
    await btnReadDirButton.tap()
    await isDone()
    fileListComplete = await getData('fileListComplete')
    fileListComplete.sort()
    expect(JSON.stringify(fileListComplete)).toEqual("[\"1.txt\",\"b\"]")
    fileListSuccess = await getData('fileListSuccess')
    fileListSuccess.sort()
    expect(JSON.stringify(fileListSuccess)).toEqual("[\"1.txt\",\"b\"]")
    // 获取和对比 文件内容
    const btnReadFileButton = await page.$('#btn-read-file')
    await btnReadFileButton.tap()
    await isDone()
    let readFileRet = await getData('readFileRet')
    expect(readFileRet).toEqual("锄禾日当午，汗滴禾下土，谁知盘中餐，粒粒皆辛苦")

    // 更换文件内容 获取和对比 文件md5和sha1
    await page.setData({
      writeFileContent: "If you were a teardrop;In my eye,For fear of losing you,I would never cry.And if the golden sun,Should cease to shine its light,Just one smile from you,Would make my whole world bright.",
      getFileInfoAlgorithm: "md5"
    })
    await btnWriteFileButton.tap()
    await isDone()

    await btnReadFileButton.tap()
    await isDone()
    readFileRet = await getData('readFileRet')
    expect(readFileRet).toEqual(
      "If you were a teardrop;In my eye,For fear of losing you,I would never cry.And if the golden sun,Should cease to shine its light,Just one smile from you,Would make my whole world bright."
    )

    const btnGetFileInfoButton = await page.$('#btn-get-file-info')
    await btnGetFileInfoButton.tap()
    await isDone()

    let getFileInfoSize = await getData('getFileInfoSize')
    expect(getFileInfoSize).toEqual(185)
    let getFileInfoDigest = await getData('getFileInfoDigest')
    expect(getFileInfoDigest).toEqual("29ddd02ed3c38ccebb98884eda082cb1")
    // 切换为 sha1
    await page.setData({
      getFileInfoAlgorithm: "sha1"
    })

    await btnGetFileInfoButton.tap()
    await isDone()

    getFileInfoSize = await getData('getFileInfoSize')
    expect(getFileInfoSize).toEqual(185)
    getFileInfoDigest = await getData('getFileInfoDigest')
    expect(getFileInfoDigest).toEqual("ebef4e75783e0db499fc260d120e695005bead8a")

    // 测试 copyfile
    await page.setData({

      copyFromFile: "a/1.txt",
      copyToFile: "a/2.txt"
    })
    const btnCopyFileButton = await page.$('#btn-copy-file')
    await btnCopyFileButton.tap()
    await isDone()


    await btnReadDirButton.tap()
    await isDone()

    // 1.txt 2.txt 两个文件都存在
    fileListComplete = await getData('fileListComplete')
    fileListComplete.sort()
    expect(JSON.stringify(fileListComplete)).toEqual("[\"1.txt\",\"2.txt\",\"b\"]")
    fileListSuccess = await getData('fileListSuccess')
    fileListSuccess.sort()
    expect(JSON.stringify(fileListSuccess)).toEqual("[\"1.txt\",\"2.txt\",\"b\"]")

    // 测试 rename
    await page.setData({
      renameFromFile: "a/2.txt",
      renameToFile: "a/3.txt"
    })

    const btnRenameFileButton = await page.$('#btn-rename-file')
    await btnRenameFileButton.tap()
    await isDone()

    await btnReadDirButton.tap()
    await isDone()

    // 1.txt 3.txt 两个文件都存在
    fileListComplete = await getData('fileListComplete')
    fileListComplete.sort()
    expect(JSON.stringify(fileListComplete)).toEqual("[\"1.txt\",\"3.txt\",\"b\"]")
    fileListSuccess = await getData('fileListSuccess')
    fileListSuccess.sort()
    expect(JSON.stringify(fileListSuccess)).toEqual("[\"1.txt\",\"3.txt\",\"b\"]")
  });

  if (isMP) {
    // 如下大量测试是对非USER_DATA_PATH的测试，后续有机会再行整理
    return
  }
  it('TEMP_PATH test', async () => {
    // 测试 TEMP_PATH
    let globalTempPath = await getData('globalTempPath')

    let version = process.env.uniTestPlatformInfo
    version = parseInt(version.split(" ")[1])
    let testDirName = "我们经历了一场兵慌马乱的战争.1@2#3$4%5^6&7*8(9)0+-qwertyuiopasdfghjklzxcvbnm;,"
    if (version < 6) {
      // android 6 以下文件名不能包含特殊字符
      testDirName = "我们经历了一场兵慌马乱的战争"
    }

    await page.setData({
      logAble: false,
      recursiveVal: true,
      basePath: globalTempPath,
      copyToBasePath: globalTempPath,
      rmDirFile: 'a',
      mkdirFile: 'a',
      unlinkFile: 'a/' + testDirName + '/中文路径/张三/name/中文文件.mock'
    })


    // 先清除文件,需要清除全部可能存在的历史测试文件，避免运行失败
    const btnUnLinkFileButton = await page.$('#btn-unlink-file')
    await btnUnLinkFileButton.tap()
    await isDone()


    // 清除文件夹
    const btnRmDirButton = await page.$('#btn-remove-dir')
    await btnRmDirButton.tap()
    await isDone()

    // 重新创建测试目录
    const btnMkdDirButton = await page.$('#btn-mkdir')
    await btnMkdDirButton.tap()
    await isDone()

    const btnReadDirButton = await page.$('#btn-read-dir')
    await btnReadDirButton.tap()
    await isDone()


    // 期望通过 recursive = true的 文件夹删除，得到一个空的 /a 目录
    let fileListComplete = await getData('fileListComplete')
    expect(JSON.stringify(fileListComplete)).toEqual("[]")
    let fileListSuccess = await getData('fileListSuccess')
    expect(JSON.stringify(fileListSuccess)).toEqual("[]")

    // 测试 创建多层级文件目录
    await page.setData({
      recursiveVal: true,
      mkdirFile: 'a/b/c/d/e/f/g/h/i/g/k/l/m/n/o/p/q/r/s/t/u/v/w/x/y/z/中文路径/张三/test',
    })

    await btnMkdDirButton.tap()
    await isDone()

    await btnReadDirButton.tap()
    await isDone()

    fileListComplete = await getData('fileListComplete')
    expect(JSON.stringify(fileListComplete)).toEqual("[\"b\"]")
    fileListSuccess = await getData('fileListSuccess')
    expect(JSON.stringify(fileListSuccess)).toEqual("[\"b\"]")

    // 测试 创建包含中文特殊符号的目录
    await page.setData({
      recursiveVal: true,
      mkdirFile: 'a/' + testDirName + '/中文路径/张三/name',
    })
    await btnMkdDirButton.tap()
    await isDone()

    await btnReadDirButton.tap()
    await isDone()

    // 期望通过 recursive = true的 文件夹删除，得到一个空的 /a 目录
    fileListComplete = await getData('fileListComplete')
    fileListComplete.sort()
    expect(JSON.stringify(fileListComplete)).toEqual("[\"b\",\"" + testDirName + "\"]")
    fileListSuccess = await getData('fileListSuccess')
    fileListSuccess.sort()
    expect(JSON.stringify(fileListSuccess)).toEqual("[\"b\",\"" + testDirName + "\"]")

    /**
     * 从资源文件中读取图片为base64，测试写入较大文件场景
     * 'static/test-image/logo.ico' 注意，依赖这个资源文件，不能删除
     */
    await page.setData({
      basePath: "",
      readFile: 'static/test-image/logo.ico',
      readFileEncoding: 'base64'
    })


    // 获取和对比 文件内容
    const btnReadFileButton = await page.$('#btn-read-file')
    await btnReadFileButton.tap()
    await isDone()
    let readFileRet = await getData('readFileRet')
    expect(readFileRet.length).toEqual(5716)
    let endStr = readFileRet.substring(readFileRet.length - 10)
    expect(endStr).toEqual("AA///AA/8=")

    await page.setData({
      basePath: globalTempPath,
      writeFile: 'a/' + testDirName + '/中文路径/张三/name/中文文件.mock',
      writeFileContent: readFileRet
    })


    const btnWriteFileButton = await page.$('#btn-write-file')
    await btnWriteFileButton.tap()
    await isDone()

    // 获取文件列表，判断是否写入成功，同时置空base64内容 避免影响实时查看状态
    await page.setData({
      readDir: 'a/' + testDirName + '/中文路径/张三/name',
      readFileRet: '',
      writeFileContent: ''
    })

    // 检查目录列表数量
    await btnReadDirButton.tap()
    await isDone()
    fileListComplete = await getData('fileListComplete')
    expect(JSON.stringify(fileListComplete)).toEqual("[\"中文文件.mock\"]")
    fileListSuccess = await getData('fileListSuccess')
    expect(JSON.stringify(fileListSuccess)).toEqual("[\"中文文件.mock\"]")


    // 更换文件内容 获取和对比 文件md5和sha1
    await page.setData({
      getFileInfoFile: 'a/' + testDirName + '/中文路径/张三/name/中文文件.mock',
      getFileInfoAlgorithm: "md5",
    })

    const btnGetFileInfoButton = await page.$('#btn-get-file-info')
    await btnGetFileInfoButton.tap()
    await isDone()

    let getFileInfoSize = await getData('getFileInfoSize')
    expect(getFileInfoSize).toEqual(5716)
    let getFileInfoDigest = await getData('getFileInfoDigest')
    expect(getFileInfoDigest).toEqual("5d8accb35bda875ca3726d18b020e474")

    // 切换为 sha1
    await page.setData({
      getFileInfoAlgorithm: "sha1"
    })

    await btnGetFileInfoButton.tap()
    await isDone()

    getFileInfoSize = await getData('getFileInfoSize')
    expect(getFileInfoSize).toEqual(5716)
    getFileInfoDigest = await getData('getFileInfoDigest')
    expect(getFileInfoDigest).toEqual("b48cf507b618974ee5b7d5449d8c1911e2d68245")

    // 测试不支持的摘要算法，期望返回错误
    await page.setData({
      getFileInfoAlgorithm: "sha256"
    })
    if (!isMP) {
      await btnGetFileInfoButton.tap()
      await isDone()

      let lastFailError = await getData('lastFailError')
      expect(lastFailError.errCode).toEqual(1300022)
      let lastCompleteError = await getData('lastCompleteError')
      expect(lastCompleteError.errCode).toEqual(1300022)
    }


    // rename 到一个没有提前创建过的目录，期望返回错误
    await page.setData({
      renameFromFile: "a/" + testDirName + "/中文路径/张三/name/中文文件.mock",
      renameToFile: "a/没有提前创建的目录/3.txt"
    })

    if (!isMP) {
      const btnRenameFileButton = await page.$('#btn-rename-file')
      await btnRenameFileButton.tap()
      await isDone()

      lastFailError = await getData('lastFailError')
      expect(lastFailError.errCode).toEqual(1300002)
      lastCompleteError = await getData('lastCompleteError')
      expect(lastCompleteError.errCode).toEqual(1300002)
    }

    // 非递归创建一级目录。期望成功
    await page.setData({
      recursiveVal: false,
      mkdirFile: 'a/提前创建的目录',
    })

    await btnMkdDirButton.tap()
    await isDone()

    await page.setData({
      readDir: 'a',
    })

    await btnReadDirButton.tap()
    await isDone()

    fileListComplete = await getData('fileListComplete')
    fileListComplete.sort()
    expect(JSON.stringify(fileListComplete)).toEqual("[\"b\",\"" + testDirName +
      "\",\"提前创建的目录\"]")
    fileListSuccess = await getData('fileListSuccess')
    fileListSuccess.sort()
    expect(JSON.stringify(fileListSuccess)).toEqual("[\"b\",\"" + testDirName +
      "\",\"提前创建的目录\"]")


    await page.setData({
      copyFromFile: "a/" + testDirName + "/中文路径/张三/name/中文文件.mock",
      copyToFile: "a/提前创建的目录/4.txt"
    })

    const btnCopyFileButton = await page.$('#btn-copy-file')
    await btnCopyFileButton.tap()
    await isDone()

    await page.setData({
      readDir: 'a/提前创建的目录',
    })

    await btnReadDirButton.tap()
    await isDone()

    fileListComplete = await getData('fileListComplete')
    expect(JSON.stringify(fileListComplete)).toEqual("[\"4.txt\"]")
    fileListSuccess = await getData('fileListSuccess')
    expect(JSON.stringify(fileListSuccess)).toEqual("[\"4.txt\"]")

    await page.setData({
      unlinkFile: 'a/提前创建的目录/4.txt',
      rmDirFile: 'a/提前创建的目录'
    })
    await btnUnLinkFileButton.tap()
    await isDone()

    await btnReadDirButton.tap()
    await isDone()

    fileListComplete = await getData('fileListComplete')
    expect(JSON.stringify(fileListComplete)).toEqual("[]")
    fileListSuccess = await getData('fileListSuccess')
    expect(JSON.stringify(fileListSuccess)).toEqual("[]")

  });

  it('CROSS DIR test', async () => {
    /**
     * 跨越用户目录和代码资源目录
     */
    let globalRootPath = await getData('globalRootPath')
    await page.setData({
      recursiveVal: true,
      logAble: false,
      basePath: globalRootPath,
      readDir: 'a',
      rmDirFile: 'a',
      mkdirFile: 'a',
      accessFile: 'a/从代码目录拷贝的资源.png',
      unlinkFile: 'a/从代码目录拷贝的资源.png'
    })


    // 先清除文件,需要清除全部可能存在的历史测试文件，避免运行失败
    const btnClearFileButton = await page.$('#btn-clear-file')
    await btnClearFileButton.tap()
    await isDone()


    // 清除文件夹
    const btnRmDirButton = await page.$('#btn-remove-dir')
    await btnRmDirButton.tap()
    await isDone()

    // 重新创建测试目录，期望通过 recursive = true的 文件夹删除，得到一个空的 /a 目录
    const btnMkdDirButton = await page.$('#btn-mkdir')
    await btnMkdDirButton.tap()
    await isDone()

    const btnReadDirButton = await page.$('#btn-read-dir')
    await btnReadDirButton.tap()
    await isDone()

    let fileListComplete = await getData('fileListComplete')
    expect(JSON.stringify(fileListComplete)).toEqual('[]')
    let fileListSuccess = await getData('fileListSuccess')
    expect(JSON.stringify(fileListSuccess)).toEqual('[]')


    // 检查资源文件，此时不存在
    const btnAccessFileButton = await page.$('#btn-access-file')
    await btnAccessFileButton.tap()
    await isDone()

    let accessFileRet = await getData("accessFileRet")
    expect(accessFileRet).toEqual('')


    // 准备从资源目录拷贝png
    await page.setData({
      basePath: "",
      unlinkFile: 'static/test-image/logo.ico',
      accessFile: 'static/test-image/logo.ico',
    })
    // 检查资源文件，期望存在
    await btnAccessFileButton.tap()
    await isDone()

    accessFileRet = await getData("accessFileRet")
    expect(accessFileRet).toEqual('access:ok')

    // 尝试删除资源，期望失败
    const btnUnLinkFileButton = await page.$('#btn-unlink-file')
    await btnUnLinkFileButton.tap()
    await isDone()

    await btnAccessFileButton.tap()
    await isDone()

    accessFileRet = await getData("accessFileRet")
    expect(accessFileRet).toEqual('access:ok')
    // 复制资源到 root目录
    await page.setData({
      copyToBasePath: globalRootPath,
      copyFromFile: "static/test-image/logo.ico",
      copyToFile: "a/从代码目录拷贝的资源.png"
    })
    const btnCopyFileButton = await page.$('#btn-copy-file')
    await btnCopyFileButton.tap()
    await isDone()

    // 检查期望 root 目录中图片文件存在
    await page.setData({
      basePath: globalRootPath,
      unlinkFile: 'a/从代码目录拷贝的资源.png',
      accessFile: 'a/从代码目录拷贝的资源.png',
      rmDirFile: 'a',
    })
    await btnAccessFileButton.tap()
    await isDone()

    accessFileRet = await getData("accessFileRet")
    expect(accessFileRet).toEqual('access:ok')

    await btnUnLinkFileButton.tap()
    await isDone()

    await btnAccessFileButton.tap()
    await isDone()

    accessFileRet = await getData("accessFileRet")
    expect(accessFileRet).toEqual('')

    // 从页面的按钮触发一次文件复制
    const btnCopyStaticFileButton = await page.$('#btn-copyStatic-file')
    await btnCopyStaticFileButton.tap()
    await isDone()

    await btnReadDirButton.tap()
    await isDone()

    fileListComplete = await getData('fileListComplete')
    expect(JSON.stringify(fileListComplete)).toEqual("[\"mock.json\"]")
    fileListSuccess = await getData('fileListSuccess')
    expect(JSON.stringify(fileListSuccess)).toEqual("[\"mock.json\"]")

    // 从页面的按钮触发一次文件清空
    await btnClearFileButton.tap()
    await isDone()

    await btnReadDirButton.tap()
    await isDone()

    fileListComplete = await getData('fileListComplete')
    expect(JSON.stringify(fileListComplete)).toEqual("[]")
    fileListSuccess = await getData('fileListSuccess')
    expect(JSON.stringify(fileListSuccess)).toEqual("[]")

  });


  it('write and read', async () => {
    /**
     * 测试writefile readfile 各个参数是否符合预期
     */
    let globalTempPath = await getData('globalTempPath')
    await page.setData({
      recursiveVal: true,
      logAble: false,
      basePath: globalTempPath,
      readDir: 'd',
      rmDirFile: 'd',
      mkdirFile: 'd',
      writeFileContent: "我爱北京天安门，天安门前太阳升",
      writeFileEncoding: "utf-8",
      readFileEncoding: "utf-8",
      unlinkFile: 'd/write.bing',
      writeFile: 'd/write.bing',
      readFile: 'd/write.bing',
      getFileInfoFile: 'd/write.bing',
      getFileInfoAlgorithm: "sha1"
    })

    // 先清除文件,需要清除全部可能存在的历史测试文件，避免运行失败
    const btnUnLinkFileButton = await page.$('#btn-unlink-file')
    await btnUnLinkFileButton.tap()
    await isDone()

    // 清除文件夹
    const btnRmDirButton = await page.$('#btn-remove-dir')
    await btnRmDirButton.tap()
    await isDone()

    // 重新创建测试目录，期望通过 recursive = true的 文件夹删除，得到一个空的 /a 目录
    const btnMkdDirButton = await page.$('#btn-mkdir')
    await btnMkdDirButton.tap()
    await isDone()

    const btnReadDirButton = await page.$('#btn-read-dir')
    await btnReadDirButton.tap()
    await isDone()

    let fileListComplete = await getData('fileListComplete')
    expect(JSON.stringify(fileListComplete)).toEqual('[]')
    let fileListSuccess = await getData('fileListSuccess')
    expect(JSON.stringify(fileListSuccess)).toEqual('[]')

    // 先用utf-8 写入内容
    const btnWriteFileButton = await page.$('#btn-write-file')
    await btnWriteFileButton.tap()
    await isDone()

    const btnReadFileButton = await page.$('#btn-read-file')
    await btnReadFileButton.tap()
    await isDone()
    let readFileRet = await getData('readFileRet')
    expect(readFileRet).toEqual("我爱北京天安门，天安门前太阳升")

    const btnGetFileInfoButton = await page.$('#btn-get-file-info')
    await btnGetFileInfoButton.tap()
    await isDone()

    let getFileInfoSize = await getData('getFileInfoSize')
    expect(getFileInfoSize).toEqual(45)
    let getFileInfoDigest = await getData('getFileInfoDigest')
    expect(getFileInfoDigest).toEqual("2ae9c7672ff6c1e7c7e6a0bb4e74a6f06b39350b")

    // 尝试读取base64 信息
    await page.setData({
      readFileEncoding: "base64",
    })

    await btnReadFileButton.tap()
    await isDone()
    readFileRet = await getData('readFileRet')
    expect(readFileRet).toEqual("5oiR54ix5YyX5Lqs5aSp5a6J6Zeo77yM5aSp5a6J6Zeo5YmN5aSq6Ziz5Y2H")
    // 测试ascii，需要特别测试 ascii 写入非法字符的情况，因为微信的常量字符编码和android原生有差异。

    await page.setData({
      writeFileContent: "丙辰中秋，欢饮达旦，大醉，作此篇，兼怀子由。明月几时有？把酒问青天。不知天上宫阙，今夕是何年。我欲乘风归去，又恐琼楼玉宇，高处不胜寒。起舞弄清影，何似在人间",
      writeFileEncoding: "ascii",
      readFileEncoding: "base64",
    })

    await btnWriteFileButton.tap()
    await isDone()

    await btnGetFileInfoButton.tap()
    await isDone()

    getFileInfoSize = await getData('getFileInfoSize')
    expect(getFileInfoSize).toEqual(78)
    getFileInfoDigest = await getData('getFileInfoDigest')
    expect(getFileInfoDigest).toEqual("4ac7a65055628818341c2ad86ddc4205d8503801")

    await btnReadFileButton.tap()
    await isDone()
    readFileRet = await getData('readFileRet')
    expect(readFileRet).toEqual(
      "GbAtywwibr7mDCeJDFxkxwx8AFAxAg4I4PYJH4pS7lIpAg3lKQqrGQzKFS9VdAIRMljOUrsMyFA8fImHDNgEDdzSAnceBAVxDFU8KLr0"
    )

    // 尝试写入合法ascii
    await page.setData({
      writeFileContent: "hello jack.hello marry.",
      writeFileEncoding: "ascii",
      readFileEncoding: "ascii",
    })

    await btnWriteFileButton.tap()
    await isDone()

    await btnReadFileButton.tap()
    await isDone()
    readFileRet = await getData('readFileRet')
    expect(readFileRet).toEqual("hello jack.hello marry.")

    // 写入base64 获取 中文
    await page.setData({
      writeFileContent: "5LiZ6L6w5Lit56eL77yM5qyi6aWu6L6+5pem77yM5aSn6YaJ77yM5L2c5q2k56+H77yM5YW85oCA5a2Q55Sx44CC5piO5pyI5Yeg5pe25pyJ77yf5oqK6YWS6Zeu6Z2S5aSp44CC5LiN55+l5aSp5LiK5a6r6ZiZ77yM5LuK5aSV5piv5L2V5bm044CC5oiR5qyy5LmY6aOO5b2S5Y6777yM5Y+I5oGQ55C85qW8546J5a6H77yM6auY5aSE5LiN6IOc5a+S44CC6LW36Iie5byE5riF5b2x77yM5L2V5Ly85Zyo5Lq66Ze0",
      writeFileEncoding: "base64",
      readFileEncoding: "utf-8",
    })

    await btnWriteFileButton.tap()
    await isDone()

    await btnReadFileButton.tap()
    await isDone()
    readFileRet = await getData('readFileRet')
    expect(readFileRet).toEqual(
      "丙辰中秋，欢饮达旦，大醉，作此篇，兼怀子由。明月几时有？把酒问青天。不知天上宫阙，今夕是何年。我欲乘风归去，又恐琼楼玉宇，高处不胜寒。起舞弄清影，何似在人间")

    await page.setData({
      readFileEncoding: "base64",
    })

    await btnReadFileButton.tap()
    await isDone()
    readFileRet = await getData('readFileRet')
    expect(readFileRet).toEqual(
      "5LiZ6L6w5Lit56eL77yM5qyi6aWu6L6+5pem77yM5aSn6YaJ77yM5L2c5q2k56+H77yM5YW85oCA5a2Q55Sx44CC5piO5pyI5Yeg5pe25pyJ77yf5oqK6YWS6Zeu6Z2S5aSp44CC5LiN55+l5aSp5LiK5a6r6ZiZ77yM5LuK5aSV5piv5L2V5bm044CC5oiR5qyy5LmY6aOO5b2S5Y6777yM5Y+I5oGQ55C85qW8546J5a6H77yM6auY5aSE5LiN6IOc5a+S44CC6LW36Iie5byE5riF5b2x77yM5L2V5Ly85Zyo5Lq66Ze0"
    )

  });

  it('stat and asset test', async () => {
    // 测试 USER_DATA_PATH //globalTempPath
    let globalRootPath = await getData('globalRootPath')

    await page.setData({
      recursiveVal: true,
      copyToBasePath: globalRootPath,
      basePath: globalRootPath,
      globalTempPath: globalRootPath,
      rmDirFile: 'a',
      mkdirFile: 'a',
      unlinkFile: 'a/1.txt',
    })

    // 先清除文件,需要清除全部可能存在的历史测试文件，避免运行失败
    const btnUnLinkFileButton = await page.$('#btn-unlink-file')
    await btnUnLinkFileButton.tap()
    await isDone()

    await page.setData({
      unlinkFile: 'a/2.txt',
    })
    await btnUnLinkFileButton.tap()
    await isDone()

    await page.setData({
      unlinkFile: 'a/m/3.txt',
    })
    await btnUnLinkFileButton.tap()
    await isDone()

    // // 清除文件夹
    const btnRmDirButton = await page.$('#btn-remove-dir')
    await btnRmDirButton.tap()
    await isDone()
    // // 重新创建测试目录
    const btnMkdDirButton = await page.$('#btn-mkdir')
    await btnMkdDirButton.tap()
    await isDone()

    const btnReadDirButton = await page.$('#btn-read-dir')
    await btnReadDirButton.tap()
    await isDone()


    // 期望通过 recursive = true的 文件夹删除，得到一个空的 /a 目录
    let fileListComplete = await getData('fileListComplete')
    expect(JSON.stringify(fileListComplete)).toEqual('[]')
    let fileListSuccess = await getData('fileListSuccess')
    expect(JSON.stringify(fileListSuccess)).toEqual('[]')

    // 写入一个文件
    await page.setData({
      writeFileContent: "锄禾日当午，汗滴禾下土，谁知盘中餐，粒粒皆辛苦",
      writeFileEncoding: "utf-8",
      writeFile: 'a/1.txt',
      recursiveVal: false,
      statFile: 'a/1.txt',
    })

    let lastFailError = await getData('lastFailError')
    console.log(lastFailError)

    const btnWriteFileButton = await page.$('#btn-write-file')
    await btnWriteFileButton.tap()
    await isDone()

    let btnStatFileButton = await page.$('#btn-stat-file')
    await btnStatFileButton.tap()
    await isDone()

    // 读取单个文件信息
    let statsRet = await getData('statsRet')
    expect(statsRet.length).toEqual(1)
    expect(statsRet[0].path).toMatch(new RegExp('.*/a/1.txt$'))
    expect(statsRet[0].stats.size).toEqual(69)
    if (isAndroid()) {
      // 写入一个文件
      await page.setData({
        statsRet: ''
      })
      btnStatFileButton = await page.$('#btn-stat-file-sync')
      await btnStatFileButton.tap()
      await isDone()

      // 读取单个文件信息
      statsRet = await getData('statsRet')
      expect(statsRet.length).toEqual(1)
      expect(statsRet[0].path).toMatch(new RegExp('.*/a/1.txt$'))
      expect(statsRet[0].stats.size).toEqual(69)
    }

    /**
     * 创建子目录和子目录文件，测试recursive参数
     */
    await page.setData({
      writeFileContent: "1234567890",
      writeFileEncoding: "ascii",
      writeFile: 'a/2.txt',
      basePath: globalRootPath,
      recursiveVal: false,
      statFile: 'a',
      mkdirFile: 'a/m',
    })


    await btnWriteFileButton.tap()
    await isDone()

    // 创建子目录
    await btnMkdDirButton.tap()
    await isDone()

    // 复制一份文件到 /a/m/3.txt
    await page.setData({
      //  asset 只能正式版测试，这里只能模拟返回路径
      basePath: '',
      copyFromFile: 'static/test-image/logo.ico',
      copyToFile: 'a/m/3.txt',
    })
    const btnCopyFileButton = await page.$('#btn-copy-file')
    await btnCopyFileButton.tap()
    await isDone()


    await page.setData({
      basePath: globalRootPath,
      recursiveVal: true,
      statFile: 'a',
    })

    await btnStatFileButton.tap()
    await isDone()

    // 读取全部文件信息
    statsRet = await getData('statsRet')

    statsRet.sort(function(a, b) {
      if (a.path > b.path) {
        return 1
      } else if (a.path < b.path) {
        return -1
      }
      return 0
    })
    console.log(statsRet)
    expect(statsRet.length).toEqual(5)
    expect(statsRet[0].path).toMatch(new RegExp('.*/a$'))
    // expect(statsRet[0].stats.size).toEqual(0)

    expect(statsRet[2].path).toMatch(new RegExp('.*/a/2.txt$'))
    expect(statsRet[2].stats.size).toEqual(10)

    expect(statsRet[4].path).toMatch(new RegExp('.*/a/m/3.txt$'))
    expect(statsRet[4].stats.size).toEqual(4286)


    // 清理文件，避免影响其他测试用例
    await page.setData({
      unlinkFile: 'a/1.txt',
    })
    await btnUnLinkFileButton.tap()
    await isDone()

    await page.setData({
      unlinkFile: 'a/2.txt',
    })
    await btnUnLinkFileButton.tap()
    await isDone()

    await page.setData({
      unlinkFile: 'a/m/3.txt',
      rmDirFile: 'a',
      readDir: 'a',
      recursiveVal: true,
    })
    await btnUnLinkFileButton.tap()
    await isDone()

    await btnRmDirButton.tap()
    await isDone()

    await btnReadDirButton.tap()
    await isDone()

    // 期望通过 recursive = true的 文件夹删除，得到一个空的 /a 目录
    fileListComplete = await getData('fileListComplete')
    expect(JSON.stringify(fileListComplete)).toEqual('[]')
    fileListSuccess = await getData('fileListSuccess')
    expect(JSON.stringify(fileListSuccess)).toEqual('[]')

  });
  it('appendFileTest', async () => {
    if (!isAndroid()) {
      return
    }


    let basePath = await getData('basePath')

    await page.setData({
      basePath: mBasePath,
      recursiveVal: true,
      logAble: false,
      rmDirFile: 'appendfile',
      mkdirFile: 'appendfile',
      writeFileContent: "我爱北京天安门，天安门前太阳升",
      appendFileContent: "再说一遍",
      writeFileEncoding: "utf-8",
      readFileEncoding: "utf-8",
      readFile: 'appendfile/appendfile.txt',
      unlinkFile: 'appendfile/appendfile.txt',
      writeFile: 'appendfile/appendfile.txt',
    })

    // 先清除文件,需要清除全部可能存在的历史测试文件，避免运行失败
    const btnUnLinkFileButton = await page.$('#btn-unlink-file')
    await btnUnLinkFileButton.tap()
    await isDone()

    // 清除文件夹
    const btnRmDirButton = await page.$('#btn-remove-dir')
    await btnRmDirButton.tap()
    await isDone()

    // 重新创建测试目录，期望通过 recursive = true的 文件夹删除，得到一个空的 /a 目录
    const btnMkdDirButton = await page.$('#btn-mkdir')
    await btnMkdDirButton.tap()
    await isDone()

    // 先用utf-8 写入内容
    const btnWriteFileButton = await page.$('#btn-write-file')

    await btnWriteFileButton.tap()
    await isDone()


    //追加内容
    const btnAppendFileButton = await page.$('#btn-append-file')
    await btnAppendFileButton.tap()
    await isDone()

    const btnReadFileButton = await page.$('#btn-read-file')
    await btnReadFileButton.tap()
    await isDone()
    let readFileRet = await getData('readFileRet')
    expect(readFileRet).toEqual("我爱北京天安门，天安门前太阳升再说一遍")
  });
  //nlinkSyncTest mkdirSyncTest appendFileTest writeFileSyncTest readFileSyncTest rmdirSyncTest readDirSyncTest accessFileSyncTest
  //renameFileSync copyFileSyncTest appendFileSyncTest truncateFileTest truncateFileSyncTest
  it('sync test',
    async () => {
      if (!isAndroid()) {
        return
      }


      await page.setData({
        basePath: mBasePath,
        recursiveVal: false,
        logAble: false,
        rmDirFile: 'sync',
        mkdirFile: 'sync',
        writeFileContent: "我爱北京天安门，天安门前太阳升",
        appendFileContent: "再说一遍",
        writeFileEncoding: "utf-8",
        readFileEncoding: "utf-8",
        readDir: 'sync',
        rmDirFile: 'sync',
        unlinkFile: 'sync/sync.txt',
        readFile: 'sync/sync.txt',
        writeFile: 'sync/sync.txt',
        accessFile: 'sync/sync.txt',
        renameToFile: 'sync/sync.txt',
        renameFromFile: 'sync/sync.txt',
      })
      await clearDir('sync')
      // 重新创建测试目录，期望通过 recursive = true的 文件夹删除，得到一个空的  目录
      const btnMkdDirButton = await page.$('#btn-mkdir-sync')
      await btnMkdDirButton.tap()
      await isDone()

      const btnReadDirButton = await page.$('#btn-read-dir-sync')
      await btnReadDirButton.tap()
      await isDone()
      const fileListSuccess = await getData('fileListSuccess')
      expect(JSON.stringify(fileListSuccess)).toEqual('[]')

      // 先用utf-8 写入内容
      const btnWriteFileButton = await page.$('#btn-write-file-sync')
      await btnWriteFileButton.tap()
      await isDone()

      let btnAccessFileButton = await page.$('#btn-access-file-sync')
      await btnAccessFileButton.tap()
      await isDone()
      let accessFileRet = await getData("accessFileRet")
      expect(accessFileRet).toEqual('access:ok')

      //重新命名文件
      const btnRenameFileButton = await page.$('#btn-rename-file-sync')
      await btnRenameFileButton.tap()
      await isDone()
      let renameFileRet = await getData("renameFileRet")
      expect(renameFileRet).toEqual("rename:ok")


      //追加内容
      let btnAppendFileButton = await page.$('#btn-append-file')
      await btnAppendFileButton.tap()
      await isDone()

      btnAppendFileButton = await page.$('#btn-append-file-sync')
      await btnAppendFileButton.tap()


      let btnReadFileButton = await page.$('#btn-read-file-sync')
      await btnReadFileButton.tap()
      await isDone()
      let readFileRet = await getData('readFileRet')
      expect(readFileRet).toEqual("我爱北京天安门，天安门前太阳升再说一遍再说一遍")

      //truncateFileTest
      let btnTruncateFile = await page.$('#btn-truncate-file')
      await btnTruncateFile.tap()
      await isDone()
      btnReadFileButton = await page.$('#btn-read-file-sync')
      await btnReadFileButton.tap()
      await isDone()
      readFileRet = await getData('readFileRet')
      expect(readFileRet).toEqual("我爱北京天安门")

      btnTruncateFile = await page.$('#btn-truncate-file-sync')
      await btnTruncateFile.tap()
      await isDone()
      btnReadFileButton = await page.$('#btn-read-file-sync')
      await btnReadFileButton.tap()
      await isDone()
      readFileRet = await getData('readFileRet')
      expect(readFileRet).toEqual("我爱北京")


      // 测试 copyfile
      await page.setData({
        basePath: mBasePath,
        copyToBasePath: mBasePath,
        copyFromFile: "sync/sync.txt",
        copyToFile: "sync/syncto.txt",
        accessFile: "sync/syncto.txt"
      })
      const btnCopyFileButton = await page.$('#btn-copy-file-sync')
      await btnCopyFileButton.tap()
      await isDone()
      btnAccessFileButton = await page.$('#btn-access-file-sync')
      await btnAccessFileButton.tap()
      await isDone()
      accessFileRet = await getData("accessFileRet")
      expect(accessFileRet).toEqual('access:ok')

      await clearDir('sync')
    });

  async function createFile() {
    // 重新创建测试目录，期望通过 recursive = true的 文件夹删除，得到一个空的  目录
    const btnMkdDirButton = await page.$('#btn-mkdir-sync')
    await btnMkdDirButton.tap()
    await isDone()

    // 先用utf-8 写入内容
    const btnWriteFileButton = await page.$('#btn-write-file-sync')
    await btnWriteFileButton.tap()
    await isDone()
  }

  async function clearDir(dir) {
    // 最后需要清楚所有文件避免测试失败
    await page.setData({
      rmDirFile: dir,
    })
    const btnUnLinkFileButton = await page.$('#btn-clear-file')
    await btnUnLinkFileButton.tap()
    await isDone()

    const btnClear = await page.$('#btn-remove-dir')
    await btnClear.tap()
    await isDone()
  }

  function isAndroid() {
    if (isWeb || isMP || process.env.UNI_AUTOMATOR_APP_WEBVIEW ===
      'true') {
      expect(1).toBe(1)
      return false
    }
    if (process.env.uniTestPlatformInfo.toLocaleLowerCase().startsWith('ios')) {
      expect(1).toBe(1)
      return false
    }
    return true
  }

  it('getSavedFileListTest',
    async () => {
      if (!isAndroid()) {
        return
      }
      // await page.setData({
      //   logAble: false,
      //   basePath: mBasePath
      // })
      // console.log('getSavedFileListTest', 'start')
      // await clearDir('')
      // console.log('getSavedFileListTest', 'end')
      await page.setData({
        logAble: false,
        basePath: mGlobalTempPath,
        temFile: 'save3/2.txt',
        mkdirFile: 'save3',
        writeFile: 'save3/2.txt',
        accessFile: '2.txt'
      })
      await createFile()
      await page.setData({
        basePath: mBasePath,
        writeFile: 'save/2.txt',
      })
      btnSaveFile = await page.$('#btn-save-file-sync')
      await btnSaveFile.tap()
      await isDone()
      let btnSavedFileList = await page.$('#btn-getsaved-filelist')
      await btnSavedFileList.tap()
      await isDone()
      let getSavedFileListRet = await getData("getSavedFileListRet")
      console.log('getSavedFileListTest->' + getSavedFileListRet)
      expect(getSavedFileListRet).toEqual('getSavedFileList:ok')
    });

  it('removeSavedFileTest',
    async () => {
      if (!isAndroid()) {
        return
      }
      await page.setData({
        logAble: false,
        basePath: mBasePath
      })
      await clearDir('save4')
      await page.setData({
        logAble: false,
        basePath: mGlobalTempPath,
        temFile: 'save4/saveSync.txt',
        mkdirFile: 'save4',
        writeFile: 'save4/saveSync.txt',
        accessFile: 'saveSync.txt'
      })
      await createFile()
      let btnRemoveSavedFileRet = await page.$('#btn-remove-saved-file')
      await btnRemoveSavedFileRet.tap()
      await isDone()
      let removeSavedFileRet = await getData("removeSavedFileRet")
      expect(removeSavedFileRet).toEqual('removeSavedFile:ok')

    });

  //openFiletest openFileSynctest closeTest closeTestSync writeTest writeSyncTest
  it('openFiletest', async () => {
    if (!isAndroid()) {
      return
    }

    await page.setData({
      basePath: mBasePath,
      logAble: false,
      mkdirFile: 'fd',
      writeFile: 'fd/1.txt',
      readFile: 'fd/1.txt'
    })
    await clearDir('fd')
    await createFile()
    console.log('openFiletest', '2')
    //openFiletest
    let btnOpenFile = await page.$('#btn-open-file')
    await btnOpenFile.tap()
    await isDone()
    let fd = await getData("fd")
    expect(fd).not.toBe('');
    await page.setData({
      fd: '',
    })
    console.log('openFiletest', '3')
    //openFileSynctest
    btnOpenFile = await page.$('#btn-open-file-sync')
    await btnOpenFile.tap()
    await isDone()
    fd = await getData("fd")
    expect(fd).not.toBe('');
    console.log('openFiletest', '4')
  });
  // closeTest closeTestSync
  it('closeTest', async () => {
    if (!isAndroid()) {
      return
    }



    await page.setData({
      basePath: mBasePath,
      logAble: false,
      mkdirFile: 'fd',
      writeFile: 'fd/1.txt',
      readFile: 'fd/1.txt'
    })
    await clearDir('fd')
    await createFile()
    //closeTest
    let btnCloseFile = await page.$('#btn-close-file')
    await btnCloseFile.tap()
    await isDone()
    let closeFileRet = await getData("closeFileRet")
    expect(closeFileRet).toEqual('close:ok')
    await page.setData({
      closeFileRet: '',
    })
    //closeTestSync
    btnCloseFile = await page.$('#btn-close-file-sync')
    await btnCloseFile.tap()
    await isDone()
    closeFileRet = await getData("closeFileRet")
    expect(closeFileRet).toEqual('close:ok')

  });
  //writeTest writeSyncTest
  it('writeTest', async () => {
    if (!isAndroid()) {
      return
    }
    console.log('writeTest', 'start')

    await page.setData({
      basePath: mBasePath,
      logAble: false,
      mkdirFile: 'fd',
      writeFile: 'fd/1.txt',
      readFile: 'fd/1.txt',
      writeData: '我是一只小小鸟'
    })
    await clearDir('fd')
    await createFile()
    console.log('writeTest', '1')
    let btnWrite = await page.$('#btn-write')
    await btnWrite.tap()
    await isDone()
    let bytesWritten = await getData("bytesWritten")
    let lastFailError = await getData("lastFailError")
    if (bytesWritten != 7) {
      let writeData = await getData("writeData")
      console.log('writeTest', lastFailError.errCode, lastFailError.errMsg, bytesWritten,
        writeData)
    }

    expect(bytesWritten).toEqual(7)
    console.log('writeTest', '2')
    //writeSyncTest
    await page.setData({
      writeFile: 'fd/1.txt',
      readFile: 'fd/1.txt',
      writeData: '我是'
    })

    btnWrite = await page.$('#btn-write-sync')
    await btnWrite.tap()
    await isDone()
    bytesWritten = await getData("bytesWritten")
    expect(bytesWritten).toEqual(2)
    console.log('writeTest', '3')
    //fstatTest
    let btnFstat = await page.$('#btn-fstat-file')
    await btnFstat.tap()
    await isDone()
    let fstat = await getData("fstat")
    expect(fstat.size > 0).toBe(true)
    console.log('writeTest', '4')

    //fstatSyncTest
    btnFstat = await page.$('#btn-fstat-file-sync')
    await btnFstat.tap()
    await isDone()
    fstat = await getData("fstat")
    expect(fstat.size > 0).toBe(true)
    console.log('writeTest', '5')

    //ftruncateFileTest
    let btnFTruncateFile = await page.$('#btn-ftruncate-file')
    await btnFTruncateFile.tap()
    await isDone()
    let ftruncateRet = await getData("ftruncateRet")
    expect(fstat).not.toEqual('ftruncate:ok')
    await page.setData({
      ftruncate: '',
    })
    console.log('writeTest', '6')

    //ftruncateFileSyncTest
    btnFTruncateFile = await page.$('#btn-ftruncate-file-sync')
    await btnFTruncateFile.tap()
    await isDone()
    ftruncateRet = await getData("ftruncateRet")
    expect(fstat).not.toEqual('ftruncate:ok')
    console.log('writeTest', '7')
  });
  //writeTest writeSyncTest
  it('ftruncateFileTest', async () => {
    if (!isAndroid()) {
      return
    }
    console.log('ftruncateFileTest', 'start')

    await page.setData({
      basePath: mBasePath,
      logAble: false,
      mkdirFile: 'fd',
      writeFile: 'fd/1.txt',
      readFile: 'fd/1.txt',
      writeData: '我是一只小小鸟我是'
    })
    await clearDir('fd')
    await createFile()
    console.log('ftruncateFileTest', '1')
    btnWrite = await page.$('#btn-write-sync')
    await btnWrite.tap()
    await isDone()
    bytesWritten = await getData("bytesWritten")
    expect(bytesWritten).toEqual(9)
    console.log('ftruncateFileTest', '3')
    //ftruncateFileTest
    let btnFTruncateFile = await page.$('#btn-ftruncate-file')
    await btnFTruncateFile.tap()
    await isDone()
    let ftruncateRet = await getData("ftruncateRet")
    expect(ftruncateRet).toEqual('ftruncate:ok')
    await page.setData({
      ftruncate: '',
    })
    console.log('ftruncateFileTest', '6')

    //ftruncateFileSyncTest
    btnFTruncateFile = await page.$('#btn-ftruncate-file-sync')
    await btnFTruncateFile.tap()
    await isDone()
    ftruncateRet = await getData("ftruncateRet")
    expect(ftruncateRet).toEqual('ftruncate:ok')
    console.log('ftruncateFileTest', '7')
  });

  //testAppendFileBuffer
  it('testAppendFileBuffer', async () => {
    if (!isAndroid()) {
      return
    }

    var btnWrite = await page.$('#btn-appendfile-buffer')
    await btnWrite.tap()
    await isDone()
    let arrayBufferRes = await getData("arrayBufferRes")
    expect(arrayBufferRes).toEqual(21)
  });

  it('testAppendFileBufferSync', async () => {
    if (!isAndroid()) {
      return
    }

    var btnWrite = await page.$('#btn-appendfilesync-buffer')
    await btnWrite.tap()
    await isDone()
    let arrayBufferRes = await getData("arrayBufferRes")
    expect(arrayBufferRes).toEqual(20)
  });

  it('testWriteReadSyncBuffer', async () => {
    if (!isAndroid()) {
      return
    }

    var btnWrite = await page.$('#btn-writereadsync-buffer')
    await btnWrite.tap()
    await isDone()
    let arrayBufferRes = await getData("arrayBufferRes")
    expect(arrayBufferRes).toEqual(1.11)
  });

  it('testWriteReadBuffer', async () => {
    if (!isAndroid()) {
      return
    }

    var btnWrite = await page.$('#btn-writeread-buffer')
    await btnWrite.tap()
    await isDone()
    let arrayBufferRes = await getData("arrayBufferRes")
    expect(arrayBufferRes).toEqual(1.24)
  });

  it('testWriteReadFileSyncBuffer', async () => {
    if (!isAndroid()) {
      return
    }

    var btnWrite = await page.$('#btn-writereadfilesync-buffer')
    await btnWrite.tap()
    await isDone()
    let arrayBufferRes = await getData("arrayBufferRes")
    expect(arrayBufferRes).toEqual(1.333)
  });

  it('testReadFileBuffer', async () => {
    if (!isAndroid()) {
      return
    }

    var btnWrite = await page.$('#btn-writereadfile-buffer')
    await btnWrite.tap()
    await isDone()
    let arrayBufferRes = await getData("arrayBufferRes")
    expect(arrayBufferRes).toEqual(1.2222222)
  });

  it('testReadAssetFile', async () => {
    if (!isAndroid()) {
      return
    }

    await page.setData({
      basePath: 'file:///android_asset/uni-app-x',
      logAble: false,
      readFileRet: "",
      readFile: '/version.json'
    })
    let btnReadFileButton = await page.$('#btn-read-file-sync')
    await btnReadFileButton.tap()
    await isDone()
    let readFileRet = await getData('readFileRet')
    expect(readFileRet.length > 0).toBe(true)
  });
});
