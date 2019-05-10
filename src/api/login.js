import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/users/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getInfo() {
  return request({
    url: '/users/info',
    method: 'post',
    //`params` 是即将与请求一起发送的 URL 参数
    // params: { token }
  })
}

export function logout() {
  return request({
    url: '/users/logout',
    method: 'post'
  })
}
