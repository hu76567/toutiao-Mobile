/**
*负责处理频道数据
* **/

import request from '@/utils/request'
export function getmyChannels () {
  return request({
    url: '/user/channels'
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
