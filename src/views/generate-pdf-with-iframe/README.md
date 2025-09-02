# iframeを用いたPDF生成

`iframe` に HTML を流し込み、`iframe.contentWindow.print()` でブラウザの印刷ダイアログ（PDF保存）を開くサンプルです。

## 概要

- 画面左で請求情報を編集し、右側の `iframe` に A4 用の HTML をリアルタイム表示します。
- 印刷ボタンで `iframe.contentWindow.print()` を呼び出し、各ブラウザの「PDFに保存」を利用して PDF を出力できます。
- 依存ライブラリなし（フォントも未指定）。日本語は OS 既定の日本語フォントで表示されます。要です。

![スクリーンショット](https://github.com/basemachina/showcase/blob/main/src/views/generate-pdf-with-iframe/generate-pdf-with-iframe.png)