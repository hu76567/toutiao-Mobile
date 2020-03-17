/*
请求管理工具
*/
import axios from 'axios' // 引入axios
import jsonbig from 'json-bigint' // 引入大数字插件
import store from '@/store' // 引入vuex中的store实例对象
import router from '@/router' // 引用router对象
// axios.defaults是对原有默认值进行修改
// axios.create相当于new了一个新的实例

// 创建一个新的实例 instance有axios的所有方法,这里只设置两个
// 设置基地址和处理大数字的问题
const instance = axios.create({
  // 构造参数 传入一些配置 和defaults一样
  baseURL: 'http://ttapi.research.itcast.cn/app/v1_0', // 基地址
  //    在后台响应回来但是没有进入到响应拦截器时执行,数组里可以写多个处理函数
  transformResponse: [function (data) {
    //  data就是后端响应回来的字符串
    return data ? jsonbig.parse(data) : {}
  }]
})
// *****************请求拦截器**********************
// 请求之前注入token
// inatance 是一个新的axioss实例
instance.interceptors.request.use(
  function (config) {
    // 读取配置信息 给配置信息注入token
    if (store.state.user.token) {
      config.headers.Authorization = `Bearer ${store.state.user.token}`
    }
    // 不用 if else的用法
    // config.headers.Authorization && (config.headers.Authorization = `Bearer ${store.state.user.token}`)
    return config // 返回配置
  }, function (error) {
    return Promise.reject(error) // 返回错误 直接进入到axios的catch
  }
)

// *****************响应拦截器********************
// 用响应拦截器处理返回结果的数据  ,将多层嵌套的数据解构
instance.interceptors.response.use(
  function (response) {
    // response 被axios默认多包裹了一层
    try {
      return response.data.data // 如果成功则返回  如果两层可以解开 就返回两层
    } catch (error) {
    //    若果失败,说明response.data是不存在 如果两层解不开 就返回一层
      return response.data
    }
  }, async function (error) {
    // 请求失败或者其他错误会进入到响应拦截器的错误的区域
    // 只要是401 ,就是token失效  导航守卫将没有token的拦截
    /*
        config  //出现这次错误请求的配置信息
        request  //请求对象
        response //响应对象  status状态码
    */

    if (error.response && error.response.status === 401) {
      // 如果状态码是401,就认为token失效了
      // token失效去看refresh_token是否在有效
      const path = {
        path: '/login',
        query: {
          // 需要传递的query参数
          redirectUrl: router.currentRoute.fullPath // 登录页需要跳转的地址
        }
      }

      // 如果状态码是401的话  就认为token失效了 就需要处理token失效问题
      if (store.state.user.refresh_token) {
        try {
        // 有refresh_token  可以给token续命
          // 调用刷新token的接口  必须要用axios
          // 用inatance还是会去将 失效的token注入到 headers中
          // 需要用没有拦截器的axios 来发 刷新token的请求
          const res = await axios({
            method: 'put',
            url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
            headers: { Authorization: `Bearer ${store.state.user.refresh_token}` }
          })
          // 用async/await异步替换了axios  下面代码相当于执行axios请求成功then中的逻辑
          // 提交mutations  更新token
          store.commit('updateUser', {
            user: {
              token: res.data.data.token, // 新token
              refresh_token: store.state.user.refresh_token // 还是原来的refresh_token
            }
          })
          // 尽管你更新了token,但是更新的起因是是401了
          // 需要把错误的请求发送出去
          // 相当于执行之前出现401错误的请求
          // 返回值的目的是继续执行请求执行链下面的内容
          return instance(error.config)
        } catch (error) {
          // 续命失败
          // 此时token和refresh_token都失效了
          // 需要去重新登录  重新登录之前 需要删除掉 token
          store.commit('delUser')
          router.push(path)
        }
      } else {
        //  如果没有refresh_token 直接宣布over 直接跳到登录页面
        // router.push('/login')  直接跳转是不对的,需要更复杂的情景
        // A页面发请求 结果token失效了而且也没有refresh_token,
        // 只能回到login,你登录之后, 希望继续回到A页面
        // 把A页面地址传给登录页   登录成功后看是否有需要跳转的地址,有就跳之前的页面,没有就跳到主页
        // router.currentRoute 当前路由信息对象
        // 需要获取当前路由的带参数地址 router.currentRoute.fullpath(文档)
        store.commit('delUser') // 也要删除token  因为token失效了
        router.push(path)
      }
    }
    // 业务执行错误,直接返回失败
    return Promise.reject(error)
  })

export default instance
