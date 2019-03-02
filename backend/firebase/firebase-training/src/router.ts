import Vue from 'vue'
import Router from 'vue-router'
import TopPage from './views/TopPage.vue'
import CreateFormPage from './views/firestore/CreateFormPage.vue'
import RosterListPage from './views/firestore/RosterListPage.vue'
import UserHealthListPage from './views/firestore/UserHealthListPage.vue'
import ShopItemBuyPage from './views/firestore/ShopItemBuyPage.vue'

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
    },
    {
      path: '/user_health_list_page',
      name: 'user_health_list_page',
      component: UserHealthListPage,
    },
    {
      path: '/shop_item_buy_page',
      name: 'shop_item_buy_page',
      component: ShopItemBuyPage,
    },
  ],
})
