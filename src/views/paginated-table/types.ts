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