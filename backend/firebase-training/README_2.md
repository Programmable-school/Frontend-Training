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

<a href="https://imgur.com/OY6HDFR"><img src="https://i.imgur.com/OY6HDFR.png" width="70%" height="70%" /></a>


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

<a href="https://imgur.com/SHnsG6Q"><img src="https://i.imgur.com/SHnsG6Q.png" width="70%" height="70%" /></a>


Cloud StorageのパスはFirestoreと同様のパスで管理します。

<a href="https://imgur.com/qdeETw4"><img src="https://i.imgur.com/qdeETw4.png" width="70%" height="70%" /></a>


## Lesson13
### セキュリティールールの利用（操作、ファイル容量、拡張子の許容制御）
#### スクリーンショット

#### 実装
Cloud Storageのstorage.rulesを作成します。

```bash
$ firebase init
? Which Firebase CLI features do you want to setup for this folder? Press Space to select features, then Enter to confirm your choices. 
 ◯ Database: Deploy Firebase Realtime Database Rules
 ◯ Firestore: Deploy rules and create indexes for Firestore
 ◯ Functions: Configure and deploy Cloud Functions
 ◯ Hosting: Configure and deploy Firebase Hosting sites
❯◉ Storage: Deploy Cloud Storage security rules

? What file should be used for Storage Rules? storage.rules
i  Writing configuration info to firebase.json...
i  Writing project information to .firebaserc...

✔  Firebase initialization complete!
```

storage.rulesを確認します。<br>
デフォルトでは認証ユーザのみストレージの読み書きを許可するよう設定されています。

```js
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth!=null;
    }
  }
}
```

セキュリティルールを以下のように書き換えてください。

```js
service firebase.storage {
  match /b/{bucket}/o {
    match /version/{versionId} {
      function isAuthenticated() {
        return request.auth != null;
      }
      function isUserAuthenticated(id) {
        return request.auth.uid == id;
      }
      match /user/{userId} {
        // 認証有りで操作可
        match /{fileId} {
          allow read, write: if isAuthenticated() && isUserAuthenticated(userId);
        }
      }
      match /folder/{fileId} {
        // 認証無しで操作可
        allow read, write: if true;
      }
      match /userpractice/{userpracticeId} {
        // 認証無しで操作可
        match /{fileId} {
          allow read, write: if true;
        }
      }
    }
  }
}
```

適用するためにdeployします。

```bash
$ firebase deploy --only storage:rule
```

Firebaseコンソールからdeployされていることを確認できます。

<a href="https://imgur.com/cf4hAgx"><img src="https://i.imgur.com/cf4hAgx.png" width="70%" height="70%" /></a>

## Lesson14
### 様々な形式のファイルを扱う（txt、csv、pdfなど）
#### スクリーンショット



## 課題
### タイトル
#### 答え

