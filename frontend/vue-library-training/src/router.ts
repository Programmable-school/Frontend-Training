import Vue from 'vue'
import Router from 'vue-router'
import TopPage from './views/TopPage.vue'
import VueRouterTopPage from '@/views/vuerouter/VueRouterTopPage.vue'
import VueRouterAgendaPage from '@/views/vuerouter/VueRouterAgendaPage.vue'
import VueRouterFirstPage from '@/views/vuerouter/VueRouterFirstPage.vue'
import VueRouterSecondPage from '@/views/vuerouter/VueRouterSecondPage.vue'
import VueStoreTopPage from '@/views/vuestore/VueStoreTopPage.vue'
import VuetifyTopPage from '@/views/vuetify/VuetifyTopPage.vue'
import VuetifyChildPage1 from '@/views/vuetify/VuetifyChildPage1.vue'
import VuetifyChildPage2 from '@/views/vuetify/VuetifyChildPage2.vue'
import VuetifyChildPage3 from '@/views/vuetify/VuetifyChildPage3.vue'
import LocalForageRosterListPage from '@/views/localforage/LocalForageRosterListPage.vue'
import AxiosLesson from '@/views/axios/AxiosLesson.vue'
import DotenvLesson from '@/views/dotenv/DotenvLesson.vue'
import NotFoundPage from '@/views/vuerouter/NotFoundPage.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    /**
     * Topページ
     */
    {
      path: '/',
      component: TopPage,
    },
    /**
     * VueRouterトレーニング用ページ
     * VueRouterTopPage.vueをrouter-viewでエントリーポイントのページとして設定し、
     * その配下にそれぞれのページを設定する。
     * childrenに設定されたページのURLは http:localhost:8080/vue_router_top_page/ から始まる。
     */
    {
      path: '/vue_router_top_page',
      name: 'vue_router_top_page',
      component: VueRouterTopPage,
      children: [
        {
          path: '/',
          name: 'vue_router_agenda_page',
          component: VueRouterAgendaPage,
        },
        {
          path: 'vue_router_first_page',
          name: 'vue_router_first_page',
          component: VueRouterFirstPage,
        },
        /**
         * pathに:idを指定するとURLにidが表示される。
         */
        {
          path: 'vue_router_second_page/:id',
          name: 'vue_router_second_page',
          component: VueRouterSecondPage,
        },
      ],
    },
    {
      path: '/vue_store_top_page',
      name: 'vue_store_top_page',
      component: VueStoreTopPage,
    },
    {
      path: '/vuetify_top_page',
      name: 'vuetify_top_page',
      component: VuetifyTopPage,
      children: [
        {
          path: '/',
          name: 'vuetify_child_page_1',
          component: VuetifyChildPage1,
        },
        {
          path: 'vuetify_child_page_2',
          name: 'vuetify_child_page_2',
          component: VuetifyChildPage2,
        },
        {
          path: 'vuetify_child_page_3',
          name: 'vuetify_child_page_3',
          component: VuetifyChildPage3,
        },
      ],
    },
    {
      path: '/local_forage_roster_list_page',
      name: 'local_forage_roster_list_page',
      component: LocalForageRosterListPage,
    },
    {
      path: '/axios_lesson',
      name: 'axios_lesson',
      component: AxiosLesson,
    },
    {
      path: '/dotenv_lesson',
      name: 'dotenv_lesson',
      component: DotenvLesson,
    },
    /**
     * NotFoundページ
     */
    {
      path: 'not_found_page',
      name: 'not_found_page',
      component: NotFoundPage,
    },
    /**
     * 該当しないパスは全てnot_found_pageにリダイレクトする。
     */
    {
      path: '*',
      redirect: { name: 'not_found_page' },
    },
  ],
})
