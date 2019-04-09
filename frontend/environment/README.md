# 環境構築

> Webアプリケーションの開発をするための環境構築。

# 目次
- [バージョン管理システム](#バージョン管理システム)
- [npm](#npm)
- [yarn](#yarn)
- [Git](#Git)
- [エディタ](#エディタ)
- [課題](#課題)
# バージョン管理システム
バージョン管理システムを導入します。SDK、ライブラリ、CLIなどのパッケージを導入するために使用します。<br>
パッケージをインストールするとnode_modulesフォルダとpackage.jsonが生成されます。<br>

・node_modules<br>
インストールしたパッケージが保存されているフォルダです。<br>
インストールしたパッケージのソースコードを確認できます。<br>
容量が大きくなるため、Gitでソースコードを公開する際はnode_modulesは対象外にします。<br>

・package.json<br>
インストールしたパッケージとバージョン情報が記録されたファイルです。<br>
node_modulesが保存されていなくても記録されているパッケージ情報を元に必要なパッケージをインストールしてくれます。<br>
# [npm](https://www.npmjs.com/)
Node Package Managerの略称でnode.jsで動作するバージョン管理システムです。npmのインストールは以下の記事を参考。<br>
[買いたてのＭacにNode.jsとnpmをインストール](https://qiita.com/taketakekaho/items/dd08cf01b4fe86b2e218)<br>
[MacにNode.jsとnpmをインストールする方法【初心者向け](https://public-constructor.com/install-node-and-npm-on-mac/)<br>

## 初期化
```bash
# package.jsonの生成
$ npm init

```
## インストール
XXXXはパッケージ名
```bash
# package.jsonからパッケージをインストール
$ npm install

# パッケージをグローバルインストール（ターミナルのどこからでも使用できる）
$ npm install -g XXXX

# パッケージをローカルインストール（カレントディレクトリ内のみ使用できる）
$ npm install XXXX

# package.jsonのdependenciesに依存関係が記録してインストール
$ npm install --save　XXXX

# package.jsonのdevDependenciesに依存関係が記録してインストール
$ npm install --save-dev　XXXX

# パッケージをバージョン指定してインストール
$ npm install XXXX@1.0.1

# パッケージバージョンを更新
$ npm update
$ npm update XXXX@1.0.1
```
## 確認
```bash
# リリースされているパッケージバージョンを確認
$ npm info XXXX versions

# 未更新のパッケージバージョンを確認
$ npm outdated
```

## 削除
```bash
# パッケージを削除
$ npm uninstall -g XXXX
$ npm uninstall XXXX
$ npm uninstall --save　XXXX
$ npm uninstall --save-dev　XXXX
``` 
# [yarn](https://yarnpkg.com/)
yarnはnpmをさらに高速にしたパッケージ管理システムです<br>
## yarnをインストール
```bash
# npmを使ってグローバルインストール
$ npm install -g yarn

# バージョン確認
$ yarn -v
```

## 初期化
```bash
# package.jsonの生成
$ yarn init

```
## インストール
XXXXはパッケージ名
```bash
# package.jsonからパッケージをインストール
$ yarn add

# パッケージをグローバルインストール（ターミナルのどこからでも使用できる）
$ yarn global add XXXX

# パッケージをローカルインストール（カレントディレクトリ内のみ使用できる）
# package.jsonのdependenciesに依存関係が記録してインストール
$ yarn add XXXX

# package.jsonのdevDependenciesに依存関係が記録してインストール
$ yarn add XXXX --dev

# パッケージをバージョン指定してインストール
$ yarn add XXXX@1.0.1

# パッケージバージョンを更新
$ yarn upgrade XXXX
```
## 確認
```bash
# リリースされているパッケージバージョンを確認
$ yarn info XXXX

# 未更新のパッケージバージョンを確認
$ yarn outdated
```

## 削除
```bash
# パッケージを削除
$ yarn remove XXXX
``` 

# [Git](https://git-scm.com/)
プログラムのソースコードなどの変更履歴を記録・追跡するための分散型バージョン管理システム。<br>
OSS(オープンソースソフトウェア)としてソースコードがGit上に公開され、コントリビュータ達が協力して良いOSSを作り上げている。<br>
Gitを使ったソースコード管理システムは多く存在する。一番有名なのが[GitHub](https://github.com/)である。
- [GitHub](https://github.com/)
- [GitLab](https://gitlab.com/)
- [BitBucket](https://bitbucket.org/)
- [GitBucket](https://gitbucket.github.io/)

本カリキュラムではGitHubを使用する。<br>

## ローカルリポジトリの作成
``` bash
$ git init
$ git add *
$ git commit -m "comment"
```

## リモートリポジトリの作成
GitHubからリモートリポジトリを作成。<br>
<a href="https://imgur.com/Y7Z9hlw"><img src="https://i.imgur.com/Y7Z9hlw.png" witdh="400" height="400"  title="source: imgur.com" /></a>

## リポジトリのクローン
``` bash
# 既に公開されているリポジトリをダウンロード
$ git clone https://github.com/hukusuke1007/nem-wallet
```

## 基本パターン
``` bash
# ブランチ情報を確認
$ git branch -a

# ブランチ作成
$ git branch  <ブランチ名>
# 例）$ git branch hoge

# 作成したブランチをチェックアウトする
$ git checkout  <ブランチ名>
# 例）$ git checkout hoge

# 空コミットする（ローカル）
$ git commit --allow-empty -m "first commit"

# コミットする（ローカル）
$ git commit -a -m "comment"

# 指定のブランチへプッシュする（リモート）
$ git push origin <ブランチ名>
# 例）$ git push origin hoge

# ブランチ名を変更
$ git branch -m <古いブランチ名> <新しいブランチ名>
# 例）$ git branch -m hoge feat/hoge

# ブランチ名を変更（今開いているブランチを変更）
$ git branch -m <新しいブランチ名>
# 例）$ git branch -m feat/hoge

# 古いブランチ名を削除
$ git push origin :<古いブランチ名>
# 例）$ git push origin :hoge

# ブランチを変更したらリモートプッシュを忘れずに
# プッシュ（現在のブランチ）
$ git push origin HEAD

# プッシュ（ブランチを指定）
$ git push origin <新しいブランチ名>
# 例）$ git push origin feat/hoge
```

## マージする
```bash
# マージ先のブランチへcheckout
$ git checkout <マージ先のブランチ名>

# マージ先のブランチを最新にする
$ git pull origin <マージ先のブランチ名>

# マージする --no-ffオプション：fast-forwardの関係であっても、必ずマージコミットを作る
$ git merge --no-ff <マージしたいブランチ名>

# リモートリポジトリとの差分を確認する
$ git diff HEAD..<リモート名/ブランチ名>

# プッシュする
$ git push origin <マージ先のブランチ名>
```

## 特定のファイルだけをマージする
```bash
# 全部マージして特定のファイル以外は全てリセットする
$ git checkout <マージ先のブランチ名>
$ git merge --no-commit -Xtheirs <mergeしたいブランチ名>
$ git reset HEAD <mergeしたくないファイル名>
$ git checkout <mergeしたくないファイル名>
$ git commit

# 特定のファイルだけチェックアウトして取り入れる
$ git checkout <マージ先のブランチ名>
$ git checkout <マージ元のブランチ名> <取り入れたいファイル名>
```

## コンフリクト解消
```bash
# コンフリクトしているファイルを確認
$ git status

#####################################
# エディタで手動でコードを編集して解消する
#####################################

# 編集して解消したコードをコミット対象にする
$ git add <ファイル名>

# コミットする
$ git commit
```


## 差分の確認
```bash
# 現在チェックアウトしているブランチと指定したブランチとの差分を確認
$ git diff --name-status <差分を確認したいブランチ名>

# リモートリポジトリとの差分を確認する
$ git diff HEAD..<リモート名/ブランチ名>

# 今回コミットした変更点を見る
$ git diff HEAD^

# コミット同士を比較する
$ git diff <変更前のハッシュ>..<変更後のハッシュ>

# ブランチ同士を比較する
$ git diff <ブランチA>..<ブランチB>
```

[参考文献](https://qiita.com/shibukk/items/8c9362a5bd399b9c56be)

## masterへプッシュ
```bash
# プッシュするファイルを追加
$ git add *

# コミット（ローカル）
$ git commit -a -m "comment"

# masterへプッシュする（リモート）
$ git push origin master
```

## コミットの取り消し
``` bash
# コミットログ
$ git log

# ハッッシュIDから取り消す
$ git reset --hard <ハッシュID>

# 最新コミットの1件分のワークディレクトリを保持した状態でコミットを取り消す
$ git reset --soft HEAD~1

# 最新コミットの1件分のワークディレクトリとコミットを取り消す
$ git reset --hard HEAD~1
```

## 取り込み
``` bash
# リモートリポジトリの情報を追加（リモートリポジトリのパスを指定）
$ git remote add origin https://github.com/hukusuke1007/FrontendTrainingKadai_1.git

# リポジトリの最新情報を追加
$ git fetch

# リポジトリの変更を取り込む（リモートリポジトリのパスを指定）
$ git pull https://github.com/hukusuke1007/FrontendTrainingKadai_1.git
```
## ブランチ
``` bash
# ブランチを確認
$ git branch -a

# ブランチ作成
$ git branch XXXX

# ブランチへ移動
$ git checkout XXXX

# ブランチ削除
$ git branch -d XXXX

# 現在のブランチ名を変更
$ git branch -m XXXX

# XXXXのブランチ名をYYYYへ変更
$ git branch -m XXXX YYYY
```

## 実はツールで簡単に操作できる
GitはGUIツールが用意されておりより簡単に操作できます。
- [SourceTree](https://ja.atlassian.com/software/sourcetree)
- [GitHub Desktop](https://desktop.github.com/)

GitHub Desktopの使い方は[こちら](http://hobbydevelop.info/pwa_vuejs_nem_0#GitHub)を参考。

# エディタ
フロントエンド開発にはVSCode(Visual Studio Code)を推奨する。<br>
[https://code.visualstudio.com/](https://code.visualstudio.com/)<br>
<br>
インストール後、ソースコードの可読性を上げるため以下のプラグインを導入する。

| プラグイン | 説明 |
|:---|:---|
|Vetur |Vue.jsのサポート|
|VueHelper |Vue.jsのコード補完|
|HTML Snippets |HTML5のコード補完|
|language-stylus |stylusのサポート|
|HTML CSS Support|CSSのサポート|
|ESLint |JavaScriptのlint|
|TSLint |TypeScriptのlint|


その他のプラグインは[こちらの記事](https://qiita.com/EbXpJ6bp/items/4b87a092a3d6a0ecf595)を参照。

<a href="https://imgur.com/OFOjrbH"><img src="https://i.imgur.com/OFOjrbH.png" width="300" height="300" title="source: imgur.com" /></a>

# 課題
## 課題1
GitHubアカウントを作成し、コマンド又はツールを用いて新しいrepositoryを作成してください。<br>
以下のようにrepositoryにはtext.txtをコミットしてください。<br>
[FrontendTrainingKadai_1](https://github.com/hukusuke1007/FrontendTrainingKadai_1)

## 課題2
VSCodeをインストールし、[エディタ](#エディタ)に書かれているプラグインを導入してください。