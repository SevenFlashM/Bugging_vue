import Cookies from 'js-cookie'

//这里的tokenkey是指cookies中的key
const TokenKey = 'Bugging_Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
