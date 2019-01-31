import Vue from 'vue'
import Router from 'vue-router'
import TopPage from './views/TopPage.vue'
import CreateFormPage from './views/firestore/CreateFormPage.vue'
import RosterListPage from './views/firestore/RosterListPage.vue'
Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'top_page',
      component: TopPage,
    },
    {
      path: '/create_form_page',
      name: 'create_form_page',
      component: CreateFormPage,
    },
    {
      path: '/roster_list_page',
      name: 'roster_list_page',
      component: RosterListPage,
    }
  ],
})
