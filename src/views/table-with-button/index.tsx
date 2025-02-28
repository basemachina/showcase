import {
  Table,
  Pagination,
  openViewLink,
  LoadingIndicator,
  // useExecuteActionLazy, // Commented out for mock implementation
} from "@basemachina/view";
import {
  HStack,
  Heading,
  Button as ChakraButton,
  Badge,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";

// Mock implementations for the action hooks
// Define mock data for StreamHistory objects
const mockStreamHistories: StreamHistory[] = [
  {
    account_id: "account123",
    revenue: 5000,
    payment_status: "未支払い",
    streamed_at: "2025-02-25T15:30:00",
    total_views: 1500,
    billable_views: 1200,
    favorites: 45,
    comments: 12
  },
  {
    account_id: "account456",
    revenue: 7500,
    payment_status: "支払済み",
    streamed_at: "2025-02-24T12:15:00",
    total_views: 2300,
    billable_views: 2000,
    favorites: 78,
    comments: 25
  },
  {
    account_id: "account789",
    revenue: 3200,
    payment_status: "未支払い",
    streamed_at: "2025-02-23T09:45:00",
    total_views: 1200,
    billable_views: 950,
    favorites: 32,
    comments: 8
  }
];

type StreamHistory = {
  account_id: string;
  revenue: number;
  payment_status: "未支払い" | "支払済み";
  streamed_at: string;
  total_views: number;
  billable_views: number;
  favorites: number;
  comments: number;
};

const PaymentStatusBadge = ({
  status,
}: {
  status: "未支払い" | "支払済み";
}) => {
  return (
    <Badge
      colorScheme={status === "未支払い" ? "red" : "green"}
      variant="subtle"
    >
      {status}
    </Badge>
  );
};

const App = () => {
  const [page, setPage] = useState(1);
  // const [getStreamingHistories, { data, loading, error }] =
  //   useExecuteActionLazy("get-stream-histories");

  // Mock implementation
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ message: string } | null>(null);
  const [data, setData] = useState<{ results: [{ success: StreamHistory[] }] } | null>(null);

  const handleItemButtonClick = useCallback(() => {
    openViewLink("promotion-target-detail");
  }, []);

  const handleChangePage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  useEffect(() => {
    // Simulate loading data
    setLoading(true);
    setTimeout(() => {
      setData({
        results: [{
          success: mockStreamHistories
        }]
      });
      setLoading(false);
    }, 500);
  }, [page]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="flex flex-col gap-2 w-full h-full">
      <Heading size="sm">プロモーション配信履歴</Heading>
      <div className="flex w-full">
        {!data || loading ? (
          <LoadingIndicator />
        ) : (
          <Table
            rows={
              data.results[0].success.map((streamHistory: StreamHistory) => {
                return {
                  account: (
                    <ChakraButton
                      colorScheme="gray"
                      variant="outline"
                      size="xs"
                      px="2"
                      minWidth="120px"
                      onClick={() => { }}
                    >
                      {streamHistory.account_id}
                    </ChakraButton>
                  ),
                  revenue: `${streamHistory.revenue}円`,
                  payment_status: (
                    <PaymentStatusBadge status={streamHistory.payment_status} />
                  ),
                  streamed_at: streamHistory.streamed_at,
                  total_views: streamHistory.total_views,
                  billable_views: streamHistory.billable_views,
                  favorites: streamHistory.favorites,
                  comments: streamHistory.comments,
                  item_id: (
                    <ChakraButton
                      colorScheme="gray"
                      variant="outline"
                      size="xs"
                      width="120px"
                      onClick={handleItemButtonClick}
                    >
                      詳細
                    </ChakraButton>
                  ),
                };
              }) ?? []
            }
            columnNames={{
              account: "アカウント",
              revenue: "報酬金額",
              payment_status: "報酬支払状況",
              streamed_at: "配信日時",
              total_views: "実績再生数",
              billable_views: "支払対象再生数",
              favorites: "いいね数",
              comments: "コメント数",
              item_id: "プロモーション対象",
            }}
            searchDisabled={true}
            scrollable={true}
          />
        )}
      </div>
      <div className="flex-none flex space-x-2 pb-2">
        <Pagination currentPage={page} onChange={handleChangePage} />
        <HStack>
          <Badge>現在のページ: {page}ページ目</Badge>
        </HStack>
      </div>
    </div>
  );
};

export default App;
