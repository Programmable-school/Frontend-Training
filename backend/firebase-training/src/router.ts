import Vue from 'vue'
import Router from 'vue-router'
import TopPage from './views/TopPage.vue'
import CreateFormPage from './views/firestore/CreateFormPage.vue'
import RosterListPage from './views/firestore/RosterListPage.vue'
import UserHealthListPage from './views/firestore/UserHealthListPage.vue'
import ShopItemBuyPage from './views/firestore/ShopItemBuyPage.vue'
import ShopItemBuyPageOriginalModel from './views/firestore/ShopItemBuyPageOriginalModel.vue'
import AnonymouslyPage from './views/authentication/AnonymouslyPage.vue'
import SignInFinishPage from './views/authentication/SignInFinishPage.vue'
import EmailAuthPage from './views/authentication/EmailAuthPage.vue'
import EmailAuthWithCreateUserPage from './views/authentication/EmailAuthWithCreateUserPage.vue'
import SecurityRuleLessonPage from './views/authentication/SecurityRuleLessonPage.vue'

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
    {
      path: '/shop_item_buy_page_original_model',
      name: 'shop_item_buy_page_original_model',
      component: ShopItemBuyPageOriginalModel,
    },
    {
      path: '/anonymously_page',
      name: 'anonymously_page',
      component: AnonymouslyPage,
    },
    {
      path: '/sign_in_finish_page',
      name: 'sign_in_finish_page',
      component: SignInFinishPage,
    },
    {
      path: '/email_auth_page',
      name: 'email_auth_page',
      component: EmailAuthPage,
    },
    {
      path: '/email_auth_with_create_user_page',
      name: 'email_auth_with_create_user_page',
      component: EmailAuthWithCreateUserPage,
    },
    {
      path: '/security_rule_lesson_page',
      name: 'security_rule_lesson_page',
      component: SecurityRuleLessonPage,
    },
  ],
})
