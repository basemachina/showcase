import {
    Alert,
    AlertIcon,
    Badge,
    Button,
    Card,
    Flex,
    FormControl,
    FormLabel,
    Input,
    Select,
    Spinner,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Text,
    Box,
    HStack,
    VStack,
    useToast
} from "@chakra-ui/react";
import { useCallback, useState, useEffect } from "react";
import { formatDate, formatNull } from "../utils/format";

type Movie = {
    id: string;
    name: string;
    user_id: string;
    user_name: string;
    review_status: ReviewStatus;
    created_at: string;
    updated_at: string;
}

export enum ReviewStatus {
    BEFORE_REVIEW = 0,
    PASSED_REVIEW = 1,
    REJECTED = 2,
}

export type ReviewStatusLabel = "審査中" | "承認" | "非承認"

export const formatReviewStatus = (status: ReviewStatus): ReviewStatusLabel => {
    switch (status) {
        case ReviewStatus.BEFORE_REVIEW: return "審査中"
        case ReviewStatus.PASSED_REVIEW: return "承認"
        case ReviewStatus.REJECTED: return "非承認"
    }
}

const ReviewStatusOptions = [
    { value: ReviewStatus.BEFORE_REVIEW, label: formatReviewStatus(ReviewStatus.BEFORE_REVIEW) },
    { value: ReviewStatus.PASSED_REVIEW, label: formatReviewStatus(ReviewStatus.PASSED_REVIEW) },
    { value: ReviewStatus.REJECTED, label: formatReviewStatus(ReviewStatus.REJECTED) },
]

const displayReviewStatusBadge = (status: ReviewStatus) => {
    switch (status) {
        case ReviewStatus.BEFORE_REVIEW:
            return <Badge colorScheme="blue">審査中</Badge>
        case ReviewStatus.PASSED_REVIEW:
            return <Badge colorScheme="green">承認</Badge>
        case ReviewStatus.REJECTED:
            return <Badge colorScheme="red">非承認</Badge>
    }
}


const formatMovies = (movies: Movie[]) => {
    return movies.map((movie) => ({
        id: movie.id,
        name: movie.name,
        user_id: movie.user_id,
        user_name: formatNull(movie.user_name),
        review_status: displayReviewStatusBadge(movie.review_status),
        created_at: formatDate(movie.created_at),
        updated_at: formatDate(movie.updated_at),
    }));
}

type SearchParams = {
    campaign_name: string;
    created_at_from: string;
    created_at_to: string;
    user_id: string;
    review_status: ReviewStatus;
    order_by_key: string
    order_by_direction: string
}

const mockMovies: Movie[] = [
    {
        id: "1",
        name: "テスト動画1",
        user_id: "1",
        user_name: "テストユーザー1",
        review_status: 0,
        created_at: "2021-01-01",
        updated_at: "2021-01-01"
    },
    {
        id: "2",
        name: "テスト動画2",
        user_id: "2",
        user_name: "テストユーザー2",
        review_status: 1,
        created_at: "2021-01-02",
        updated_at: "2021-01-02"
    },
    {
        id: "3",
        name: "テスト動画3",
        user_id: "3",
        user_name: "テストユーザー3",
        review_status: 2,
        created_at: "2021-01-03",
        updated_at: "2021-01-03"
    }
] as const;

const getInitialSearchParams = (): SearchParams => {
    return {
        campaign_name: "",
        created_at_from: "",
        created_at_to: "",
        user_id: "",
        review_status: 0,
        order_by_key: "created_at",
        order_by_direction: "asc"
    }
}

const App = () => {
    const [formValues, setFormValues] = useState<SearchParams>(getInitialSearchParams());
    const [loading, setLoading] = useState(false);
    const [movies, setMovies] = useState<Movie[]>([]);

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormValues(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Update search params and fetch movies
        setTimeout(() => {
            setMovies(mockMovies);
            setLoading(false);
        }, 500);
    }, []);

    const toast = useToast();

    const handleRowClick = useCallback((row: Movie) => {
        // openViewLink('movie-detail', { id: row.id }, {
        //     newTab: true,
        // });
        toast({
            title: "成功",
            description: `動画ID: ${row.id} を選択しました`,
            status: "success",
            duration: 5000,
            isClosable: true,
        });
    }, [toast]);

    return (
        <Flex direction="column" gap={4}>
            <Card p={4}>
                <form onSubmit={handleSubmit}>
                    <VStack spacing="1rem" align="start">
                        <HStack spacing="1rem">
                            <Box>
                                <Text fontSize="xs" fontWeight="bold" mb={2}>ユーザーID</Text>
                                <FormControl>
                                    <Input
                                        name="user_id"
                                        value={formValues.user_id}
                                        onChange={handleInputChange}
                                        placeholder="ユーザーIDを入力"
                                    />
                                </FormControl>
                            </Box>
                            <Box>
                                <Text fontSize="xs" fontWeight="bold" mb={2}>審査ステータス</Text>
                                <Box width="120px">
                                    <FormControl>
                                        <Select
                                            name="review_status"
                                            value={formValues.review_status}
                                            onChange={handleInputChange}
                                        >
                                            {ReviewStatusOptions.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Box>
                            <Box>
                                <Text fontSize="xs" fontWeight="bold" mb={2}>投稿日</Text>
                                <HStack spacing="0.5rem">
                                    <FormControl>
                                        <Input
                                            name="created_at_from"
                                            value={formValues.created_at_from}
                                            onChange={handleInputChange}
                                            type="date"
                                        />
                                    </FormControl>
                                    <Text>〜</Text>
                                    <FormControl>
                                        <Input
                                            name="created_at_to"
                                            value={formValues.created_at_to}
                                            onChange={handleInputChange}
                                            type="date"
                                        />
                                    </FormControl>
                                </HStack>
                            </Box>
                        </HStack>

                        <HStack spacing="1rem">
                            <Box>
                                <Text fontSize="xs" fontWeight="bold" mb={2}>並び順</Text>
                                <HStack spacing="0.5rem">
                                    <Box width="120px">
                                        <FormControl>
                                            <Select
                                                name="order_by_key"
                                                value={formValues.order_by_key}
                                                onChange={handleInputChange}
                                            >
                                                <option value="id">ID</option>
                                                <option value="created_at">投稿日</option>
                                                <option value="updated_at">更新日</option>
                                            </Select>
                                        </FormControl>
                                    </Box>
                                    <Box width="120px">
                                        <FormControl>
                                            <Select
                                                name="order_by_direction"
                                                value={formValues.order_by_direction}
                                                onChange={handleInputChange}
                                            >
                                                <option value="asc">昇順</option>
                                                <option value="desc">降順</option>
                                            </Select>
                                        </FormControl>
                                    </Box>
                                </HStack>
                            </Box>
                        </HStack>

                        <Button type="submit" colorScheme="blue">
                            検索
                        </Button>
                    </VStack>
                </form>
            </Card>

            {
                loading || !movies ? (
                    <Box textAlign="center" py={4}>
                        <Spinner />
                    </Box>
                ) : (
                    <Box width="full">
                        {movies.length === 0 ? (
                            <Alert status="info">
                                <AlertIcon />
                                検索結果がありません
                            </Alert>
                        ) : (
                            <TableContainer>
                                <Table size="sm">
                                    <Thead>
                                        <Tr>
                                            <Th>審査動画ID</Th>
                                            <Th>タイトル</Th>
                                            <Th>審査ステータス</Th>
                                            <Th>ユーザーID</Th>
                                            <Th>ユーザー名</Th>
                                            <Th>投稿日</Th>
                                            <Th>更新日</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {formatMovies(movies).map((movie) => (
                                            <Tr
                                                key={movie.id}
                                                onClick={() => handleRowClick(movies.find(m => m.id === movie.id) as Movie)}
                                                cursor="pointer"
                                                _hover={{ bg: "gray.50" }}
                                            >
                                                <Td>{movie.id}</Td>
                                                <Td>{movie.name}</Td>
                                                <Td>{movie.review_status}</Td>
                                                <Td>{movie.user_id}</Td>
                                                <Td>{movie.user_name}</Td>
                                                <Td>{movie.created_at}</Td>
                                                <Td>{movie.updated_at}</Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        )}
                    </Box>
                )
            }
        </Flex>
    );
};

export default App;
