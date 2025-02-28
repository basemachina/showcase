import {
    Card,
    Form,
    TextInput,
    Button,
    Table,
    showSuccessToast,
    Flexbox,
} from "@basemachina/view";
import {
    Heading,
    VStack,
    HStack,
    Box,
    Text,
} from "@chakra-ui/react";
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
        showSuccessToast(`リクエスト内容: ${JSON.stringify(formData, null, 2)}`);
    }, [products]);

    return (
        <div className="flex flex-col gap-2 w-full h-full">
            <Heading size="sm">商品カテゴリ編集</Heading>
            <Card>
                <Form
                    initialValues={{
                        categoryName: categoryData.name,
                    }}
                    onSubmit={handleSubmit}
                >
                    <VStack spacing="1rem" align="start">
                        <Box width="full">
                            <TextInput
                                name="categoryName"
                                label="カテゴリ名"
                                placeholder="カテゴリ名を入力"
                            />
                        </Box>

                        <Box width="full">
                            <Text fontWeight="bold" mb={2}>商品の表示順</Text>
                            <Text fontSize="sm" mb={4}>上下ボタンで並び替えてください</Text>

                            <Table
                                rows={products.map((product, index) => ({
                                    order: product.order,
                                    id: product.id,
                                    jinCode: product.jinCode,
                                    name: product.name,
                                    actions: (
                                        <HStack spacing={2}>
                                            <Button
                                                title="↑"
                                                size="xs"
                                                color="gray"
                                                disabled={index === 0}
                                                onClick={() => moveUp(index)}
                                            />
                                            <Button
                                                title="↓"
                                                size="xs"
                                                color="gray"
                                                disabled={index === products.length - 1}
                                                onClick={() => moveDown(index)}
                                            />
                                        </HStack>
                                    ),
                                }))}
                                columnNames={{
                                    order: "表示順",
                                    id: "商品ID",
                                    jinCode: "JINコード",
                                    name: "商品名",
                                    actions: "並び替え",
                                }}
                                searchDisabled={true}
                                scrollable={true}
                            />
                        </Box>

                        <Flexbox justify="end" width="full">
                            <Button type="submit" title="保存" color="blue" />
                        </Flexbox>
                    </VStack>
                </Form>
            </Card>
        </div>
    );
};

export default App;
