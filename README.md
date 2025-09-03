# Showcase

## Setup
- `npm install` で依存packageをインストールする
- `npm run dev` でビューのプレビューを行いながら編集する
  
## bm-view-previewの設定

* 以下のいずれかの方法で、使用したい企業アカウント・プロジェクト・環境の識別子を設定してください。
* 設定する値は、それぞれベースマキナへのログイン後のURLから取得することができます。
  - 例: `https://<subdomain>.basemachina.com/projects/<projectId>/environments/<environmentId>`

### direnvを使用する場合

* `.envrc.example` をコピーして `.envrc` を作成してください。
  - `cp .envrc.example .envrc`
* `.envrc` ファイル内に、使用したい企業アカウント・プロジェクト・環境の識別子を設定してください。

```sh
export BM_VIEW_PREVIEW_SUBDOMAIN=<subdomain>
export BM_VIEW_PREVIEW_PROJECT_ID=<projectId>
export BM_VIEW_PREVIEW_ENVIRONMENT_ID=<environmentId>
```

* `direnv allow` を実行してください。

### 直接設定する場合

* `bm-view-preview.config.js` の冒頭部分を、使用したい企業アカウント・プロジェクト・環境のものに差し替えてください。

```js
const subdomain = "<subdomain>";
const projectId = "<projectId>";
const environmentId = "<environmentId>";
```


