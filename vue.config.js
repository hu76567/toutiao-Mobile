/* 导出一个对象 */
module.exports = {
  // 更改less中变量的配置
  css: {
    //   css相关
    loaderOptions: {
      // 样式loader
      less: {
        modifyVars: {
          // 直接覆盖变量
          blue: '#3296fa'
        }
      }
    }
  }
}
