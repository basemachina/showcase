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
    // メモ化して不要な再計算を防ぐ
    const pageNumbers = React.useMemo(() => {
        const numbers = [];
        // 最大5ページ分の番号を表示
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);

        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }

        for (let i = startPage; i <= endPage; i++) {
            numbers.push(i);
        }
        return numbers;
    }, [currentPage, totalPages]); // 依存配列を指定

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

                    {pageNumbers.map((page) => (
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