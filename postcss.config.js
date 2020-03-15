// 处理postcss插件  px转rem
module.exports = {
  // postcss插件
  plugins: {
    // 给css样式加前缀的属性 display:flex
    autoprefixer: {},
    'postcss-pxtorem': {
      rootValue: 37.5, // 基准值
      propList: ['*'] // 所有文件都转化rem
    }
  }
}
