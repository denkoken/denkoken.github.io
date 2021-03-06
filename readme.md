# 超電子工学研究会 Webページ

URL : https://denkoken.github.io/

`src`ディレクトリ内の[ReactJS](https://facebook.github.io/react)
で書かれた`.jsx`ファイルと、`config`ディレクトリ内の設定用`.json`ファイルを
[Webpack](https://webpack.github.io/)により、
`main.bundle.js`と`bundle.css`にまとめて
`docs`ディレクトリに出力、`master`ブランチに`push`することで
Webページが公開されます。


## コマンド
```

# 必要パッケージのインストール
npm install

# 開発用ビルド
npm run watch

# 本番用ビルド (このコマンドを用いてコンパイルしたものをpushしないでください)
babel-node ./node_modules/webpack/bin/webpack.js --config webpack.prod.js

# main.bundle.js解析
npm run analyze

# Webページアップロード (必要なら本番用ビルドも走ります)
npm run publish
# または
babel-node publish.js
```


## React Component の繋がりについて

![図](https://raw.githubusercontent.com/denkoken/denkoken.github.io/develop/man/component.jpg)


## 記事の書き方について
記事は`.json`ファイルで管理されます。  
記事の追加後は`npm run publish`を実行してgitにcommitしてください。  
該当する`.json`ファイルや画像ファイルを変更してもwebpackでbuildする必要はありません。  

### jsonの書き方
以下のように記事を並べると複数の記事となります。


```
{
    "kizi_1": {
      ...
    },
    "kizi_2": {
      ...
    },
    "tokusyu_na_kizi": {
      ...
    },
    ...
    "iten_no_oshirase": {
      ...
    }
}
```

各記事のパラメータは以下の通りです。

| key | value type | description |
| --- | ---------- | ----------- |
| `title` | String | 記事のタイトル |
| `body` | Array of String | 記事の本文。Markdownでかけます。見やすさのためにArrayとなっていますが、全て連結されるのでどこで区切っても変わりません。 |
| `src` | String | headerとなる画像のパス。著作権フリーの画像を使いましょう。 |

#### 例
```
{
    "main": {
        "title": "超電子工学研究会",
        "body": [
            "<h4>",
            "慶應義塾大学公認団体 超電子工学研究会, ",
            "通称電工研のホームページです.<br>",
            "詳しくは <a href=\"./?topic=about_us\">電工研について</a>",
            "をご覧ください.<br>",
            "また、新歓情報は<a href=\"./?topic=shinkan\">こちら</a>",
            "で公開中です.",
            "</h4>"
        ],
        "src": "img/index.jpg"
    }
}
```

### jsonの配置場所
`config/internal_paths.json`で管理されます。
今は以下の通りになっています。  

| 場所 | key | デフォルトのpath(書き換えられます) |
| --- | --- | --- |
| トップページ | `index` | `data/article/index.json` |
| 電工研について | `about_us` | `data/article/about_us.json` |
| 告知 > 新歓情報 | `shinkan` | `data/article/shinkan.json` |
| 告知 > 三田祭情報 | `mita` | `data/article/mita.json` |
| 告知 > 矢上祭情報 | `yagami` | `data/article/yagami.json` |
| 制作物 | `work` | `data/list/work.json` |

## 設定ファイルについて
設定ファイルは`config`ディレクトリに`.json`ファイルとして配置してあります。

### `config/general.json`
Webページの基本的な設定用のファイルです。
変更を反映するにはリビルドが必要です。

必要なパラメータは以下の通りです。

| key | value type | description |
| --- | ---------- | ----------- |
| `name` | String | Webページのタイトルに表示される文字列です |
| `footer` | dict | Webページのフッターに表示される文字列です。フォーマットはfooter.name &copy;footer.yearです  |
| `load_json_failed` | String | jsonデータの動的読み込みに失敗したときに表示される文字列です |
| `github_url` | String | 取得すべきデータが配置されているgithub上のルートパスです |
| `default_image_url` | String | 記事やリストでヘッダ画像の指定がなかったときに表示される画像の**docsディレクトリからの相対パス**です |

### `config/internal_paths.json`
Webページのクエリ文字列において`topic`で指定された値と読み込むべき
`.json`ファイルの**docsディレクトリからの相対パス**の対応を
クエリ文字列による値をkey、パスをvalueとした
dict型で記述したファイルです。
クエリ文字列により指定される値の種類は後述の`config/menuitem.json`
を参照してください。
変更を反映するにはリビルドが必要です。

### `config/menuitem.json`
Webページのヘッダに表示されるメニューバーの項目の設定です。
メニュー項目を指定するdictのdictになっています。
後述するメニュー項目のパラメータ、`type`が`internal`のときは必ず
メニュー項目のkeyとして`config/internal_paths.json`
と共通のものを指定してください。
変更を反映するにはリビルドが必要です。

メニュー項目を設定するパラメータは以下の通りです。

| key | value type | description |
| --- | ---------- | ----------- |
| `label` | String | メニュー項目に表示される文字列です |
| `icon` | String | メニュー項目に表示されるアイコンを指定する文字列です。アイコンの種類については[こちら](https://ant.design/components/icon/)を確認してください。 |
| `type` | String | メニュー項目選択時の挙動を指定します。詳しくは後述 |
| `path` | Strinh | 後述の`type`にて説明します |
| `child` | dict | サブメニューとなるメニュー項目のdictを取ります。ネストの深さは1まで可能です。この項目が設定された場合のみ`type`の設定は不要です |
| `success` | String | `type`に`clipboard`が指定された場合のみ可能です。クリップボードへのコピーが成功したときに表示する文字列です |
| `failed` | String | `type`に`clipboard`が指定された場合のみ可能です。クリップボードへのコピーが失敗したときに表示する文字列です |

パラメータ`type`には次の3つが指定可能です。

 * `internal` : 内部リンク
 * `external` : 外部リンク
 * `clipboard` : クリップボードへのコピー

`internal`は選択されたメニュー項目のkeyに対し、
`./?topic=key`へのリダイレクトを行います。
`external`は選択されたメニュー項目の`path`で指定されたURLを
新しいタブで開きます。
`clipboard`は選択されたメニュー項目の`path`で指定された内容を
クリップボードにコピーします。

### `config/publish.json`
`publish.js`で実行される処理の設定ファイルです。
詳しい処理内容については後述の`publish.js`を参照してください。

利用可能なパラメータは次の通りです。

| key | value type | description |
| --- | ---------- | ----------- |
| `list` | list | 記事を配置するディレクトリとその記事を含む記事一覧の組を表すdictのlistです。dictのフォーマットは後述 |
| `update` | dict | 変更されていた場合に`git add`するファイルを指定します。dictのフォーマットは後述 |
| `rebuild` | dict | 変更されていた場合にリビルドを実行し`git add`するファイルを指定します。dictのフォーマットは後述 |
| `bundle` | list | `publish.js`が実行された結果リビルドが行われた場合新たに`git add`されるファイル一覧を指定します |

パラメータ`list`が持つべきパラメータは次のとおりです

| key | value type | description |
| --- | ---------- | ----------- |
| `dst_path` | String | 記事一覧のデータが格納される`json`ファイル |
| `src_dir` | String | 記事一覧に追加するファイルが格納されるディレクトリ |

パラメータ`update`, `rebuild`が持つべきパラメータは次の通りです。

| key | value type | description |
| --- | ---------- | ----------- |
| `dir` | list | このlist内のディレクトリ内のファイルすべてが処理を実行する対象となる |
| `file` | list | このlistに記述されたファイルが処理を実行する対象となる |
| `except` | list | このlistに記述されたファイルは`dir`で指定したディレクトリ内にあっても処理は実行されない |

## `publish.js`
`publish.js`は変更したファイルのeslint、git addやeslint、
また記事一覧の作成などを必要に応じて行うスクリプトです。
実行には`bebel-cli`が必要となります。

`config/publish.json`で指定したファイルに対しそれぞれ次の処理を行います。

1. 以前のcommit以降変更または追加のあったファイルについて、
`list`, `update`, `rebuild`の対象であるものを抽出します。
2. 抽出したファイルの内、`.js`, `.jsx`ファイルに対しeslintを実行します。
eslintに失敗した場合処理はここで終了しますので、
ソースコードの修正を行ってください。
3. `list`対象のファイルに対し、記事一覧の`json`ファイルに
タイトル、現在日時、パスを追加します。
また、記事一覧の`json`ファイルも`git add`の対象に加えます。
4. `rebuild`対象のファイルが存在する場合、`webpack.prod.js`の設定を使用して
リビルドを行います。この処理には1, 2分程度の時間がかかります。
また、`bundle`で指定したファイルを`git add`の対象に加えます。
Webpackに失敗した場合処理はここで終了しますので、
ソースコードの修正を行ってください。
5. `list`, `update`, `rebuild`で指定したファイル及び`git add`の対象に追加された
ファイルに対し`git add`を実行します。
6. commitします
7. `master`ブランチにプッシュします。
~~pushにユーザー名、パスワードの入力が不要な状態にしておく必要があります。~~
pushにユーザー名、パスワードの入力が不要な状態にしておくことを推奨します。

処理の終了後は念の為`git show`などで最新のcommitを確認してください。


## Twitter連携について
`npm run publish`を実行し新たに記事が更新された場合、
`config/twitter.json`を適切に設定しておくことで
電工研のTwitterアカウントで自動ツイートすることが可能です。  
**Twitterアカウント不正アクセス防止のため、
`git clone`しただけでは有効化されません。**  

`config/twitter.json`の設定は以下のとおりに行ってください。

1. [こちら](https://apps.twitter.com/app/7752990/keys)にアクセスし、
電工研のTwitterアカウントにログインする。
2. 表示されたページを見て、次のとおりに`config/twitter.json`を入力する。
    * `comsumer_key`に"Comsumer Key (API Key)"として表示された文字列をコピー
    * `comsumer_secret_key`に"Comsumer Secret (API Secret)"として表示された
    文字列をコピー
    * `access_token_key`に"Access Token"として表示された文字列をコピー
    (改行不要)
    * `access_token_secret`に"Access Token Secret"として表示された文字列を
    コピー
3. 適宜`content`を編集してホームページ更新時の文言を変える。


ツイートは次のようなフォーマットでなされます。
>>  ${`config/twitter.json`の`content`に書かれた内容}
>>  ${更新されたページのURL}


## その他
Linterとして`eslint`を使用します。
設定ファイルは`.eslintrc.json`です。
`eslint`が通っていないファイルのpushを防ぐため、
可能な限り`publish.js`を介したアップロードを行ってください。

ReactJSとともに用いるUI Componentとして
[Ant Design of React](https://ant.design/)を使用しています。

