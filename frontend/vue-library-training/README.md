# vue-library-training

## 目次
- [VueRouter](#VueRouter)
- [Vuex](#Vuex)
- [Vuetify](#Vuetify)
- [ローカルストレージに保存（localforage）](#localforage)
- [Qiitaリスト表示ページ作成（axios）](#axios)
- [環境変数を設定（dotenv）](#dotenv)

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

## VueRouter
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

## Vuex
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

## Vuetify
### スクリーンショット
<a href="https://imgur.com/JoxKnh4"><img src="https://i.imgur.com/JoxKnh4.png" width="50%" height="30%" /></a><br>
<br>
<a href="https://imgur.com/MOuDdlp"><img src="https://i.imgur.com/MOuDdlp.png" width="40%" height="30%" /></a><br>
<br>
<a href="https://imgur.com/LMIu2fr"><img src="https://i.imgur.com/LMIu2fr.png" width="50%" height="30%" /></a><br>
<br>
<a href="https://imgur.com/HdNhZM2"><img src="https://i.imgur.com/HdNhZM2.png" width="50%" height="30%" /></a><br>
<br>
<a href="https://imgur.com/cjsYoo7"><img src="https://i.imgur.com/cjsYoo7.png" width="50%" height="30%" /></a><br>
<br>

[こちらのコード](./src/views/vuetify)を写経してページを作成してください。

## localforage
### スクリーンショット
<a href="https://imgur.com/jwlcDnl"><img src="https://i.imgur.com/jwlcDnl.png" width="50%" height="30%" /></a><br>
<br>

[こちらのコード](./src/views/localforage/LocalForageRosterListPage.vue)を写経してページを作成してください。


## axios
### スクリーンショット
<a href="https://imgur.com/9m0y2hK"><img src="https://i.imgur.com/9m0y2hK.png" width="40%" height="30%" /></a><br>
<br>
<a href="https://imgur.com/VkBhEDx"><img src="https://i.imgur.com/VkBhEDx.png" width="40%" height="30%" /></a><br>
<br>

### 構築
axiosを用いて外部APIから取得したデータを画面上に表示します。本レッスンではQiita APIを用いて行います。<br>
axiosを初期化する際に既にAPIが決まっている場合はbaseURLに設定します。<br>
```ts
import axios from 'axios'

@Component
export default class AxiosLesson extends Vue {
  /**
   * axiosを初期化する
   * 予めリクエストを送るAPIをbaseURLとして設定することができる
   */
  axios = axios.create({
    headers: { 'Content-Type': 'application/json' },
    baseURL: 'https://qiita.com/api/v2',
  })
}
```

レッスンではユーザー情報と記事のリストを取得して画面上に表示します。
```ts
// ユーザー情報を取得
try {
  const result = await this.axios.get('/users')
  console.log('result', result.data)
} catch (error) {
  console.error(error)
}
  
```

```ts
// 記事を取得
try {
  const searchText: string = 'NEM' // 検索したいキーワード
  const params: any = {
    query: searchText,
  }
  const result = await this.axios.get('/items', { params })
  console.log('result', result.data)
} catch (error) {
  console.error(error)
}
```
API仕様は[QiitaAPIリファレンス](https://qiita.com/api/v2/docs)を参考にしてください。<br>
<br>
[こちらのコード](./src/views/axios/AxiosLesson.vue)を写経してページを作成してください。

## dotenv
### スクリーンショット
<a href="https://imgur.com/wOGlXxE"><img src="https://i.imgur.com/wOGlXxE.png" width="40%" height="30%" /></a><br>
<br>

### 構築
dotenv-webpackをインストール後、vue.config.jsをルート上に作成して以下のように設定します。

##### /vue.config.js
```js
const Dotenv = require('dotenv-webpack')
module.exports = {
  configureWebpack: {
    plugins: [new Dotenv()]
  }
}
```
<br>
これで導入完了です。<br>
ルート上に.envファイルを作成して環境変数を設定します。<br>

##### /.env
```sh
# 環境変数として設定したい変数はここで定義する
# 
# 【環境変数にするポイント】
# アプリの設定値でアプリ全体で利用することがあるAPIやKeyを設定する
#
# 【注意】
# APIのSecretKeyはフロントエンド側のdotenvで定義しないこと。
# ここで設定される変数は全てユーザーに見られてしまうため、見られても良いものを定義すること。
APP_TITLE = "DotenvLesson"
APP_VERSION = "1.0.0"
ADMIN_EMAIL = "xxxx@xxxx.com"
BASE_API_URL = "https://qiita.com/api/v2"
```
<br>
以下のような使い方で定義した環境変数を利用できます。

```ts
const title: string = process.env.APP_TITLE
const version: string = process.env.APP_VERSION
const email: string = process.env.ADMIN_EMAIL
const baseUrl: string = process.env.BASE_API_URL
```

注意として、フロントエンド側で定義するとユーザーに見られてしまうため、見られてまずいものはフロントエンド側で定義しないようにしてください。<br>
<br>
お作法としてはセキュリティ上.envファイルはGit上に上げないようにします。<br>
.gitignoreに.envを追加します。<br>

##### /.gitignore
```sh
# local env files
.env
.env.local
.env.*.local
```

[こちらのコード](./src/views/dotenv/DotenvLesson.vue)を写経してページを作成してください。

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
