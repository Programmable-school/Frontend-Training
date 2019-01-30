import Vue from 'vue'
import Router from 'vue-router'
import TopPage from './views/TopPage.vue'
import FirestorePage from './views/firestore/FirestorePage.vue'
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
      path: '/firestore_page',
      name: 'firestore_page',
      component: FirestorePage,
    },
  ],
})
