import { getProjectIDByName } from '@/api/project'

const project = {
  state: {
    projectID: "",
  },

  mutations: {
    SET_PROJECT: (state, projectID) => {
      state.projectID = projectID
    }
  },

  actions: {
    //Vuex store中actions执行Mutation中的方法
    GetProjectID({ commit }, projectName) {
      return new Promise((resolve, reject) => {
        //通过project->api发送请求到后端获取项目ID
        getProjectIDByName(projectName).then(response => {
          //执行mutations中的方法，将projectID保存在state中
          commit('SET_PROJECT', response.data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
  }
}

export default project
