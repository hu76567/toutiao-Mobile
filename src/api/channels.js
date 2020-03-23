/**
*负责处理频道数据
* **/

/**
 * 改为本地化,将频道存成本地化
 */
import request from '@/utils/request'
import store from '@/store'

const CACHE_CHANNEL_V = 'toutiao-v' // 登陆用户的key
const CACHE_CHANNEL_T = 'toutiao-t' // 游客的key

// 处理获取频道
export function getmyChannels () {
  // return request({
  //   url: '/user/channels'
  // })
  // 我们要对原来的方法 进行改造 但是不想 改造调用的方式
  // 支持本地化缓存  要区分当前是登录用户还是游客用户
  // 如何区分登录还是游客  可以根据当前有没有token 来判断 是否是登录
  return new Promise(function (resolve, reject) {
    // 根据user_token判断分发游客令牌还是用户令牌
    const key = store.state.user.token ? CACHE_CHANNEL_V : CACHE_CHANNEL_T
    // 通过key获取频道数据
    const str = localStorage.getItem(key)
    if (str) {
      // 本地缓存有数据,直接释放
      // 结构和请求体中的结构是一致的
      // 字符串转对象 返回给getChannels ==>res
      resolve({ channels: JSON.parse(str) })
    } else {
      // 没有数据就发请求拉取频道数据设置token
      request({ url: '/user/channels' }).then(res => {
      //  放入本地放入缓存
        localStorage.setItem(key, JSON.stringify(res.channels))
        // 将请求回来的数据返回给getchannels中的res
        resolve(res)
      })
    }
  })
}

/**
 *获取所有频道
 */
export function getAllChannels () {
  return request({
    url: '/channels'
  })
}

/**
 * 频道删除功能  id
 */
export function delChannel (id) {
  return new Promise(function (resolve, reject) {
    // 根据是否有user_token来判断是登录还是游客
    // 登录用户一个channels 游客一个channels
    const key = store.state.user.token ? CACHE_CHANNEL_V : CACHE_CHANNEL_T
    /**
     * 第一种
     * channels存的时候是数组
     * let channels = JSON.parse(localStorage.getItem(key))
     * 利用filter删除 直接返回一个新数组
     * channels = channels.filter(item => item.id !== id)
     * 重新写入缓存
     * localStorage.setItem(key, JSON.stringify(channels))
     */

    // 第二种
    const channels = JSON.parse(localStorage.getItem(key))
    // 比较参数id 与 channelsid,并返回相同项的索引
    const index = channels.findIndex(item => item.id === id)
    if (index > -1) {
      channels.splice(index, 1)
      localStorage.setItem(key, JSON.stringify(channels))
      // 执行成功直接resolve
      resolve()
    } else {
      // 实例化一个错误
      reject(new Error('没有找到对应的频道'))
    }
  })
}

/**
 * 频道添加功能
 * @params channel 是{id:,name:}
 */
export function addChannel (channel) {
  return new Promise(function (resolve, reject) {
    const key = store.state.user.token ? CACHE_CHANNEL_V : CACHE_CHANNEL_T
    const channels = JSON.parse(localStorage.getItem(key)) // 得到缓存中数据
    channels.push(channel)
    localStorage.setItem(key, JSON.stringify(channels))
    resolve() // 执行成功,才会执行promis后面的内容
  })
}
