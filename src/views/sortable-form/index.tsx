import {
    Heading,
    VStack,
    HStack,
    Box,
    Text,
    Card,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Input,
    Table as ChakraTable,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    useToast,
} from "@chakra-ui/react";
import { Formik, Form, Field, FieldProps } from "formik";
import { useCallback, useState } from "react";

// カテゴリ情報のモックデータ
const categoryData = {
    id: 1,
    name: "化粧品",
};

// 商品リストのモックデータ
const initialProductsData = [
    { id: 1, jinCode: "JIN-001", name: "ルミナスグロウ ファンデーション", order: 1 },
    { id: 2, jinCode: "JIN-002", name: "シルキーフィニッシュ パウダー", order: 2 },
    { id: 3, jinCode: "JIN-003", name: "ナチュラルグロス リップスティック", order: 3 },
    { id: 4, jinCode: "JIN-004", name: "ロングラスティング アイライナー", order: 4 },
    { id: 5, jinCode: "JIN-005", name: "ボリュームアップ マスカラ", order: 5 },
];

// 商品の型定義
type Product = {
    id: number;
    jinCode: string;
    name: string;
    order: number;
};

// フォームの値の型定義
type FormValues = {
    categoryName: string;
};

const App = () => {
    // 商品リストの状態
    const [products, setProducts] = useState<Product[]>(
        [...initialProductsData].sort((a, b) => a.order - b.order)
    );

    // 商品を上に移動する処理
    const moveUp = useCallback((index: number) => {
        if (index <= 0) return;

        const newProducts = [...products];
        const temp = newProducts[index];
        newProducts[index] = newProducts[index - 1];
        newProducts[index - 1] = temp;

        // orderの値を更新
        newProducts.forEach((product, i) => {
            product.order = i + 1;
        });

        setProducts(newProducts);
    }, [products]);

    // 商品を下に移動する処理
    const moveDown = useCallback((index: number) => {
        if (index >= products.length - 1) return;

        const newProducts = [...products];
        const temp = newProducts[index];
        newProducts[index] = newProducts[index + 1];
        newProducts[index + 1] = temp;

        // orderの値を更新
        newProducts.forEach((product, i) => {
            product.order = i + 1;
        });

        setProducts(newProducts);
    }, [products]);

    // フォーム送信処理
    const handleSubmit = useCallback((values: FormValues) => {
        const formData = {
            categoryId: categoryData.id,
            categoryName: values.categoryName,
            productOrders: products.map((product) => ({
                productId: product.id,
                order: product.order
            }))
        };

        // アクション実行（コメントアウト）
        // executeAction("update-category", formData);

        // 成功トーストでリクエストの内容を表示
        toast({
            title: "成功",
            description: `リクエスト内容: ${JSON.stringify(formData, null, 2)}`,
            status: "success",
            duration: 5000,
            isClosable: true,
        });
    }, [products]);

    const toast = useToast();

    return (
        <Flex direction="column" gap={2} w="full" h="full">
            <Heading size="sm">商品カテゴリ編集</Heading>
            <Card p={4}>
                <Formik
                    initialValues={{
                        categoryName: categoryData.name,
                    }}
                    onSubmit={handleSubmit}
                >
                    {({ handleSubmit }) => (
                        <Form onSubmit={handleSubmit}>
                            <VStack spacing="1rem" align="start">
                                <Box width="full">
                                    <Field name="categoryName">
                                        {({ field }: FieldProps) => (
                                            <FormControl>
                                                <FormLabel>カテゴリ名</FormLabel>
                                                <Input
                                                    {...field}
                                                    placeholder="カテゴリ名を入力"
                                                />
                                            </FormControl>
                                        )}
                                    </Field>
                                </Box>

                                <Box width="full">
                                    <Text fontWeight="bold" mb={2}>商品の表示順</Text>
                                    <Text fontSize="sm" mb={4}>上下ボタンで並び替えてください</Text>

                                    <TableContainer>
                                        <ChakraTable size="sm">
                                            <Thead>
                                                <Tr>
                                                    <Th>表示順</Th>
                                                    <Th>商品ID</Th>
                                                    <Th>JINコード</Th>
                                                    <Th>商品名</Th>
                                                    <Th>並び替え</Th>
                                                </Tr>
                                            </Thead>
                                            <Tbody>
                                                {products.map((product, index) => (
                                                    <Tr key={product.id}>
                                                        <Td>{product.order}</Td>
                                                        <Td>{product.id}</Td>
                                                        <Td>{product.jinCode}</Td>
                                                        <Td>{product.name}</Td>
                                                        <Td>
                                                            <HStack spacing={2}>
                                                                <Button
                                                                    size="xs"
                                                                    colorScheme="gray"
                                                                    isDisabled={index === 0}
                                                                    onClick={() => moveUp(index)}
                                                                >
                                                                    ↑
                                                                </Button>
                                                                <Button
                                                                    size="xs"
                                                                    colorScheme="gray"
                                                                    isDisabled={index === products.length - 1}
                                                                    onClick={() => moveDown(index)}
                                                                >
                                                                    ↓
                                                                </Button>
                                                            </HStack>
                                                        </Td>
                                                    </Tr>
                                                ))}
                                            </Tbody>
                                        </ChakraTable>
                                    </TableContainer>
                                </Box>

                                <Flex justify="flex-end" width="full" mt={4}>
                                    <Button type="submit" colorScheme="blue">
                                        保存
                                    </Button>
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
