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
  },
  configureWebpack: (config) => {
    // config就是vue-cli中所有的webpack配置
    // 判断是生产环境还是开发环境
    if (process.env.NODE_ENV === 'production') {
      // 只需要在生产环境中把所有console删除在打包
      // 删除不是删除源代码的console,是删除打包完的
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
    }
  },
  publicPath: './'// 打包后的引用地址
}
