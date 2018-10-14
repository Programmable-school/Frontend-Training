# 環境構築

> Webアプリケーションの開発をするための環境構築です。

# 目次
- バージョン管理システム概要
- npm
- yarn
- Git
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


# [yarn](https://yarnpkg.com/lang/ja/)
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

# [Git](https://www.npmjs.com/)
プログラムのソースコードなどの変更履歴を記録・追跡するための分散型バージョン管理システム。<br>
OSS(オープンソースソフトウェア)としてGit上にソースコードが公開され、各OSSのコントリビュータ達が改善を行いより良いOSSを作り上げている。<br>
Gitを使ったソースコード管理システムは多く存在する有名なのが[Github](https://github.com/)であり、その他にも存在する。
- [Github](https://github.com/)
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

## リポジトリのクローン
``` bash
# 既に公開されているリポジトリをダウンロード
$ git clone https://github.com/hukusuke1007/nem-wallet
```

## リポジトリへデプロイ
``` bash
# デプロイするファイルを追加
$ git add *

# ファイルをコミットする（ローカル上へデプロイ）
$ git commit -a -m "comment"

# ファイルをプッシュする（リポジトリへデプロイ）
$ git push origin master
```

## コミットの取り消し
``` bash
# 最新コミットのX件分のワークディレクトリを保持した状態でコミットを取り消す
$ git reset --soft HEAD~X

# 最新コミットのX件分のワークディレクトリとコミットを取り消す
$ git reset --hard HEAD~X
```

## ブランチ
``` bash
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
GitはGUIツールが用意されており、より簡単に操作できます。
- [SourceTree](https://ja.atlassian.com/software/sourcetree)
- [GitHub Desktop](https://desktop.github.com/)
