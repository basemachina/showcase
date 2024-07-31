import {
  Table,
  Pagination,
  openViewLink,
  LoadingIndicator,
  useExecuteActionLazy,
} from "@basemachina/view";
import {
  HStack,
  Heading,
  Button as ChakraButton,
  Badge,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";

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
  const [getStreamingHistories, { data, loading, error }] =
    useExecuteActionLazy("get-stream-histories");

  const handleItemButtonClick = useCallback(() => {
    openViewLink("promotion-target-detail");
  }, []);

  const handleChangePage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  useEffect(() => {
    getStreamingHistories({
      page,
    });
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
                      onClick={() => {}}
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
