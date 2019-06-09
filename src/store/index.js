import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import project from './modules/project'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,
    project
  },
  getters
})

export default store
