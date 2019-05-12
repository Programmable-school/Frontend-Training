# firebase-training

## 目次
### Cloud Storage
- [画像の保存、取得、削除](#Lesson11)
- [Firestoreとの連携](#Lesson12)
- [セキュリティルールの利用（操作、ファイル容量、拡張子の許容制御）](#Lesson13)
- [様々な形式のファイルを扱う](#Lesson14)


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
<a href="https://imgur.com/lNN0Dft"><img src="https://i.imgur.com/lNN0Dft.png" width="50%" height="50%" /></a>

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
<a href="https://imgur.com/nlB2Bbj"><img src="https://i.imgur.com/nlB2Bbj.png" width="50%" height="50%" /></a>

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
### セキュリティルールの利用（操作、ファイル容量、拡張子の許容制御）
#### スクリーンショット
<a href="https://imgur.com/PMs6sjQ"><img src="https://i.imgur.com/PMs6sjQ.png" width="50%" height="50%" /></a>

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
      function limitSize() {
        // ファイルサイズが3Mbyte以下であること
        return request.resource.size <= 3 * 1024 * 1024;
      }
      function isImageType() {
        // contentTypeがimageである
        return request.resource.contentType.matches('image/.*');
      }
      match /user/{userId} {
        // 認証有り、規定のファイルサイズとファイル形式で操作可
        match /{fileId} {
          allow read, delete: if isAuthenticated() && isUserAuthenticated(userId);
          allow create, update: if isAuthenticated() && isUserAuthenticated(userId) && limitSize() && isImageType();
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

Firebaseコンソールの Storage -> ルールでdeployされていることを確認できます。

適用したストレージのセキュリティルールの仕様は以下の通りです

- 読み込み、書き込みは認証した本人のみ
- ファイルの容量は3Mbyteまで
- ファイル形式は画像のみ

Lesson12のコードを実装後、以下のコードを写経してページを作成してください。
- [ImageOperationSecurePage.vue](./src/views/storage/ImageOperationSecurePage.vue)

## Lesson14
### 様々な形式のファイルを扱う
#### スクリーンショット

<a href="https://imgur.com/mu5xl8P"><img src="https://i.imgur.com/mu5xl8P.png" width="70%" height="70%" /></a>

#### 実装

以下のセキュリティルールを追加して、それぞれdeployしてください。

・Cloud Storage セキュリティルール
```js
match /userstorage/{userstorageId} {
  match /{fileId} {
    allow read, write: if true;
  }
}
```

・Firestore セキュリティルール
```js
match /userstorage/{userstorageId} {
  allow read, write: if true;
}
```

localhostからCloud Storageに保存したファイルをダウンロードできるよう、CORSの設定を行います。

[https://cloud.google.com/storage/docs/configuring-cors?hl=ja](https://cloud.google.com/storage/docs/configuring-cors?hl=ja)

cors-json-file.jsonを作成します。

```json
[
  {
    "origin": ["http://localhost:8080"],
    "responseHeader": ["Content-Type"],
    "method": ["GET", "HEAD", "DELETE"],
    "maxAgeSeconds": 3600
  }
]
```

cors-json-file.jsonをdeployします。
```bash
# gs://〜 はご自身のgsのURLを指定 GoogleCloudPlatformのStorage -> ブラウザ から確認できます。
$ gsutil cors set cors-json-file.json gs://fir-training-ae8b1.appspot.com

# 反映されているか確認
$ gsutil cors get gs://fir-training-ae8b1.appspot.com
[{"maxAgeSeconds": 3600, "method": ["GET", "HEAD", "DELETE"], "origin": ["http://localhost:8080"], "responseHeader": ["Content-Type"]}]
```

Lesson12、13のコードを実装後、以下のコードを写経してページを作成してください。
- [ImageOperationVariousFilesPage.vue](./src/views/storage/ImageOperationVariousFilesPage.vue)
- [StorageDetailFile.ts](./src/ts/firebase/model/StorageDetailFile.ts)
- [UserStorage.ts](./src/ts/firebase/model/UserStorage.ts)

## 課題
### タイトル
#### 答え

