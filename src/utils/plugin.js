// 提供小函数以及vue中常用的过滤器及函数

// 时间处理初始化

// 引入dayjs
import dayjs from 'dayjs'
// 引入相对时间插件
import relativeTime from 'dayjs/plugin/relativeTime'
// 引入语言包
import 'dayjs/locale/zh-cn'
// dayjs扩展相对时间的方法
dayjs.extend(relativeTime)

export default {
  // 该方法会在vue.use()时调用
  install (Vue) {
    // 这里借用了vant的$notify方法
    Vue.prototype.$hnotify = (params) => Vue.prototype.$notify({ duration: 1000, ...params })
    // params是后面的参数,接收的是message
    // 还是用notify  只是把notify的时间改变了
    // $hnotify可以像notify一样调用
    // $hnotify指向$notify
    // 在在login页面的message 后面继续写时间会覆盖这里的时间
    // 相当于在notify中插了一脚,不影响原来的功能,可以有新功能

    // 定义了一个原型属性,所有组件都有这个属性
    Vue.prototype.$sleep = sleep

    // 全局过滤器  处理时间
    Vue.filter('relTime', relTime)
  }
}

// 休眠函数  time=500默认值 如果传入了值会更新此值
function sleep (time = 500) {
  // 返回一个promise
  return new Promise(function (resolve, reject) {
    // 成功执行  但是要延时
    setTimeout(() => { resolve() }, time)
  })
}

/** 相对时间的处理 */
// date 是传入的日期
function relTime (date) {
  // dayjs是当前时间
  // from中是传入时间
  // locale 语言转换
  return dayjs().locale('zh-cn').from(date)
}
