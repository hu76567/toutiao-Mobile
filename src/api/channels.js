/**
*负责处理频道数据
* **/

import request from '@/utils/request'
export function getmyChannels () {
  return request({
    url: '/user/channels'
  })
}
