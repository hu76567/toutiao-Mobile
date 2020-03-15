import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
// 用按需加载的方式配置路由
const Layout = () => import('@/views/layout')
// *************二级路由********
const home = () => import('@/views/home')
const question = () => import('@/views/question')
const video = () => import('@/views/video')
const user = () => import('@/views/user')
// ****************************

// *************一级路由*********
const chat = () => import('@/views/user/chat')
const login = () => import('@/views/login')
const profile = () => import('@/views/user/profile')
const search = () => import('@/views/search')
const searchresult = () => import('@/views/search/result')
const article = () => import('@/views/article')
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Layout,
    children: [{
      path: '',
      component: home // 首页
    }, {
      path: '/question',
      component: question // 问答
    }, {
      path: '/video',
      component: video // 视频
    }, {
      path: '/user',
      component: user // 用户信息
    }]
  }, {
    path: '/user/chat',
    component: chat
  }, {
    path: '/login',
    component: login
  }, {
    path: '/user/profile',
    component: profile
  }, {
    path: '/search',
    component: search
  }, {
    path: '/search/result',
    component: searchresult
  }, {
    path: 'article',
    component: article
  }
]
const router = new VueRouter({
  routes
})

export default router
