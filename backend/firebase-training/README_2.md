# firebase-training

## 目次
### Cloud Storage
- [画像の保存、取得、削除](#Lesson11)
- [Firestoreとの連携](#Lesson12)
- [セキュリティールールの利用（操作、ファイル容量、拡張子の許容制御）](#Lesson13)
- [様々な形式のファイルを扱う（txt、csv、pdfなど）](#Lesson14)


### 課題

## Firebase公式ページ
[https://firebase.google.com/docs/web/setup?hl=ja](https://firebase.google.com/docs/web/setup?hl=ja)

- [Cloud Storage](https://firebase.google.com/docs/storage/?hl=ja)

## 準備
[環境構築](./README_1.md#環境構築)を行ってから作業してください。

## レッスン
本プロジェクトをcloneして以下のレッスンのサンプルコードを写経してください。

## Lesson11
### 画像の保存、取得、削除
#### スクリーンショット
<a href="https://imgur.com/O6mHRhT"><img src="https://i.imgur.com/O6mHRhT.png" width="50%" height="50%" /></a>

#### 実装
レッスン用に予め、Cloud Storageのセキュリティルールは認証無しに操作できるようにします。

<a href="https://imgur.com/OY6HDFR"><img src="https://i.imgur.com/OY6HDFR.png" width="50%" height="50%" /></a>


以下のコードを写経してページを作成してください。
- [ImageOperationPage.vue](./src/views/storage/ImageOperationPage.vue)
- [FileInfo.ts](./src/ts/interface/FileInfo.ts)

画像は以下のようの保存されます。

<a href="https://imgur.com/VhA4y3C"><img src="https://i.imgur.com/VhA4y3C.png" width="50%" height="50%" /></a>


## Lesson12
### Firestoreとの連携

#### スクリーンショット
<a href="https://imgur.com/csDVQiy"><img src="https://i.imgur.com/csDVQiy.png" width="50%" height="50%" /></a>

#### 実装
Firestoreのデータ及びビジネスロジックをまとめたモデルクラスを作成し、さらにCloud Storageの操作もモデルクラスで行うよう実装します。

以下のコードを写経してページを作成してください。
- [ImageOperationFirestorePage.vue](./src/views/storage/ImageOperationFirestorePage.vue)
- [FileInfo.ts](./src/ts/interface/FileInfo.ts)
- [StorageFile.ts](./src/ts/firebase/model/StorageFile.ts)
- [Base.ts](./src/ts/firebase/model/Base.ts)
- [User.ts](./src/ts/firebase/model/User.ts)

Firestoreは以下のようになります。

<a href="https://imgur.com/SHnsG6Q"><img src="https://i.imgur.com/SHnsG6Q.png" width="50%" height="50%" /></a>


Cloud StorageのパスはFirestoreと同様のパスで管理します。

<a href="https://imgur.com/qdeETw4"><img src="https://i.imgur.com/qdeETw4.png" width="50%" height="50%" /></a>


## Lesson13
### セキュリティールールの利用（操作、ファイル容量、拡張子の許容制御）
#### スクリーンショット

## Lesson14
### 様々な形式のファイルを扱う（txt、csv、pdfなど）
#### スクリーンショット



## 課題
### タイトル
#### 答え

