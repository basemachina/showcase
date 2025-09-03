# Markdown Editor

BaseMachina用のMarkdownエディタービューです。左側のテキストエリアにMarkdownを入力すると、右側にリアルタイムでプレビューが表示されます。

## 特徴

- **リアルタイムプレビュー**: 入力と同時にプレビューが更新されます
- **Chakra UI統合**: すべてのMarkdown要素がChakra UIコンポーネントでレンダリングされます
- **カスタムコンポーネント**: H1-H6はChakra UIのHeadingコンポーネントに置き換えられています
- **レスポンシブデザイン**: 画面サイズに応じてレイアウトが調整されます

## 使用技術

- **react-markdown**: Markdownのパース・レンダリング
- **Chakra UI**: UIコンポーネントライブラリ
- **React**: フロントエンドフレームワーク
- **TypeScript**: 型安全性

## サポートしているMarkdown記法

- 見出し (H1-H6) → Chakra UI Heading
- 段落 → Chakra UI Text
- リスト (順序あり・なし) → Chakra UI OrderedList/UnorderedList
- リンク → Chakra UI Link
- インラインコード・コードブロック → Chakra UI Code
- 引用 → カスタムスタイルのBox
- 水平線 → Chakra UI Divider
- 強調・太字 → デフォルトのHTML要素

## カスタムコンポーネント

すべてのMarkdown要素がChakra UIコンポーネントでレンダリングされるよう、カスタムコンポーネントマッピングを実装しています：

```typescript
const customComponents = {
    h1: ({ children, ...props }) => (
        <Heading as="h1" size="xl" mb={4} {...props}>
            {children}
        </Heading>
    ),
    // その他のコンポーネント...
};
```

## スタイリング

- コードブロックは灰色の背景とボーダーラディウス
- 引用は左側にボーダーと背景色
- リンクは青色でexternal指定
- 適切なマージンとパディング

## 拡張可能性

新しいMarkdown記法やカスタムスタイルを追加したい場合は、`customComponents`オブジェクトに新しいマッピングを追加するだけで簡単に拡張できます。