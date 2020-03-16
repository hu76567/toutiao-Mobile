/*
请求管理工具
*/
import axios from 'axios'
import jsonbig from 'json-bigint'
import store from '@/store' // 引入vuex中的store
// axios.defaults是对原有默认值进行修改
// axios.create相当于new了一个新的实例

// 创建一个新的实例 instance有axios的所有方法
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
  })

// 用响应来节气处理返回结果的数据  ,将多嵌套的数据解构
instance.interceptors.response.use(
  function (response) {
    // response 被axios默认多包裹了一层
    try {
      return response.data.data
    } catch (error) {
    //    若果失败,说明response.data是undefined
      return response.data
    }
  }, function (error) {
    return Promise.reject(error)
  })

export default instance
