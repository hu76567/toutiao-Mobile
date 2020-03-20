
import request from '@/utils/request'

// 处理文章模块请求数据
export function getArticles (params) {
  return request({
    //   设置完整地址
    //   获取文章列表数据
    url: 'http://ttapi.research.itcast.cn/app/v1_1/articles',
    params: { with_top: 1, ...params }
  })
}

/**
 * 不感兴趣的文章接口
 */
export function dislike (data) {
  return request({
    url: '/article/dislikes',
    method: 'post',
    data: data
  })
}
