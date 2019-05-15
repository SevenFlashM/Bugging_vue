import axios from 'axios'
import qs from 'qs'
import { Message, MessageBox } from 'element-ui'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 5000 // 请求超时时间

})

// request拦截器
service.interceptors.request.use(
  function (config) {
    //如果为post请求，那么就对数据进行格式化，如果不格式化，数据是以一个对象的形式来进行传递。
    if(config.method==='post')
    {
        config.data = qs.stringify(config.data);
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// // response 拦截器
// service.interceptors.response.use(
//   response => {
//     /**
//      * code为非200是抛错
//      */
//     const res = response.data
//     if (res.code !== 200) {
//       Message({
//         message: res.message,
//         type: 'error',
//         duration: 2 * 1000
//       })

//       // 102:非法的token; 104:其他客户端登录了;  100:Token 过期了;
//       if (res.code === 104 || res.code === 102 || res.code === 100) {
//         MessageBox.confirm(
//           '你已被登出，可以取消继续留在该页面，或者重新登录',
//           '确定登出',
//           {
//             confirmButtonText: '重新登录',
//             cancelButtonText: '取消',
//             type: 'warning'
//           }
//         ).then(() => {
//           store.dispatch('ResetToken').then(() => {
//             location.reload() // 为了重新实例化vue-router对象 避免bug
//           })
//         })
//       }
//       return Promise.reject('error')
//     } else {
//       return response.data
//     }
//   },
//   error => {
//     console.log('err' + error) // for debug
//     Message({
//       message: error.message,
//       type: 'error',
//       duration: 2 * 1000
//     })
//     return Promise.reject(error)
//   }
// )

export default service
