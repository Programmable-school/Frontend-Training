# firebase-training

## 目次

### Firebase Authantication 
- [匿名認証](#Lesson6)
- [メール認証](#Lesson7)
- [認証情報を利用してFirestoreへユーザーデータを保存](#Lesson8)
- [Firestoreセキュリティルールを利用](#Lesson9)
- [SNS認証](#Lesson10)

### 課題
- [掲示板を作ろう](#掲示板を作ろう)
- [チャットアプリを作ろう](#チャットアプリを作ろう)

## Firebase公式ページ
[https://firebase.google.com/docs/web/setup?hl=ja](https://firebase.google.com/docs/web/setup?hl=ja)

- [Firebase Authantication](https://firebase.google.com/docs/auth/?hl=ja)

## レッスン
本プロジェクトをcloneして以下のレッスンのサンプルコードを写経してください。

## Lesson6
### 匿名認証
#### 匿名認証を許可する
Firebaseコンソールで認証設定より匿名認証を許可してください。

<a href="https://imgur.com/NpxKdkj"><img src="https://i.imgur.com/NpxKdkj.png" width="65%" height="65%" /></a>


<a href="https://imgur.com/x6c01dN"><img src="https://i.imgur.com/x6c01dN.png" width="65%" height="65%" /></a>


#### スクリーンショット
<a href="https://imgur.com/oVFEFwn"><img src="https://i.imgur.com/oVFEFwn.png" width="50%" height="50%" /></a>


<a href="https://imgur.com/cr8xVhT"><img src="https://i.imgur.com/cr8xVhT.png" width="50%" height="50%" /></a>

#### 実装
firebase/auth を使ってログインとログアウトを実装します。

```ts
/** 匿名認証でログインする */
async signInAnonymously() {
  try {
    const result = await firebase.auth().signInAnonymously()
    console.log(result)
  } catch (error) {
    console.error('firebase error', error)
  }
}

/** ログアウトする */
async signOut() {
  try {
    const result = await firebase.auth().signOut()
    console.log(result)
  } catch (error) {
    console.error('firebase error', error)
  }
}
```

匿名認証が完了するとユーザ情報が登録されます。以下のようにFirebaseコンソール上で作成されたユーザ情報が確認できます。

<a href="https://imgur.com/b8BBIEC"><img src="https://i.imgur.com/b8BBIEC.png" width="65%" height="65%" /></a>


[AnonymouslyPage](./src/views/authentication/AnonymouslyPage.vue)と[SignInFinishPage](./src/views/authentication/SignInFinishPage.vue)を写経してページを作成してください。


## Lesson7
### メール認証

#### メール認証を許可する
Firebaseコンソールで認証設定よりメール認証を許可してください。


<a href="https://imgur.com/nBZf2rC"><img src="https://i.imgur.com/nBZf2rC.png" width="65%" height="65%" /></a>


本人確認メールのテンプレートの変更できます。変更する場合はFirebaseコンソールより変更してください。


<a href="https://imgur.com/te0JsfD"><img src="https://i.imgur.com/te0JsfD.png" width="65%" height="65%" /></a>

#### スクリーンショット
<a href="https://imgur.com/Zc6BP7z"><img src="https://i.imgur.com/Zc6BP7z.png" width="50%" height="50%" /></a>

#### 実装
メール認証を行う場合は「サインアップ」「ログイン」機能を実装します。
```ts
/** サインアップする */
async signUp(email: string, password: string) {
  try {
    const result = await firebase.auth().createUserWithEmailAndPassword(email, password)
    console.log(result)
    const user = firebase.auth().currentUser
    if (user !== null) {
      /** 本人確認メールを送信 */
      await user.sendEmailVerification()
    }
  } catch (error) {
    console.error('firebase error', error)
  }
}

/** ログインする */
async login(email: string, password: string)) {
  try {
    const result = await firebase.auth().signInWithEmailAndPassword(email, password)
    console.log(result)
  } catch (error) {
    console.error('firebase error', error)
  }
}
```

サインアップが完了するとユーザ情報が登録されます。


<a href="https://imgur.com/AlGZSv4"><img src="https://i.imgur.com/AlGZSv4.png" width="65%" height="65%" /></a>


[EmailAuthPage](./src/views/authentication/EmailAuthPage.vue)と[SignInFinishPage](./src/views/authentication/SignInFinishPage.vue)を写経してページを作成してください。

## Lesson8
### 認証情報を利用してFirestoreへユーザーデータを保存

#### 実装

[Lesson7](#Lesson7)の機能に対して、Firestoreへユーザーデータを保存する機能を実装します。


サインアップ完了後、userコレクションへユーザーデータを保存します。

認証情報とユーザーデータを紐づけるために、ユーザーデータのドキュメントIDを認証情報のuidにします（user.uid）。


```ts
/** サインアップする */
async signUp(email: string, password: string) {
  try {
    const result = await firebase.auth().createUserWithEmailAndPassword(email, password)
    console.log(result)
    const user = firebase.auth().currentUser
    if (user !== null) {
      /** 本人確認メールを送信 */
      await user.sendEmailVerification()
      /** Firestoreへユーザーデータを保存 */
      await this.createUser(user.uid)
    }
  } catch (error) {
    console.error('firebase error', error)
  }
}

/**
 * ユーザーデータを作成する。
 */
async createUser(userId: string) {
  try {
    const db: firebase.firestore.Firestore = firebase.firestore()
    const batch: firebase.firestore.WriteBatch = db.batch()
    const ref: firebase.firestore.DocumentReference = db.collection('version/3/user').doc(userId)
    batch.set(ref, {
      uid: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      name: 'ゲスト',
    }, { merge: true} )
    await batch.commit()
  } catch (error) {
    console.error('firebase error', error)
  }
}
```


以下のようにユーザーデータが保存されます。


<a href="https://imgur.com/eYyWgMy"><img src="https://i.imgur.com/eYyWgMy.png" width="80%" height="80%" /></a>



[EmailAuthWithCreateUserPage](./src/views/authentication/EmailAuthWithCreateUserPage.vue)と[SignInFinishPage](./src/views/authentication/SignInFinishPage.vue)を写経してページを作成してください。

## Lesson9

### Firestoreセキュリティルールを利用
[公式スタートガイド](https://firebase.google.com/docs/firestore/security/get-started?hl=ja)

Firebase CLIを使ってDeploy環境を構築します。

以下のコマンドで必要な環境を構築します。

```sh
$ firebase init firestore
```
ファイルが生成されます。

| ファイル | 内容 |
| :------- | :--- |
| firestore.rules | firestoreのセキュリティルールの記述ファイル |
| firestore.indexes.json | firestoreのindex管理の記述ファイル（[公式ガイド](https://firebase.google.com/docs/firestore/query-data/indexing?hl=ja)）|
| firebase.json | firebase deployコマンドの設定ファイル |
| .firebaserc| deploy先のプロジェクトが書かれた設定ファイル |


以下のコマンドでdeploy対象のプロジェクトを確認できます。

```sh
$ firebase use
```

firestore.rulesを確認します。

```js
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
       allow read, write;
    }
  }
}
```


firestoreのセキュリティルールをdeployします。
```sh
$ firebase deploy --only firestore:rules
```

Firebaseコンソールより、deployしたセキュリティルールの内容を確認できます。


#### セキュリティルールを設定

firestore.rulesにセキュリティルールを記述していきます。

セキュリティルールを記述することでデータベースへのアクセス制限を設定することができます。

- [セキュリティ ルールの構造化](https://firebase.google.com/docs/firestore/security/rules-structure?hl=ja)
- [セキュリティ ルールの記述条件](https://firebase.google.com/docs/firestore/security/rules-conditions?hl=ja)

以下はルールを抜粋したものです。

```js
// 全ての許容する。
allow read, write: if true;

// 許容しない。
allow read, write: if false;

// ログイン状態のユーザーであれば許容する。
allow read, write: if request.auth != null;

// 「ログイン状態」且つ「ログインしたユーザーがFirestoreのドキュメントIDと同じ」であれば、許容する。
match /user/{userId} {
  allow read, write: if request.auth.uid == userId;
}

// セキュリティルールは細かく設定できる。
match /user/{userId} {
  // ログイン状態であれば誰でも取得できる。
  allow read: if request.auth != null;

  // 「ログイン状態」且つ「ログインしたユーザーがFirestoreのドキュメントIDと同じ」であれば、作成と更新ができる。
  allow create, update: if request.auth != null && request.auth.uid == userId;

  // ログイン状態のユーザーから削除できないようにする。
  allow delete: if false;
}

// バリデーションする
match /user/{userId} {
  // request.resource.data でリクエストされたデータを確認できる。
  // この場合は uid が空じゃなかったら作成を許容する。
  allow create: if request.resource.data.uid != '' &&
                   request.auth != null && request.auth.uid == userId;

  // resource.data で既に存在するデータを確認できる。
  // リクエストされたデータの比較ができる。
  // この場合は既に存在する uid に変更がなければ更新を許容する
  allow update: if request.resource.data.uid == resource.data.uid &&
                   request.auth != null && request.auth.uid == userId;
}
```

#### スクリーンショット
<a href="https://imgur.com/TMu5yrj"><img src="https://i.imgur.com/TMu5yrj.png" width="50%" height="50%" /></a>

#### 実装
セキュリティールールの仕様は以下の通りです。

| データベース | 本人 <br>（読み込み）| 本人 <br>（書き込み）| 他人 <br>（読み込み）| 他人 <br>（書き込み）|
| :------- | :---: | :---: | :---: | :---: |
| user/{userId} | ○ | ○ | ○ | × |
| user/{userId}/secret/{secretId} | ○ | ○ | × | × |


[firestore.rules](./firestore.rules)と[SecurityRuleLessonPage](./src/views/authentication/SecurityRuleLessonPage.vue)を写経してページを作成してください。

動作確認する際はfirestore.rulesを<font color="red">deploy</font>して確認してください。

## Lesson10
### SNS認証
TwitterとFacebookでログインできるようにします。

#### Twitter API Keyを取得
Twitter Developerより設定を行います。


[https://developer.twitter.com/](https://developer.twitter.com/)



<a href="https://imgur.com/QiyNzUJ"><img src="https://i.imgur.com/QiyNzUJ.png" width="70%" height="70%" /></a>


必要な項目を入力して登録します。<br>

Callback URLsはFirebase Authanticationのコンソールから取ってきたものを入力します。

<a href="https://imgur.com/gwFnmTi"><img src="https://i.imgur.com/gwFnmTi.png" width="70%" height="70%" /></a>


Twitter API keyとSecret keyをFirebase Authanticationへ登録します。
<a href="https://imgur.com/UwJ6dn1"><img src="https://i.imgur.com/UwJ6dn1.png" width="70%" height="70%" /></a>


Callback URLsは以下の箇所に書かれています。

<a href="https://imgur.com/Ghsh6DU"><img src="https://i.imgur.com/Ghsh6DU.png" width="70%" height="70%" /></a>


#### Facebook API Keyを取得
Facebook Developerより設定を行います。


[https://developers.facebook.com/](https://developers.facebook.com/)


<a href="https://imgur.com/tdpAj3H"><img src="https://i.imgur.com/tdpAj3H.png" width="70%" height="70%" /></a>


アプリIDとSecret Keyを取得します。

<a href="https://imgur.com/jmP8Jey"><img src="https://i.imgur.com/jmP8Jey.png" width="70%" height="70%" /></a>


Firebase Authanticationに登録します。

OAuthリダイレクトURIを取得します。

<a href="https://imgur.com/5LyjdQ0"><img src="https://i.imgur.com/5LyjdQ0.png" width="70%" height="70%" /></a>

OAuthリダイレクトURIをFacebookDeveloperへ登録します。

Facebookのコンソール画面 -> 左メニューのプロダクト欄 ->  Facebookログイン -> 設定

<a href="https://imgur.com/SrT6mGn"><img src="https://i.imgur.com/SrT6mGn.png" width="70%" height="70%" /></a>


#### スクリーンショット
<a href="https://imgur.com/wXwKz0j"><img src="https://i.imgur.com/wXwKz0j.png" width="70%" height="70%" /></a>

#### 実装
[SocialLoginPage](./src/views/authentication/SocialLoginPage.vue)と[SignInFinishPage](./src/views/authentication/SignInFinishPage.vue)を写経してページを作成してください。


## 課題
### 掲示板を作ろう
FirestoreとAuthanticationを利用して掲示板を作ってください。

仕様は以下の通りです。

#### 仕様
- ページ数は4ページ
  - ログインページ
  - 投稿ページ
  - 一覧ページ
  - 詳細ページ
- ログインページ
  - メール（又はSNS）認証でログインできるようにする
- 投稿ページ
  - 名前、日付、タイトル、内容を入力できるフォームを作成
  - 投稿、編集、削除がきる。
- 一覧ページ
  - 投稿された掲示タイトルを一覧表示する、投稿日の新しい順に表示する。
  - 選択すると詳細ページへ遷移する
- 詳細ページ
  - 投稿された内容全てを表示する。
  - 「いいね」ができること。


セキュリティ仕様は以下の通りです。

| データベース | 本人 <br>（読み込み）| 本人 <br>（書き込み）| 他人 <br>（読み込み）| 他人 <br>（書き込み）|
| :------- | :---: | :---: | :---: | :---: |
| 投稿内容（article） | ○ | ○ | ○ | × |
| いいね（like） | ○ | ○ | ○ | ○ |


#### スクリーンショット
T.B.D

#### 答え
T.B.D


### チャットアプリを作ろう
#### 仕様
#### スクリーンショット
#### 答え
T.B.D
