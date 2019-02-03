# vue-library-training

## 目次
- [ページ遷移（VueRouter）](###ページ遷移(VueRouter))
- [状態管理（VueStore）]()
- [マテリアルデザインでトップページ作成（Vuetify）]()
- [ローカルストレージに保存（localofrage）]()
- [Qiitaのユーザーリスト表示ページ作成（axios）]()
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
$ yarn add vuetify localforage axios dotenv-webpack
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
    whiteCloud: '#F8F9FB',
    grayTheme: '#79838C',
    blueTheme: '#5982EE',
    sky: '#A2DCED',
    sea: '#698FF0',
    blackFlat: '#202223',
    twitter: '#00aced',
    facebook: '#305097',
    line: '#5ae628',
    gold: '#FFD700',
    goldenrod: '#DAA520',
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
本プロジェクトをcloneして以下のレッスンのサンプルコードを写経してください。<br>

### ページ遷移(VueRouter)
複数のページを作成してページ遷移できるようにします。<br>
src/views/vuerouter/配下に「VueRouterTopPage.vue」「VueRouterAgendaPage.vue」「VueRouterFirstPage.vue」「NotFoundPage.vue」を作成してください。<br>
作成するページのソースコードは[こちら](./src/views/vuerouter)（コピーペしてもOK）。<br>

src/router.tsでページ遷移の設定を行います。<br>
##### router.ts

```ts
import Vue from 'vue'
import Router from 'vue-router'
import TopPage from './views/TopPage.vue'
import VueRouterTopPage from '@/views/vuerouter/VueRouterTopPage.vue'
import VueRouterAgendaPage from '@/views/vuerouter/VueRouterAgendaPage.vue'
import VueRouterFirstPage from '@/views/vuerouter/VueRouterFirstPage.vue'
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
      ],
    },
    /**
     * NotFound用ページ
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
});

```

#### ページ遷移をする方法
T.B.D


### 状態管理（VueStore）
### マテリアルデザインでトップページ作成（Vuetify）
### ローカルストレージに保存（localofrage）
### Qiitaのユーザーリスト表示ページ作成（axios）
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
