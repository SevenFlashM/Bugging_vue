// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // elemenet lang-en

Vue.config.productionTip = false

import store from './store'
// 全局引用axios
import axios from 'axios'
Vue.prototype.$axios = axios
import '@/permission' // permission control


Vue.use(ElementUI)
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
