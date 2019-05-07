//判断用户名方式
export function isvalidUsername(str) {
  const valid_map = ['admin']
  return valid_map.indexOf(str.trim()) >= 0
}

export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}
