import { login, logout, getInfo } from '@/api/login'
//在cookies中操作
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    // id:'',
    // username: '',
    // password:'',
    // avatar: '',
    roles: [],
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 登录
    //模块内部的actions方法参数为{ state, commit, rootState }=context,这里由于ES6参数解构，是简写
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      //Promise，简单说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果
      return new Promise((resolve, reject) => {
        //通过login，api发送请求到后端
        login(username, userInfo.password).then(response => {
          //获取到后端的数据以及生成的token
          const data = response.data
          //设置token保存在cookies中
          setToken(data.token)
          //执行mutations中的方法，将token保存在state中
          commit('SET_TOKEN', data.token)
          //resolve函数的作用是，将Promise对象的状态从“未完成”变为“成功”
          resolve()
        }).catch(error => {
          reject(error)
          console.log(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const data = response.data
          if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data.roles)
          } else {
            reject('getInfo: roles must be a non-null array !')
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
