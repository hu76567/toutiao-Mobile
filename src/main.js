import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 完整导入vant  后期优化需要按需加载
// 引用Vant组件
import Vant from 'vant'
// 引入样式
import 'vant/lib/index.css'
// 注册Vant组件
Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
