import {
    Box,
    Button,
    Card,
    Checkbox,
    Heading,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    VStack,
    HStack,
} from "@chakra-ui/react";
import { useState } from "react";

export type TableColumn<T = any> = {
    key: keyof T;
    header: string;
    width?: string;
    render?: (value: any, item: T) => React.ReactNode;
};

export type TableAction<T = any> = {
    label: string;
    onClick: (selectedItems: T[]) => void;
    requiresSelection?: boolean;
};

export interface CheckboxTableProps<T = any> {
    title?: string;
    data: T[];
    columns: TableColumn<T>[];
    actions?: TableAction<T>[];
    getItemId: (item: T) => string | number;
}

export default function CheckboxTable<T = any>({
    title,
    data,
    columns,
    actions = [],
    getItemId,
}: CheckboxTableProps<T>) {
    const [selectedItems, setSelectedItems] = useState<Set<string | number>>(new Set());

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedItems(new Set(data.map(item => getItemId(item))));
        } else {
            setSelectedItems(new Set());
        }
    };

    const handleSelectItem = (itemId: string | number, checked: boolean) => {
        const newSelected = new Set(selectedItems);
        if (checked) {
            newSelected.add(itemId);
        } else {
            newSelected.delete(itemId);
        }
        setSelectedItems(newSelected);
    };

    const getSelectedData = () => {
        return data.filter(item => selectedItems.has(getItemId(item)));
    };

    const isAllSelected = selectedItems.size === data.length && data.length > 0;
    const isIndeterminate = selectedItems.size > 0 && selectedItems.size < data.length;
    const hasSelectedItems = selectedItems.size > 0;

    return (
        <VStack spacing={6} align="stretch">
            {title && (
                <Heading as="h1" size="lg">
                    {title}
                </Heading>
            )}

            <Card p={6}>
                <VStack spacing={4} align="stretch">
                    {actions.length > 0 && (
                        <HStack spacing={4} justify="flex-end">
                            {actions.map((action, index) => {
                                const isDisabled = action.requiresSelection !== false && !hasSelectedItems;
                                return (
                                    <Button
                                        key={index}
                                        bg="white"
                                        color="black"
                                        border="1px solid"
                                        borderColor="black"
                                        _hover={{ bg: isDisabled ? "white" : "gray.50" }}
                                        _disabled={{
                                            bg: "white",
                                            color: "gray.400",
                                            borderColor: "gray.300",
                                            cursor: "not-allowed"
                                        }}
                                        onClick={() => action.onClick(getSelectedData())}
                                        size="sm"
                                        isDisabled={isDisabled}
                                    >
                                        {action.label} {hasSelectedItems && action.requiresSelection !== false && `(${selectedItems.size}件)`}
                                    </Button>
                                );
                            })}
                        </HStack>
                    )}

                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th width="50px">
                                    <Checkbox
                                        isChecked={isAllSelected}
                                        isIndeterminate={isIndeterminate}
                                        onChange={(e) => handleSelectAll(e.target.checked)}
                                    />
                                </Th>
                                {columns.map((column, index) => (
                                    <Th key={index} width={column.width}>
                                        {column.header}
                                    </Th>
                                ))}
                            </Tr>
                        </Thead>
                        <Tbody>
                            {data.map((item) => {
                                const itemId = getItemId(item);
                                return (
                                    <Tr key={itemId}>
                                        <Td>
                                            <Checkbox
                                                isChecked={selectedItems.has(itemId)}
                                                onChange={(e) => handleSelectItem(itemId, e.target.checked)}
                                            />
                                        </Td>
                                        {columns.map((column, index) => (
                                            <Td key={index}>
                                                {column.render
                                                    ? column.render(item[column.key], item)
                                                    : String(item[column.key])
                                                }
                                            </Td>
                                        ))}
                                    </Tr>
                                );
                            })}
                        </Tbody>
                    </Table>
                </VStack>
            </Card>
        </VStack>
    );
}