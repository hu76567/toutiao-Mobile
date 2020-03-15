//  专门处理token的读写
const USER_TOKEN = 'toutiao-mobile'
// 获取
export function setUser (user) {
  // user参数信息是一个对象
  window.localStorage.setItem(USER_TOKEN, JSON.stringify(user)) // 需要转换成字符串
}
// 设置
export function getUser () {
  // 转化成对象
  return JSON.parse(window.localStorage.getItem(USER_TOKEN) || '{}')
  // 短路表达式  前边true后面不执行  前边为false 后面执行
}
// 删除
export function delUser () {
  localStorage.removeItem(USER_TOKEN)
}
