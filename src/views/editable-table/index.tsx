import {
    Box,
    Button,
    Card,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    HStack,
    IconButton,
    Input,
    NumberInput,
    NumberInputField,
    Select,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useToast,
    VStack,
} from "@chakra-ui/react";
import { Field, FieldProps, Form, Formik, useFormikContext } from "formik";
import { useCallback, useState } from "react";

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

// 商品マスタのモックデータ
const initialProducts: Product[] = [
    {
        id: 1,
        code: "P001",
        name: "ルミナスグロウ ファンデーション",
        category: "makeup",
        price: 3800,
        stock: 120,
        status: "active",
        description: "軽いつけ心地で自然な輝きを与えるファンデーション",
        lastUpdated: "2025-02-15",
    },
    {
        id: 2,
        code: "P002",
        name: "シルキーフィニッシュ パウダー",
        category: "makeup",
        price: 2500,
        stock: 85,
        status: "active",
        description: "肌をなめらかに整えるフェイスパウダー",
        lastUpdated: "2025-02-18",
    },
    {
        id: 3,
        code: "P003",
        name: "ナチュラルグロス リップスティック",
        category: "lips",
        price: 1800,
        stock: 200,
        status: "active",
        description: "潤いを与える自然な発色のリップスティック",
        lastUpdated: "2025-02-20",
    },
    {
        id: 4,
        code: "P004",
        name: "ロングラスティング アイライナー",
        category: "eyes",
        price: 1500,
        stock: 0,
        status: "inactive",
        description: "にじまないウォータープルーフアイライナー",
        lastUpdated: "2025-02-22",
    },
    {
        id: 5,
        code: "P005",
        name: "ボリュームアップ マスカラ",
        category: "eyes",
        price: 2200,
        stock: 150,
        status: "active",
        description: "まつげにボリュームを与えるマスカラ",
        lastUpdated: "2025-02-25",
    },
];

// 列の設定
const columnConfigs: ColumnConfig[] = [
    { key: "id", header: "ID", type: "label", editable: false, width: "60px" },
    { key: "code", header: "商品コード", type: "label", editable: false, width: "120px" },
    { key: "name", header: "商品名", type: "text", editable: true },
    {
        key: "category",
        header: "カテゴリ",
        type: "select",
        options: [
            { value: "makeup", label: "メイクアップ" },
            { value: "skincare", label: "スキンケア" },
            { value: "lips", label: "リップ" },
            { value: "eyes", label: "アイ" },
        ],
        editable: true,
        width: "150px",
    },
    { key: "price", header: "価格", type: "number", editable: true, width: "120px" },
    { key: "stock", header: "在庫数", type: "number", editable: true, width: "120px" },
    {
        key: "status",
        header: "ステータス",
        type: "select",
        options: [
            { value: "active", label: "有効" },
            { value: "inactive", label: "無効" },
        ],
        editable: true,
        width: "120px",
    },
    { key: "description", header: "説明", type: "text", editable: true },
    { key: "lastUpdated", header: "最終更新日", type: "label", editable: false, width: "120px" },
];

// カテゴリの表示名を取得する関数
const getCategoryLabel = (value: string): string => {
    const category = columnConfigs
        .find((config) => config.key === "category")
        ?.options?.find((option) => option.value === value);
    return category?.label || value;
};

// ステータスの表示名を取得する関数
const getStatusLabel = (value: string): string => {
    const status = columnConfigs
        .find((config) => config.key === "status")
        ?.options?.find((option) => option.value === value);
    return status?.label || value;
};

// 表示用のフォーマット関数
const formatValue = (value: any, columnKey: keyof Product): string => {
    if (value === undefined || value === null) return "";

    switch (columnKey) {
        case "category":
            return getCategoryLabel(value);
        case "status":
            return getStatusLabel(value);
        case "price":
            return `${value.toLocaleString()}円`;
        default:
            return String(value);
    }
};

// 編集可能なセルコンポーネント
const EditableCell: React.FC<{
    product: Product;
    columnConfig: ColumnConfig;
    isEditing: boolean;
}> = ({ product, columnConfig, isEditing }) => {
    const { key, type, options, editable } = columnConfig;
    const value = product[key];

    if (!isEditing || !editable) {
        return <Text>{formatValue(value, key)}</Text>;
    }

    switch (type) {
        case "text":
            return (
                <Field name={`products.${product.id - 1}.${key}`}>
                    {({ field }: FieldProps) => (
                        <Input {...field} size="sm" />
                    )}
                </Field>
            );
        case "select":
            return (
                <Field name={`products.${product.id - 1}.${key}`}>
                    {({ field }: FieldProps) => (
                        <Select {...field} size="sm">
                            {options?.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </Select>
                    )}
                </Field>
            );
        case "number":
            return (
                <Field name={`products.${product.id - 1}.${key}`}>
                    {({ field, form }: FieldProps) => (
                        <NumberInput
                            size="sm"
                            value={field.value}
                            onChange={(valueString) => {
                                form.setFieldValue(field.name, parseInt(valueString) || 0);
                            }}
                        >
                            <NumberInputField />
                        </NumberInput>
                    )}
                </Field>
            );
        default:
            return <Text>{formatValue(value, key)}</Text>;
    }
};

// 編集可能な行コンポーネント
const EditableRow: React.FC<{
    product: Product;
    isEditing: boolean;
    onEdit: () => void;
    onCancel: () => void;
    onSave: () => void;
}> = ({ product, isEditing, onEdit, onCancel, onSave }) => {
    return (
        <Tr bg={isEditing ? "gray.50" : undefined}>
            {columnConfigs.map((columnConfig) => (
                <Td key={String(columnConfig.key)} width={columnConfig.width}>
                    <EditableCell
                        product={product}
                        columnConfig={columnConfig}
                        isEditing={isEditing}
                    />
                </Td>
            ))}
            <Td width="120px">
                {isEditing ? (
                    <HStack spacing={2}>
                        <Button size="xs" colorScheme="blue" onClick={onSave}>
                            保存
                        </Button>
                        <Button size="xs" onClick={onCancel}>
                            キャンセル
                        </Button>
                    </HStack>
                ) : (
                    <Button size="xs" onClick={onEdit}>
                        編集
                    </Button>
                )}
            </Td>
        </Tr>
    );
};

// フォームの送信ボタンコンポーネント
const SubmitButton: React.FC = () => {
    const { isSubmitting } = useFormikContext();
    return (
        <Button
            type="submit"
            colorScheme="blue"
            isLoading={isSubmitting}
            loadingText="送信中"
        >
            送信
        </Button>
    );
};

// メインコンポーネント
const App = () => {
    const [editingRowId, setEditingRowId] = useState<number | null>(null);
    const toast = useToast();

    // 編集モード切り替え処理
    const handleEditRow = useCallback((id: number) => {
        setEditingRowId(id);
    }, []);

    const handleCancelEdit = useCallback(() => {
        setEditingRowId(null);
    }, []);

    const handleSaveRow = useCallback(() => {
        setEditingRowId(null);
    }, []);

    // フォーム送信処理
    const handleSubmit = useCallback((values: { products: Product[] }, { resetForm, setSubmitting }: any) => {
        toast({
            title: "送信成功",
            description: (
                <Box maxH="300px" overflowY="auto">
                    <pre>{JSON.stringify(values, null, 2)}</pre>
                </Box>
            ),
            status: "success",
            duration: 5000,
            isClosable: true,
        });

        // フォームの送信状態をリセット
        setTimeout(() => {
            setSubmitting(false);
        }, 500);
    }, [toast]);

    return (
        <Flex direction="column" gap={4} w="full" h="full">
            <Heading size="sm">商品マスタ編集</Heading>
            <Card p={4}>
                <Formik
                    initialValues={{ products: initialProducts }}
                    onSubmit={handleSubmit}
                >
                    {({ values }) => (
                        <Form>
                            <VStack spacing="1rem" align="start">
                                <Box width="full" overflowX="auto">
                                    <Table size="sm">
                                        <Thead>
                                            <Tr>
                                                {columnConfigs.map((config) => (
                                                    <Th key={String(config.key)} width={config.width}>
                                                        {config.header}
                                                    </Th>
                                                ))}
                                                <Th width="120px">操作</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {values.products.map((product) => (
                                                <EditableRow
                                                    key={product.id}
                                                    product={product}
                                                    isEditing={editingRowId === product.id}
                                                    onEdit={() => handleEditRow(product.id)}
                                                    onCancel={handleCancelEdit}
                                                    onSave={handleSaveRow}
                                                />
                                            ))}
                                        </Tbody>
                                    </Table>
                                </Box>

                                <Flex justify="flex-end" width="full" mt={4}>
                                    <SubmitButton />
                                </Flex>
                            </VStack>
                        </Form>
                    )}
                </Formik>
            </Card>
        </Flex>
    );
};

export default App;
