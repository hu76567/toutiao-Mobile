
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
 * 不感兴趣文章接口
 */
export function dislikeArticle (data) {
  return request({
    url: '/article/dislikes',
    method: 'post',
    data: data
  })
}

/**
 * 举报文章接口
 */
export function reportArticle (data) {
  return request({
    url: '/article/reports',
    method: 'post',
    data: data
  })
}

/**
 * 联想搜索请求
 */
export function getSuggestion (params) {
  return request({
    url: '/suggestion',
    params
  })
}

/**
 * 搜索文章的方法
 */
export function searchArticle (params) {
  return request({
    url: '/search',
    params // 关键词及分页信息
  })
}

/**
 *获取文章详情的api
 */
export function getArticleInfo (artId) {
  return request({
    url: `/articles/${artId}`
  })
}

/**
 * 或去文章评论的api
 */

export function getComments (params) {
  return request({
    url: 'comments',
    params
  })
}
