# firebase-training

## 公式ページ
[https://firebase.google.com/docs/firestore/quickstart?hl=ja](https://firebase.google.com/docs/firestore/quickstart?hl=ja)

## 手順
### トレーニングで利用するライブラリを導入
```sh
# Firebaes
$ yarn add firebase vuetify axios
```

### Firebaseの設定
firebaseConfigSample.tsをfirebaseConfig.tsにリネームして、作成したFirebaseプロジェクトの設定値を追加します。<br>
プロジェクトの設定値はFirebaseコンソールから確認できます。<br>

設定後、main.tsにFirebaseの初期化コードを追加します。
```ts
import { firebaseConfig } from '@/repository/firebaseConfig'
import firebase from 'firebase/app'
import 'firebase/firestore'

firebase.initializeApp(firebaseConfig)
firebase.firestore.FieldValue.serverTimestamp()
```

### Vuetifyの設定
index.htmlとmain.tsにVuetifyの初期化コードを追加します。
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

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```
