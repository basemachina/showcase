# 編集可能なテーブル（EditableTable）

このコンポーネントは、テーブル内のセルを直接編集できる機能を提供します。商品マスタの詳細項目を編集するサンプル実装です。

## 機能

- テーブル内のセルを直接編集できる
- 列タイプに応じた異なる入力方法（ラベル、セレクト、テキスト入力）
- 行ごとの編集モード切り替え
- フォーム送信時にトーストでJSON形式の値を表示

## 使用技術

- React
- TypeScript
- Chakra UI
- Formik

## 実装詳細

### データモデル

```typescript
// 商品マスタの型定義
type Product = {
  id: number;
  code: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "active" | "inactive";
  description: string;
  lastUpdated: string;
};

// 列の設定を定義する型
type ColumnConfig = {
  key: keyof Product;
  header: string;
  type: "label" | "text" | "select" | "number";
  options?: { value: string; label: string }[]; // selectタイプの場合のオプション
  editable: boolean;
  width?: string;
};
```

### 主要コンポーネント

- **EditableCell**: セルタイプに基づいて適切な入力コンポーネントをレンダリング
- **EditableRow**: 行の編集モードを管理
- **App**: メインコンポーネント、Formikを使用してフォーム状態を管理

### 編集フロー

1. 初期状態では全ての行が表示モード
2. 行の「編集」ボタンをクリックすると、その行が編集モードに切り替わる
3. 編集モードでは、編集可能なセルが入力フィールドに変わる
4. 「保存」ボタンをクリックすると、その行の編集内容が保存され表示モードに戻る
5. 「キャンセル」ボタンをクリックすると、編集内容が破棄され表示モードに戻る
6. フォーム全体の「送信」ボタンをクリックすると、全ての変更がサーバーに送信される（今回はトーストで表示）

## スクリーンショット

![編集可能なテーブル](https://github.com/k-kawabata/react-sample-code/blob/main/src/views/editable-table/editable-table-screenshot.gif)
