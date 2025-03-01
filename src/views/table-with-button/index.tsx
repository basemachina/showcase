import {
  openViewLink,
  // useExecuteActionLazy, // Commented out for mock implementation
} from "@basemachina/view";
import {
  HStack,
  Heading,
  Button,
  Badge,
  Flex,
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Center,
  Spinner,
  ButtonGroup,
  IconButton,
  Text
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
    return <Box p={4}>Error: {error.message}</Box>;
  }

  return (
    <Flex direction="column" gap={2} w="100%" h="100%">
      <Heading size="sm">プロモーション配信履歴</Heading>
      <Box w="100%">
        {!data || loading ? (
          <Center p={8}>
            <Spinner />
          </Center>
        ) : (
          <TableContainer>
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th>アカウント</Th>
                  <Th>報酬金額</Th>
                  <Th>報酬支払状況</Th>
                  <Th>配信日時</Th>
                  <Th>実績再生数</Th>
                  <Th>支払対象再生数</Th>
                  <Th>いいね数</Th>
                  <Th>コメント数</Th>
                  <Th>プロモーション対象</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.results[0].success.map((streamHistory: StreamHistory, index: number) => (
                  <Tr key={index}>
                    <Td>
                      <Button
                        colorScheme="gray"
                        variant="outline"
                        size="xs"
                        px="2"
                        minWidth="120px"
                        onClick={() => { }}
                      >
                        {streamHistory.account_id}
                      </Button>
                    </Td>
                    <Td>{`${streamHistory.revenue}円`}</Td>
                    <Td>
                      <PaymentStatusBadge status={streamHistory.payment_status} />
                    </Td>
                    <Td>{streamHistory.streamed_at}</Td>
                    <Td>{streamHistory.total_views}</Td>
                    <Td>{streamHistory.billable_views}</Td>
                    <Td>{streamHistory.favorites}</Td>
                    <Td>{streamHistory.comments}</Td>
                    <Td>
                      <Button
                        colorScheme="gray"
                        variant="outline"
                        size="xs"
                        width="120px"
                        onClick={handleItemButtonClick}
                      >
                        詳細
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Box>
      <Flex justifyContent="flex-start" alignItems="center" pb={2} gap={2}>
        <ButtonGroup size="sm" isAttached variant="outline">
          <IconButton
            aria-label="Previous page"
            icon={<Text>←</Text>}
            onClick={() => handleChangePage(Math.max(1, page - 1))}
            isDisabled={page <= 1}
          />
          <Button onClick={() => handleChangePage(1)} isActive={page === 1}>
            1
          </Button>
          {page > 3 && <Button isDisabled>...</Button>}
          {page > 2 && (
            <Button onClick={() => handleChangePage(page - 1)}>
              {page - 1}
            </Button>
          )}
          {page > 1 && page < 10 && (
            <Button isActive={true}>{page}</Button>
          )}
          {page < 9 && (
            <Button onClick={() => handleChangePage(page + 1)}>
              {page + 1}
            </Button>
          )}
          {page < 8 && <Button isDisabled>...</Button>}
          <Button onClick={() => handleChangePage(10)} isActive={page === 10}>
            10
          </Button>
          <IconButton
            aria-label="Next page"
            icon={<Text>→</Text>}
            onClick={() => handleChangePage(Math.min(10, page + 1))}
            isDisabled={page >= 10}
          />
        </ButtonGroup>
        <HStack>
          <Badge>現在のページ: {page}ページ目</Badge>
        </HStack>
      </Flex>
    </Flex>
  );
};

export default App;
