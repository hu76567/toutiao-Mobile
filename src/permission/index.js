// 做导航守卫
import router from '@/router'
import store from '@/store'

// 前置守卫
router.beforeEach(function (to, from, next) {
  // 以 '/user' 起始但是没带token 判断请求地址和token  拦截请求回去登录
  if (to.path.startsWith('/user') && !store.state.user.token) {
    next({
      path: '/login', // 要跳转的地址
      query: {
        redirectUrl: to.fullPath // 登录后要回去原来的地址
      }
    })
  } else {
    next() // 放行
  }
})
