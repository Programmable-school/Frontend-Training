# firebase-training

## 目次
### Firebase Hosting
- [静的ページをDeployする](#Lesson21)


## Firebase公式ページ
[https://firebase.google.com/docs/web/setup?hl=ja](https://firebase.google.com/docs/web/setup?hl=ja)

- [Firebase Hosting](https://firebase.google.com/docs/hosting?hl=ja)

## 準備
[環境構築](./README_1.md#環境構築)を行ってから作業してください。

Firebase Hostingの環境構築します。<br>

```sh
$ firebase init

? Which Firebase CLI features do you want to setup for this folder? Press Space to select features, then Enter to confirm your choi
ces. 
 ◯ Database: Deploy Firebase Realtime Database Rules
 ◯ Firestore: Deploy rules and create indexes for Firestore
 ◯ Functions: Configure and deploy Cloud Functions
❯◉ Hosting: Configure and deploy Firebase Hosting sites
 ◯ Storage: Deploy Cloud Storage security rules

Your public directory is the folder (relative to your project directory) that
will contain Hosting assets to be uploaded with firebase deploy. If you
have a build process for your assets, use your build s output directory.

? What do you want to use as your public directory? dist
? Configure as a single-page app (rewrite all urls to /index.html)? Yes
? File public/index.html already exists. Overwrite? No
i  Skipping write of public/index.html

i  Writing configuration info to firebase.json...
i  Writing project information to .firebaserc...

✔  Firebase initialization complete!
```

>? What do you want to use as your public directory?

deploy対象のディレクトリ名を指定します。ここでは dist を入力します。

> ? Configure as a single-page app (rewrite all urls to /index.html)?

Vue.jsで作成したページをdeployするのでここは Yes にします。

> ? File public/index.html already exists. Overwrite? No

上書きはしないので No にします。



構築が完了するとカレントディレクトリに firebase.json にhostingの情報が追記されます。

```json
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ]
  }
```

deploy対象になるディレクトリの設定は public: "dist" です。 この場合、distのディレクトリ内のファイルがdeployされます。

ignore に設定されているファイルはdeploy対象外のファイルです。

## レッスン
## Lesson21
### 静的ページをDeployする

Hostingの環境が完了したら、静的ページをdeployします。<br>
今まで写経したVue.jsの静的ページをdeployします。

Vue.jsで作られたコードを静的ページとして表示できるようビルドします。ビルドすると distディレクトリ が作成されます

```sh
$ yarn build
```

deployします。

```sh
$ firebase deploy --only hosting

=== Deploying to 'fir-training-ae8b1'...

i  deploying hosting
i  hosting[fir-training-ae8b1]: beginning deploy...
i  hosting[fir-training-ae8b1]: found 7 files in dist
✔  hosting[fir-training-ae8b1]: file upload complete
i  hosting[fir-training-ae8b1]: finalizing version...
✔  hosting[fir-training-ae8b1]: version finalized
i  hosting[fir-training-ae8b1]: releasing new version...
✔  hosting[fir-training-ae8b1]: release complete

✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/fir-training-ae8b1/overview
Hosting URL: https://fir-training-ae8b1.firebaseapp.com
```

urlを選択するとVue.jsで作成したページが確認できます。

[https://fir-training-ae8b1.firebaseapp.com/](https://fir-training-ae8b1.firebaseapp.com/)


#### scriptの設定

package.jsonに firebase deploy --only hosting のscriptを設定すると便利です。

```json
  "scripts": {
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build",
    "lint": "vue-cli-service lint",
    "firestore-rules": "firebase deploy --only firestore:rules",
    "deploy": "firebase deploy --only hosting"
  },
```

以下のコマンドでdeployできるようになります。

```sh
$ yarn deploy
```


#### corsの設定

corsに静的ページのurlを設定します。

cors-json-file.json に https://fir-training-ae8b1.firebaseapp.com を追記します。


```json
[
  {
    "origin": ["http://localhost:8080", "https://fir-training-ae8b1.firebaseapp.com"],
    "responseHeader": ["Content-Type"],
    "method": ["GET", "HEAD", "DELETE"],
    "maxAgeSeconds": 3600
  }
]
```

deployします。


```bash
# gs://〜 はご自身のgsのURLを指定 GoogleCloudPlatformのStorage -> ブラウザ から確認できます。
$ gsutil cors set cors-json-file.json gs://fir-training-ae8b1.appspot.com
```

