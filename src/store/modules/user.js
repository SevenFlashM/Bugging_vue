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
    roles: "",
    project:"",
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PROJECT: (state, project) => {
      state.project = project
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
          //设置token保存在cookies中
          setToken(response.token)
          //执行mutations中的方法，将token保存在state中
          commit('SET_TOKEN', response.token)
          commit('SET_ROLES', response.roles)
          //resolve函数的作用是，将Promise对象的状态从“未完成”变为“成功”
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          if (response.token) {
            commit('SET_TOKEN', response.token)
            commit('SET_ROLES', response.roles)
            setToken(response.token)
          } else {
            reject('token已失效，请重新登录')
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
        logout().then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', '')
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    ResetToken({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
