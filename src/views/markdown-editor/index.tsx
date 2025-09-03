import {
    Box,
    HStack,
    Textarea,
    Heading,
    Text,
    Link,
    OrderedList,
    UnorderedList,
    ListItem,
    Code,
    Divider,
    Card
} from "@chakra-ui/react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

const defaultMarkdown = `# Hello, Markdown Editor!

これは**react-markdown**を使ったMarkdownエディターです。

## 機能

- リアルタイムプレビュー
- Chakra UIコンポーネントとの統合
- H1はChakra UIのHeadingに置き換え済み

### リスト例

1. 順序ありリスト
2. 2番目の項目
3. 3番目の項目

- 順序なしリスト
- 別の項目
- さらに別の項目

### コード例

インラインコード: \`const hello = "world"\`

\`\`\`
function greeting(name) {
    return \`Hello, \${name}!\`;
}

console.log(greeting("BaseMachina"));
\`\`\`

### リンク

[BaseMachina公式サイト](https://basemachina.com)

---

左側のテキストエリアにMarkdownを入力すると、右側にリアルタイムでプレビューが表示されます。
`;

const customComponents = {
    h1: ({ children, ...props }: any) => (
        <Heading as="h1" size="xl" mb={4} {...props}>
            {children}
        </Heading>
    ),
    h2: ({ children, ...props }: any) => (
        <Heading as="h2" size="lg" mb={3} {...props}>
            {children}
        </Heading>
    ),
    h3: ({ children, ...props }: any) => (
        <Heading as="h3" size="md" mb={2} {...props}>
            {children}
        </Heading>
    ),
    h4: ({ children, ...props }: any) => (
        <Heading as="h4" size="sm" mb={2} {...props}>
            {children}
        </Heading>
    ),
    h5: ({ children, ...props }: any) => (
        <Heading as="h5" size="xs" mb={2} {...props}>
            {children}
        </Heading>
    ),
    h6: ({ children, ...props }: any) => (
        <Heading as="h6" size="xs" mb={2} {...props}>
            {children}
        </Heading>
    ),
    p: ({ children, ...props }: any) => (
        <Text mb={4} {...props}>
            {children}
        </Text>
    ),
    a: ({ children, href, ...props }: any) => (
        <Link href={href} color="blue.500" isExternal {...props}>
            {children}
        </Link>
    ),
    ol: ({ children, ...props }: any) => (
        <OrderedList mb={4} {...props}>
            {children}
        </OrderedList>
    ),
    ul: ({ children, ...props }: any) => (
        <UnorderedList mb={4} {...props}>
            {children}
        </UnorderedList>
    ),
    li: ({ children, ...props }: any) => (
        <ListItem {...props}>
            {children}
        </ListItem>
    ),
    code: ({ children, inline, ...props }: any) => {
        if (inline) {
            return (
                <Code colorScheme="gray" {...props}>
                    {children}
                </Code>
            );
        }
        return (
            <Box
                as="pre"
                bg="gray.100"
                p={4}
                borderRadius="md"
                overflowX="auto"
                mb={4}
                {...props}
            >
                <Code colorScheme="gray" display="block">
                    {children}
                </Code>
            </Box>
        );
    },
    hr: (props: any) => <Divider my={6} {...props} />,
    blockquote: ({ children, ...props }: any) => (
        <Box
            borderLeft="4px solid"
            borderColor="gray.300"
            pl={4}
            py={2}
            mb={4}
            bg="gray.50"
            fontStyle="italic"
            {...props}
        >
            {children}
        </Box>
    )
};

const App = () => {
    const [markdown, setMarkdown] = useState(defaultMarkdown);

    const handleMarkdownChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMarkdown(e.target.value);
    };

    return (
        <HStack spacing={4} height="100vh" p={4}>
            <Card width="50%" height="100%" p={4}>
                <Heading as="h2" size="md" mb={4}>
                    Markdownエディター
                </Heading>
                <Textarea
                    value={markdown}
                    onChange={handleMarkdownChange}
                    height="85%"
                    fontFamily="monospace"
                    resize="none"
                    placeholder="ここにMarkdownを入力してください..."
                />
            </Card>
            
            <Card width="50%" height="100%" p={4} overflowY="auto">
                <Heading as="h2" size="md" mb={4}>
                    プレビュー
                </Heading>
                <Box>
                    <ReactMarkdown components={customComponents}>
                        {markdown}
                    </ReactMarkdown>
                </Box>
            </Card>
        </HStack>
    );
};

export default App;