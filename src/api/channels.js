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
