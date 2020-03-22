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

export function getmyChannels () {
  // return request({
  //   url: '/user/channels'
  // })
  return new Promise(function (resolve, reject) {
    // 接口有问题  将线上频道本地化
    // 根据token判断游客还是登陆
    const key = store.state.user.token ? CACHE_CHANNEL_V : CACHE_CHANNEL_T
    //  通过item获取缓存的频道数据
    const str = localStorage.getItem(key)
    if (str) {
      // 本地缓存有数据,直接释放
      // 结构和请求体中的结构是一致的
      // 请求本地数据,就不会去发接口请求了
      resolve({ channels: JSON.parse(str) })
    } else {
      // 没有数据就线上拉取频道数据设置token
      request({ url: '/user/channels' }).then(res => {
      // 获取请求的结果
      // 放入缓存
        localStorage.setItem(key, JSON.stringify(res.channels))
        // 表示成功执行了获取频道数据,释放的就是getchannels中的res
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
 * 频道删除功能
 *  需要id
 */
export function delChannel (id) {
  return new Promise(function (resolve, reject) {
    // 有id从缓存中删除对应数据
    // 根据token来判断是登录还是游客
    const key = store.state.user.token ? CACHE_CHANNEL_V : CACHE_CHANNEL_T
    // 将本地缓存中的字符串转化成对象
    // 第一种
    // let channels = JSON.parse(localStorage.getItem(key))
    // // 利用filter删除
    // channels = channels.filter(item => item.id !== id)
    // // 重新写入缓存
    // localStorage.setItem(key, JSON.stringify(channels))

    // 第二种
    const channels = JSON.parse(localStorage.getItem(key))
    const index = channels.findIndex(item => item.id === id)
    if (index > -1) {
      channels.splice(index, 1)
      localStorage.setItem(key, JSON.stringify(channels))
      // 执行成功直接resolve
      resolve({ message: '删除成功' })
    } else {
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
