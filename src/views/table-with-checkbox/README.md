# チェックボックス付きテーブル（CheckboxTable）

複数行の選択機能とアクションボタンを持つテーブルです。

ユーザー一覧での一括操作などに利用できる汎用的な実装です。

## スクリーンショット

![スクリーンショット](https://github.com/basemachina/showcase/blob/main/src/views/table-with-checkbox/table-with-checkbox-screenshot.png)

## 機能

- 各行にチェックボックス付きのテーブル表示
- 全選択・全解除機能（ヘッダーのチェックボックス）
- 選択状態に応じたアクションボタンの有効化/無効化

### 汎用コンポーネント（CheckboxTable.tsx）

```typescript
// テーブル列の設定
export type TableColumn<T = any> = {
    key: keyof T;
    header: string;
    width?: string;
    render?: (value: any, item: T) => React.ReactNode;
};

// アクションボタンの設定
export type TableAction<T = any> = {
    label: string;
    onClick: (selectedItems: T[]) => void;
    requiresSelection?: boolean; // 選択必須かどうか（デフォルト: true）
};

// コンポーネントのProps
export interface CheckboxTableProps<T = any> {
    title?: string;
    data: T[];
    columns: TableColumn<T>[];
    actions?: TableAction<T>[];
    getItemId: (item: T) => string | number;
}
```

### 実装例（index.tsx）

```typescript
const columns: TableColumn<User>[] = [
    { key: "name", header: "名前" },
    { key: "email", header: "メールアドレス" },
    { key: "role", header: "役割" },
    {
        key: "status",
        header: "ステータス",
        render: (value: User["status"]) => (
            <Box /* カスタムスタイリング */>
                {value === "active" ? "アクティブ" : "非アクティブ"}
            </Box>
        ),
    },
];

const actions: TableAction<User>[] = [
    {
        label: "選択したユーザーに通知を送信",
        onClick: (selectedUsers) => {
            // 選択されたユーザーへの処理
        },
        requiresSelection: true, // 選択必須
    },
    {
        label: "全ユーザー統計を表示",
        onClick: (selectedUsers) => {
            // 全体統計の表示（選択不要）
        },
        requiresSelection: false, // 選択不要
    },
];
```

### 使用方法

```typescript
<CheckboxTable
    title="データ一覧"
    data={yourData}
    columns={columns}
    actions={actions}
    getItemId={(item) => item.id}
/>
```
