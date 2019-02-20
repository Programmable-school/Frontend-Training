# vue-library-training

## 目次
- [VueRouter](#VueRouter)
- [VueStore](#VueStore)
- [Vuetify](./src/views/vuetify)
- [ローカルストレージに保存（localofrage）](./src/views/localforage/LocalForageRosterListPage.vue)
- [Qiitaのユーザーリスト表示ページ作成（axios）](./src/views/axios/AxiosLesson.vue)
- [環境変数を設定（dotenv）]()

## 環境構築
### トレーニング用Vueテンプレートを作成
```sh
$ vue create vue-library-training
```
<a href="https://imgur.com/5JOfmpS"><img src="https://i.imgur.com/5JOfmpS.png" width="30%" height="30%" /></a><br>
<br>
<br>
設定項目は以下の通りです。<br>
<a href="https://imgur.com/n6EfWaO"><img src="https://i.imgur.com/n6EfWaO.png" width="50%" height="50%" /></a>


### TSLint
tslint.jsonは以下のように設定してください。<br>
```json
{
  "defaultSeverity": "warning",
  "extends": [
    "tslint:recommended"
  ],
  "linterOptions": {
    "exclude": [
      "node_modules/**"
    ]
  },
  "rules": {
    "max-line-length": [
      false,
      120
    ],
    "member-access": false,
    "no-console": false,
    "quotemark": [true, "single"],
    "semicolon": [false, "always"],
    "indent": [true, "spaces", 2],
    "interface-name": false,
    "ordered-imports": false,
    "object-literal-sort-keys": false,
    "no-consecutive-blank-lines": false
  }
}

```
各コマンドの詳細はこちらのサイトで綺麗にまとまっています。<br>
[TSLint v5.7.0 で指定できる全 rules をまとめた](http://neos21.hatenablog.com/entry/2017/10/25/080000)<br>

### トレーニングで利用するライブラリを導入
```sh
$ yarn add vuetify localforage axios dotenv-webpack date-fns
```

#### Vuetifyを導入
index.htmlとmain.tsにVuetifyの初期化コードを追加します。

##### ./public/index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
  〜〜〜〜 省略 〜〜〜〜
    <!-- 追加 -->
    <link href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' rel="stylesheet" type="text/css">
    <link href="https://unpkg.com/vuetify/dist/vuetify.min.css" rel="stylesheet" type="text/css">
    <!--------->
    <link rel="icon" href="<%= BASE_URL %>favicon.ico">
    <title>firebase-training</title>
  </head>
  〜〜〜〜 省略 〜〜〜〜
</html>
```

##### ./src/main.ts

```ts
import Vuetify from 'vuetify'
import colors from 'vuetify/es5/util/colors'

// themeはお好みでどうぞ。
Vue.use(Vuetify, {
  theme: {
    original: colors.purple.base,
    theme: '#5982EE',
    background: '#ffffff',
    twitter: '#00aced',
    facebook: '#305097',
    line: '#5ae628',
    red: '#F26964',
    error: '#F26964',
    succcess: '#698FF0',
  },
  options: {
    themeVariations: ['original', 'secondary'],
  },
})
```

## レッスン
以下の解説を元に概要を理解し、本プロジェクトをcloneして以下のレッスンのサンプルコードを写経してください。<br>

### VueRouter
複数のページを作成してページ遷移できるようにします。<br>
src/views/vuerouter/配下に「VueRouterTopPage.vue」「VueRouterAgendaPage.vue」「VueRouterFirstPage.vue」「NotFoundPage.vue」を作成してください。<br>
<br>
作成するページは[こちら](./src/views/vuerouter)。<br>
##### ./src/router.ts

```ts
import Vue from 'vue'
import Router from 'vue-router'
import TopPage from './views/TopPage.vue'
import VueRouterTopPage from '@/views/vuerouter/VueRouterTopPage.vue'
import VueRouterAgendaPage from '@/views/vuerouter/VueRouterAgendaPage.vue'
import VueRouterFirstPage from '@/views/vuerouter/VueRouterFirstPage.vue'
import VueRouterSecondPage from '@/views/vuerouter/VueRouterSecondPage.vue'
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
```

#### ページ遷移をする方法
router-link を用いてページ遷移をします。<br>

```html
<router-link to="vue_router_top_page/vue_router_first_page">
  <div>ページ</div>
</router-link>
```

<br>
ページ遷移時のデータの受け渡しはscript構文から$router/$routeを用います。<br>

##### データの渡し方

```ts
onClickSecond(pageId: string) {
  this.$router.push({ name: 'vue_router_second_page', params: { id: pageId } })
}
```

##### データの受取り方

```ts
id: string = '0'
created() {
  this.id = this.$route.params.id
}
```

router.tsで:idを指定するとURLにidを指定できます。URLのidを変更すると連動するパラメータに反映されます。<br>

```ts
{
  path: 'vue_router_second_page/:id',
  name: 'vue_router_second_page',
  component: VueRouterSecondPage,
},
```

### VueStore
アプリ全体の状態を管理する場合はstoreを利用します。<br>
ローディング状態や実行メッセージ等を管理すれば、アプリ全体で利用することができます。<br>

##### ./src/store.ts

```ts
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
/**
 * storeでアプリ全体の状態管理を行う。
 * 定義されたデータはアプリが消えるまで保持する（シングルトンのようなもの）
 */
export default new Vuex.Store({
  /**
   * stateで管理するデータを定義
   */
  state: {
    title: 'VueStoreTopPage',
    isLoading: false,
    successMessages: [] as string[],
    errorMessages: [] as string[],
  },
  /**
   * getters内でstateのデータを取得できるようにする。
   */
  getters: {
    title: (state) => state.title,
    isLoading: (state) => state.isLoading,
    successMessages: (state) => state.successMessages,
    errorMessages: (state) => state.errorMessages,
  },
  /**
   * mutationsで実行処理を行う。データの変更を行う。
   */
  mutations: {
    setTitle(state, title) {
      document.title = title
      state.title = title
    },
    startLoading(state) {
      state.isLoading = true
    },
    stopLoading(state) {
      state.isLoading = false
    },
    success(state, message) {
      if (!Array.isArray(message)) {
        state.successMessages = [message]
        return
      }
      state.successMessages = message
    },
    error(state, message) {
      if (!Array.isArray(message)) {
        state.errorMessages = [message]
        return
      }
      state.errorMessages = message
    },
  },
  /**
   * actionsでmutationsをラップして実行。
   */
  actions: {
    doTitle({ commit }, value: string) {
      commit('setTitle', value)
    },
    doLoading({ commit }, value: boolean) {
      if (value === true) {
        commit('startLoading')
      } else {
        commit('stopLoading')
      }
    },
    doSuccessMessages({ commit }, value: string) {
      commit('success', value)
    },
    doErrorMessages({ commit }, value: string) {
      commit('error', value)
    },
  },
})
```
これらの使い方は[こちら](./src/views/vuestore/VueStoreTopPage.vue)を確認してください。<br>

### マテリアルデザインでトップページ作成（Vuetify）
### ローカルストレージに保存（localofrage）


### Qiitaのユーザーリスト表示ページ作成（axios）
<a href="https://imgur.com/9m0y2hK"><img src="https://imgur.com/9m0y2hK" width="30%" height="30%" /></a><br>
<br>
<a href="https://imgur.com/VkBhEDx"><img src="https://imgur.com/VkBhEDx" width="30%" height="30%" /></a><br>
<br>



### 環境変数を設定（dotenv）
<br>

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Run your tests
```
yarn run test
```

### Lints and fixes files
```
yarn run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
