/*
请求管理工具
*/
import axios from 'axios'
import jsonbig from 'json-bigint'
import store from '@/store' // 引入vuex中的store
import router from '@/router' // 引用router
// axios.defaults是对原有默认值进行修改
// axios.create相当于new了一个新的实例

// 创建一个新的实例 instance有axios的所有方法,这里只设置两个
const instance = axios.create({
  // 构造参数 传入一些配置 和defaults一样
  baseURL: 'http://ttapi.research.itcast.cn/app/v1_0', // 基地址
  //    在后台响应回来但是没有进入到响应拦截器时执行,数组里可以写多个处理函数
  transformResponse: [function (data) {
    //  data就是后端响应回来的字符串
    return data ? jsonbig.parse(data) : {}
  }]
})
// 请求之前注入token  请求拦截器
instance.interceptors.request.use(
  function (config) {
    // 读取配置信息 给配置信息注入token
    if (store.state.user.token) {
      config.headers.Authorization = `Bearer ${store.state.user.token}`
    }
    return config
  }, function (error) {
  // 返回错误
    return Promise.reject(error) // 进入到axios的catch
  }
)

// 用响应拦截器处理返回结果的数据  ,将多层嵌套的数据解构
instance.interceptors.response.use(
  function (response) {
    // response 被axios默认多包裹了一层
    try {
      return response.data.data
    } catch (error) {
    //    若果失败,说明response.data是undefined
      return response.data
    }
  }, async function (error) {
    // 请求失败或者其他错误会进入到响应拦截器的错误的区域
    // 只要是401 ,就是token失效  导航守卫将没有token的拦截
    /*
        config
        request
        response
    */

    if (error.response && error.response.status === 401) {
      // 如果状态码是401,就认为token失效了
      // token失效去看refresh_token是否在有效
      const path = {
        path: '/login',
        query: {
          // 需要传递的query参数
          redirectUrl: router.currentRoute.fullpath // 登录页需要跳转的地址
        }
      }
      if (store.state.user.refresh_token) {
        try {
          // 有refresh_token
        // 调用刷新token的接口  要用axios  没有拦截器的  用inatance会进入死循环
          const res = await axios({
            method: 'put',
            url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
            headers: { Authorization: `Bearer ${store.state.user.refresh_token}` }
          })
          // 执行成功的逻辑
          // 提交mutations
          store.commit('updateUser', {
            user: {
              token: res.data.data.token, // 新token
              refresh_token: store.state.user.refresh_token // 还是原来的refresh_token
            }
          })
          // 需要把错误的请求发送出去
          return instance(error.config) // 相当于执行之前出现401错误的请求,返回值的目的是继续执行请求执行链下面的内容
        } catch (error) {
        //   续命失败 重新登录去  此时两种token都失效了
          store.commit('delUser')
          router.push(path)
        }
      } else {
        // 直接跳转是不对的
        // router.push('/login')
        // A页面失效 返回登录 登录后需要返回 A页面
        // 把A页面地址传给登录页   登录页来看是否有需要跳转的地址,没有就调到主页
        // router.currentRoute 当前路由信息对象
        // 需要获取当前路由的带参数地址 router.currentRoute.fullpath

        router.push({
          path: '/login',
          query: {
            // 需要传递的query参数
            redirectUrl: router.currentRoute.fullpath // 登录页需要跳转的地址
          }
        })
      }
    }
    return Promise.reject(error)
  })

export default instance
