# Showcase

## Setup
- `npm install` で依存packageをインストールする
- `npm run dev` でビューのプレビューを行いながら編集する
  
### bm-view-previewの設定

* `bm-view-preview.config.js` の下記の部分を、使用したい企業アカウント・プロジェクト・環境のものに差し替えてください。

```js
const subdomain = "<subdomain>";
const projectId = "<projectId>";
const environmentId = "<environmentId>";
```

* subdomain, projectId, environmentIdは、それぞれベースマキナへのログイン後のURLから取得することができます。

