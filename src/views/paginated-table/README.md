# ページネーション付きテーブルコンポーネント

ベースマキナ向けの再利用可能なページネーション付きテーブルコンポーネントです。

![スクリーンショット](https://github.com/basemachina/showcase/blob/main/src/views/paginated-table/paginated-table-screenshot.png)

## 目的

このコンポーネントは、大量のデータを表示する際にユーザーが効率的にナビゲートできるよう、ページ分割機能を持ったテーブルを提供します。

## 機能要件

- シンプルなテーブル表示
- ページネーション機能（前/次ページボタン、ページ番号表示）
- モックデータ対応（約20件程度）
- カスタマイズ可能なカラム設定
- データ型に依存しない汎用的な設計
- 読み込み中、エラー、空データの適切な表示

## コンポーネント構成

### 1. 型定義（types.ts）

```typescript
import { ReactNode } from "react";

/**
 * カラム定義の型
 */
export type Column<T> = {
  key: keyof T; // データのキー
  header: string; // 表示見出し
  width?: string; // 列の幅（オプション）
  formatter?: (value: any, row: T) => ReactNode; // カスタム表示形式（オプション）
};

/**
 * ページネーションの状態
 */
export type PaginationState = {
  currentPage: number; // 現在のページ
  totalPages: number; // 総ページ数
  pageSize: number; // 1ページあたりの表示件数
  totalItems: number; // 総アイテム数
};

/**
 * PaginatedTableコンポーネントのプロップス
 */
export type PaginatedTableProps<T> = {
  data: T[]; // 表示データ
  columns: Column<T>[]; // カラム定義
  pagination: PaginationState; // ページネーションの状態
  onPageChange: (page: number) => void; // ページ変更ハンドラ
  loading?: boolean; // ロード中フラグ
  error?: Error | null; // エラー情報
  emptyMessage?: string; // データ無しの場合のメッセージ
};
```

### 2. メインコンポーネント（index.tsx）

```typescript
import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Flex,
  Button,
  Text,
  IconButton,
  Badge,
  ButtonGroup,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { Column, PaginatedTableProps } from "./types";

/**
 * ページネーション付きテーブルコンポーネント
 */
function PaginatedTable<T extends Record<string, any>>({
  data,
  columns,
  pagination,
  onPageChange,
  loading = false,
  error = null,
  emptyMessage = "データがありません",
}: PaginatedTableProps<T>) {
  const { currentPage, totalPages } = pagination;

  // ページ番号配列の生成
  const getPageNumbers = () => {
    const pageNumbers = [];
    // 最大5ページ分の番号を表示
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  if (loading) {
    return (
      <Center p={8}>
        <Spinner />
      </Center>
    );
  }

  if (error) {
    return (
      <Box p={4} bg="red.50" color="red.500" borderRadius="md">
        エラー: {error.message}
      </Box>
    );
  }

  return (
    <Box w="100%">
      <Table size="sm">
        <Thead>
          <Tr>
            {columns.map((column) => (
              <Th key={String(column.key)} width={column.width}>
                {column.header}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {data.length === 0 ? (
            <Tr>
              <Td colSpan={columns.length} textAlign="center">
                {emptyMessage}
              </Td>
            </Tr>
          ) : (
            data.map((row, rowIndex) => (
              <Tr key={rowIndex}>
                {columns.map((column) => (
                  <Td key={`${rowIndex}-${String(column.key)}`}>
                    {column.formatter
                      ? column.formatter(row[column.key], row)
                      : row[column.key]}
                  </Td>
                ))}
              </Tr>
            ))
          )}
        </Tbody>
      </Table>

      {/* ページネーション */}
      <Flex justifyContent="flex-start" alignItems="center" mt={4} pb={2} gap={2}>
        <ButtonGroup size="sm" isAttached variant="outline">
          <IconButton
            aria-label="Previous page"
            icon={<Text>←</Text>}
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            isDisabled={currentPage <= 1}
          />
          
          {getPageNumbers().map((page) => (
            <Button
              key={page}
              onClick={() => onPageChange(page)}
              isActive={page === currentPage}
            >
              {page}
            </Button>
          ))}
          
          <IconButton
            aria-label="Next page"
            icon={<Text>→</Text>}
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            isDisabled={currentPage >= totalPages}
          />
        </ButtonGroup>
        
        <Badge>
          現在のページ: {currentPage} / {totalPages}ページ
        </Badge>
      </Flex>
    </Box>
  );
}

export default PaginatedTable;
```

### 3. モックデータと使用例（demo.tsx）

```typescript
import React, { useState, useEffect } from "react";
import { Box, Heading, Flex } from "@chakra-ui/react";
import PaginatedTable from "./index";
import { formatDate } from "../utils/format";

// モックデータ型定義
type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  lastLogin: string;
};

// モックデータ
const mockUsers: User[] = [
  // 約20件のユーザーデータ
  { id: 1, name: "山田 太郎", email: "yamada@example.com", role: "管理者", status: "active", lastLogin: "2025-03-01T10:00:00" },
  { id: 2, name: "佐藤 花子", email: "sato@example.com", role: "一般ユーザー", status: "active", lastLogin: "2025-03-02T11:30:00" },
  { id: 3, name: "鈴木 一郎", email: "suzuki@example.com", role: "一般ユーザー", status: "inactive", lastLogin: "2025-02-25T09:15:00" },
  // ... 残りのモックデータ
];

// カラム定義
const columns = [
  { key: "id", header: "ID", width: "60px" },
  { key: "name", header: "氏名" },
  { key: "email", header: "メールアドレス" },
  { key: "role", header: "役割" },
  { 
    key: "status", 
    header: "ステータス",
    formatter: (value: "active" | "inactive") => 
      value === "active" ? "有効" : "無効" 
  },
  { 
    key: "lastLogin", 
    header: "最終ログイン",
    formatter: (value: string) => formatDate(value)
  },
];

// デモコンポーネント
const PaginatedTableDemo = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const pageSize = 5; // 1ページあたり5件表示
  
  // 総アイテム数
  const totalItems = mockUsers.length;
  
  // 総ページ数
  const totalPages = Math.ceil(totalItems / pageSize);
  
  // 現在のページのデータを取得
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * pageSize;
    return mockUsers.slice(startIndex, startIndex + pageSize);
  };
  
  // ページ変更時の処理
  const handlePageChange = (page: number) => {
    setLoading(true);
    setCurrentPage(page);
    
    // API呼び出しの代わりに遅延を追加
    setTimeout(() => {
      setLoading(false);
    }, 300);
  };
  
  return (
    <Flex direction="column" gap={4} w="100%">
      <Heading size="md">ユーザー一覧</Heading>
      
      <PaginatedTable
        data={getCurrentPageData()}
        columns={columns}
        pagination={{
          currentPage,
          totalPages,
          pageSize,
          totalItems
        }}
        onPageChange={handlePageChange}
        loading={loading}
        emptyMessage="ユーザーが見つかりません"
      />
    </Flex>
  );
};

export default PaginatedTableDemo;
```

## 実装計画

1. **第1フェーズ: 基本構造の実装**
   - `types.ts`の作成 - 型定義
   - `index.tsx`の実装 - コアコンポーネント
   - 基本的なページネーション機能

2. **第2フェーズ: デモと検証**
   - `demo.tsx`の実装 - サンプルユースケース
   - モックデータによる動作確認

3. **第3フェーズ: 拡張（必要に応じて）**
   - 項目数選択機能
   - 並べ替え機能
   - フィルタリング機能

## 使用方法

```tsx
import PaginatedTable from './views/paginated-table';

// データと列定義
const data = [...]; // 表示データ
const columns = [...]; // 列定義

// コンポーネント
function MyComponent() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  
  // 現在のページのデータを取得
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * pageSize;
    return data.slice(startIndex, startIndex + pageSize);
  };
  
  return (
    <PaginatedTable
      data={getCurrentPageData()}
      columns={columns}
      pagination={{
        currentPage,
        totalPages,
        pageSize,
        totalItems
      }}
      onPageChange={setCurrentPage}
    />
  );
}