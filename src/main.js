import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@/permission' // 权限拦截模块
import store from './store'
// 完整导入vant  后期优化需要按需加载
// 引用Vant组件和lazyload
import Vant, { Lazyload } from 'vant'
// 引入样式
import 'vant/lib/index.less'
// 注册Vant组件
// 引入全局样式 覆盖vant
import '@/styles/index.less'
// 引入flex布局
import 'amfe-flexible'

import plugin from '@/utils/plugin'

Vue.use(Vant)
// 初始化插件 要放在vue.use(vant)之后
Vue.use(plugin)
// 注册懒加载组件
Vue.use(Lazyload)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
// 在main.js中添加如下代码  此代码是采用的 5+ Runtime中的plus对象
document.addEventListener('plusready', function () {
  var webview = window.plus.webview.currentWebview()
  window.plus.key.addEventListener('backbutton', function () {
    webview.canBack(function (e) {
      if (e.canBack) {
        webview.back()
      } else {
        // webview.close(); //hide,quit
        // plus.runtime.quit();
        // 首页返回键处理
        // 处理逻辑：1秒内，连续两次按返回键，则退出应用；
        var first = null
        window.plus.key.addEventListener('backbutton', function () {
          // 首次按键，提示‘再按一次退出应用’
          if (!first) {
            first = new Date().getTime()
            setTimeout(function () {
              first = null
            }, 1000)
          } else {
            if (new Date().getTime() - first < 1500) {
              window.plus.runtime.quit()
            }
          }
        }, false)
      }
    })
  })
})
