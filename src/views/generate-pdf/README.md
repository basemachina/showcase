# 請求書PDF生成（react-pdf サンプル）

フォーム入力から請求書PDFを生成・プレビュー・ダウンロードするビューです。
UIは Chakra UI、フォーム状態管理は Formik、PDF生成は `@react-pdf/renderer` を使用しています。日本語文字化け対策として Noto Sans JP を同梱し、フォントをバンドルに内包しています。

![スクリーンショット](https://github.com/basemachina/showcase/blob/main/src/views/generate-pdf/generate-pdf.png)

## 概要

- **プレビュー**: 右側に A4 の PDF プレビュー（`PDFViewer`）。
- **ダウンロード**: `BlobProvider` で生成した Blob URL を使い、ワンクリック保存。
- **日本語対応**: ローカル配置の Noto Sans JP（TTF）を `Font.register` で登録し文字化けを回避。
- **編集体験**: 請求情報・請求先・品目・税率・振込先・自社情報・備考をフォームで編集可能。

## フォントの取り扱い（日本語文字化け対策）

- `index.tsx` 冒頭で Noto Sans JP を登録しています。
  - `import NotoSansRegular from "./fonts/NotoSansJP-Regular.ttf?inline";`
  - `import NotoSansBold from "./fonts/NotoSansJP-Bold.ttf?inline";`
  - `Font.register({ family: "NotoSansJP", fonts: [{ src: NotoSansRegular, fontWeight: "normal" }, { src: NotoSansBold, fontWeight: "bold" }] });`
- `webpack.config.js` で `?inline` 指定のフォントを `asset/inline` として取り込み、ネットワーク不要にしています。
- `types.d.ts` で `@basemachina/view` とフォント拡張子（`*.ttf`/`*.otf`）のモジュール宣言を追加し、TypeScript の import エラーを回避。

## 参考

- @react-pdf/renderer: https://react-pdf.org/
