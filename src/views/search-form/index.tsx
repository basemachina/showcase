import {
    Alert,
    Badge, Button,
    Card,
    Flexbox,
    Form, LoadingIndicator,
    Table,
    TextInput,
    DatePicker,
    Select,
    showSuccessToast,
} from "@basemachina/view";
import {
    HStack, VStack
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
        case ReviewStatus.BEFORE_REVIEW: return <Badge color="blue" title="審査中" />
        case ReviewStatus.PASSED_REVIEW: return <Badge color="green" title="承認" />
        case ReviewStatus.REJECTED: return <Badge color="red" title="非承認" />
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
    const [searchParams, setSearchParams] = useState(getInitialSearchParams());
    const [loading, setLoading] = useState(false);
    const [movies, setMovies] = useState<Movie[]>([]);

    const fetchMovies = useCallback(async () => {
        setLoading(true);
        try {
            // const result = await executeAction('get-movies', searchParams);
            // const movies = result.results[0].success
            // setMovies(movies);
            setMovies(mockMovies);
        } finally {
            setLoading(false);
        }
    }, [searchParams]);

    useEffect(() => {
        fetchMovies();
    }, [fetchMovies]);

    const handleSearch = useCallback(({ values }: { values: SearchParams }) => {
        setSearchParams({
            ...values,
        });
    }, []);

    const handleRowClick = useCallback((row: Movie) => {
        // openViewLink('movie-detail', { id: row.id }, {
        //     newTab: true,
        // });
        showSuccessToast(`動画ID: ${row.id} を選択しました`);
    }, []);

    return (
        <Flexbox direction="col" className="space-y-4">
            <Card>
                <Form
                    onSubmit={handleSearch}
                    initialValues={searchParams}
                >
                    <VStack spacing="1rem" align="start">
                        <HStack spacing="1rem">
                            <div>
                                <p className="text-xs font-bold mb-2">ユーザーID</p>
                                <TextInput
                                    name="user_id"
                                    label=""
                                    placeholder="ユーザーIDを入力"
                                />
                            </div>
                            <div>
                                <p className="text-xs font-bold mb-2">審査ステータス</p>
                                <div style={{ width: "120px" }}>
                                    <Select
                                        name="review_status"
                                        label=""
                                        options={ReviewStatusOptions}
                                    />
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-bold mb-2">投稿日</p>
                                <HStack spacing="0.5rem">
                                    <DatePicker
                                        name="created_at_from"
                                        label=""
                                    />
                                    <span>〜</span>
                                    <DatePicker
                                        name="created_at_to"
                                        label=""
                                    />
                                </HStack>
                            </div>
                        </HStack>

                        <HStack spacing="1rem">
                            <div>
                                <p className="text-xs font-bold mb-2">並び順</p>
                                <HStack spacing="0.5rem">
                                    <div style={{ width: "120px" }}>
                                        <Select
                                            name="order_by_key"
                                            label=""
                                            options={[{ value: "id", label: "ID" }, { value: "created_at", label: "投稿日" }, { value: "updated_at", label: "更新日" }]}
                                        />
                                    </div>
                                    <div style={{ width: "120px" }}>
                                        <Select
                                            name="order_by_direction"
                                            label=""
                                            options={[{ value: "asc", label: "昇順" }, { value: "desc", label: "降順" }]}
                                        />
                                    </div>
                                </HStack>
                            </div>
                        </HStack>

                        <Button type="submit" title="検索" color="blue" />
                    </VStack>
                </Form>
            </Card>

            {
                loading || !movies ? (
                    <LoadingIndicator />
                ) : (
                    <div className="w-full">
                        {movies.length === 0 ? (
                            <Alert message="検索結果がありません" color="blue" />
                        ) : (
                            <Table
                                rows={formatMovies(movies)}
                                columnNames={{
                                    id: "審査動画ID",
                                    name: "タイトル",
                                    review_status: "審査ステータス",
                                    user_id: "ユーザーID",
                                    user_name: "ユーザー名",
                                    created_at: "投稿日",
                                    updated_at: "更新日",
                                }}
                                downloadable
                                scrollable={true}
                                onRowClick={handleRowClick}
                            />
                        )}
                    </div>
                )
            }
        </Flexbox >
    );
};

export default App;
