// 提供小函数以及vue中常用的过滤器及函数

export default {
  // 该方法会在vue.use()时调用
  install (Vue) {
    Vue.prototype.$hnotify = (params) => Vue.prototype.$notify({ duration: 2000, ...params })
  }
}
