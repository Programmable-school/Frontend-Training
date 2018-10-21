# Vue.jsの基礎

> Vue CLIを使ってVue.jsの基本的な構文を理解します。

Vue.jsの基礎とよく使う構文を学習します。<br>
その他は[公式リファレンス](https://jp.vuejs.org/v2/guide/)や[APIリファレンス](https://jp.vuejs.org/v2/api/)を確認してください。<br>

# Vue CLIの導入
Vueのテンプレートを用いて学習します。<br>
テンプレートを容易に構築できるVue CLIを使います。

```bash
# Vue CLI 3.0をインストール
$ npm install -g @vue/cli

# パーミッションで怒られたらsudoをつけてインストールしてください
$ sudo npm install -g @vue/cli

# Vue CLIのバージョン確認し、インストールしたことを確認
$ vue --version
```
## テンプレートを作成
Vue CLIを使ってテンプレートを作成します。

```bash
# テンプレートを作成
$ vue create frontendkadai2

Vue CLI v3.0.1
? Please pick a preset: default (babel, eslint)
```

localhostを起動して画面を確認します。
```bash
$ yarn serve
```

[http://localhost:8080](http://localhost:8080) をブラウザで確認し、以下のような画面が確認できればOKです。<br>
<a href="https://imgur.com/S55Q23B"><img src="https://i.imgur.com/S55Q23B.png" width="300" height="300" /></a>

# 基礎
## データバインディング
データバインディングはHTML上で {{}} を使います。<br>
変数をバインディングをすると変数が更新されると動的にHTMLに反映されます。<br>
```html
<div>私は{{ name }}です<div>
```
```js
export default {
  name: 'app',
  data() {
    return {
      name: 'shohei'
    }
  }
}
```

変数の更新を反映させたくない場合はv-onceを使います。
```html
<div v-once>私は{{ name }}です<div>
```
## HTMLを挿入
変数をHTMLとして扱いたい場合はv-htmlを使います。
```html
<div v-html="htmlData"/>
```
```js
export default {
  name: 'app',
  data() {
    return {
      htmlData: '<p>私の名前はshoheiです</p>'
    }
  }
}
```
## 属性
属性はv-bindまたは:を使います。<br>
以下の例はボタンの押下許可の設定を行います。<br>
```html
<button v-bind:disabled="isEnable">ボタン</button>
```
```js
export default {
  name: 'app',
  data() {
    return {
      isEnable: false
    }
  }
}
```

## ディレクティブ
v-から始まる構文をディレクティブと言います。<br>
```html
<div v-if="isShow">見えていますか</div>
<span v-for="(item, index) in items" :key="index">{{ item }}</span>
```
```js
export default {
  name: 'app',
  data() {
    return {
      isShow: true,
      items: ["こ", "ん", "に", "ち", "わ"]
    }
  }
}

# 課題
## 課題1

## 課題2