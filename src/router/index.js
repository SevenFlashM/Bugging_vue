import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import Dashboard from '@/components/Dashboard'
import Overview from '@/components/Overview'
import Problem from '@/components/Problem'
import Statistics from '@/components/Statistics'
import BasicTable from '@/components/BasicTable'
import Project from '@/components/Project'
import CreateTable from '@/components/Table/CreateTB'
import DistrTable from '@/components/Table/DistrTB'
import MineTable from '@/components/Table/MineTB'
import ToSolveTable from '@/components/Table/ToSolveTB'
import UnSolveTable from '@/components/Table/UnSolveTB'




Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/Login',
      component: Login,
    }, 

    {
      path: '/',
      redirect: '/Dashboard',
      component: Dashboard,
      meta: {
        // 添加该字段，表示进入这个路由是需要登录的
        requireAuth: true,
      },
      children: [
        {
          path: 'Dashboard',
          redirect: '/Overview',
        },
        {
          path: '/Overview',
          name: 'Overview',
          component: Overview,
        },
        {
          path: '/Problem',
          name: 'Problem',
          component: Problem,
          children: [
            {
              path: '/Problem',
              redirect: '/Problem/All'
            },
            {
              path: 'All',
              name: 'All',
              component: BasicTable,
            },
            {
              path: 'Handling',
              name: 'Handling',
              component: BasicTable,
            },
            {
              path: 'BelongToMe',
              name: 'BelongToMe',
              component: BasicTable,
            },
            {
              path: 'Create',
              name: 'Create',
              component: BasicTable,
            },
            {
              path: 'Trace',
              name: 'Trace',
              component: BasicTable,
            },
            {
              path: 'UnClose',
              name: 'UnClose',
              component: BasicTable,
            },
          ]
        },
        {
          path: '/Statistics',
          name: 'Statistics',
          component: Statistics
        },
        {
          path: '/Project',
          name: 'Project',
          component: Project
        }
      ]
    },
  ],
})
