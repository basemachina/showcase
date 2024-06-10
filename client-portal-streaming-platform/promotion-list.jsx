import { Table, Pagination, openViewLink } from "@basemachina/view";
import {
  HStack,
  Heading,
  Button as ChakraButton,
  Badge,
} from "@chakra-ui/react";
import { useCallback } from "react";

const streamHistories = [
  {
    item_id: "xxx",
    account_id: "@f_fukufuku",
    total_views: "300,223",
    favorites: "23",
    comments: "300",
    billable_views: "150,000",
    revenue: "102,000",
    payment_status: "未支払い",
    streamed_at: "2024-04-10 12:00",
  },
  {
    item_id: "xxx",
    account_id: "@yeonmi_park",
    total_views: "1,000,223",
    favorites: "123",
    comments: "1,300",
    billable_views: "150,000",
    revenue: "202,000",
    payment_status: "未支払い",
    streamed_at: "2024-04-09 12:00",
  },
  {
    item_id: "xxx",
    account_id: "@kazuma_kawaguchi",
    total_views: "2,000,223",
    favorites: "223",
    comments: "2,300",
    billable_views: "200,000",
    revenue: "302,000",
    payment_status: "未支払い",
    streamed_at: "2024-04-08 12:00",
  },
  {
    item_id: "xxx",
    account_id: "@yukio_takano",
    total_views: "3,000,223",
    favorites: "323",
    comments: "3,300",
    billable_views: "300,000",
    revenue: "402,000",
    payment_status: "未支払い",
    streamed_at: "2024-04-07 12:00",
  },
  {
    item_id: "xxx",
    account_id: "@kazuma_kawaguchi",
    total_views: "4,000,223",
    favorites: "423",
    comments: "4,300",
    billable_views: "150,000",
    revenue: "502,000",
    payment_status: "未支払い",
    streamed_at: "2024-04-06 12:00",
  },
  {
    item_id: "xxx",
    account_id: "@yukio_takano",
    total_views: "5,000,223",
    favorites: "523",
    comments: "5,300",
    billable_views: "150,000",
    revenue: "602,000",
    payment_status: "支払済み",
    streamed_at: "2024-03-29 12:00",
  },
  {
    item_id: "xxx",
    account_id: "@kazuma_kawaguchi",
    total_views: "6,000,223",
    favorites: "623",
    comments: "6,300",
    billable_views: "500,000",
    revenue: "702,000",
    payment_status: "支払済み",
    streamed_at: "2024-03-22 12:00",
  },
  {
    item_id: "xxx",
    account_id: "@yukio_takano",
    total_views: "7,000,223",
    favorites: "723",
    comments: "7,300",
    billable_views: "500,000",
    revenue: "802,000",
    payment_status: "支払済み",
    streamed_at: "2024-03-20 12:00",
  },
  {
    item_id: "xxx",
    account_id: "@kazuma_kawaguchi",
    total_views: "8,000,223",
    favorites: "823",
    comments: "8,300",
    billable_views: "500,000",
    revenue: "902,000",
    payment_status: "支払済み",
    streamed_at: "2024-03-18 12:00",
  },
  {
    item_id: "xxx",
    account_id: "@yukio_takano",
    total_views: "9,000,223",
    favorites: "923",
    comments: "9,300",
    billable_views: "500,000",
    revenue: "1,002,000",
    payment_status: "支払済み",
    streamed_at: "2024-03-15 12:00",
  },
  {
    item_id: "xxx",
    account_id: "@kazuma_kawaguchi",
    total_views: "10,000,223",
    favorites: "1,023",
    comments: "10,300",
    billable_views: "500,000",
    revenue: "1,102,000",
    payment_status: "支払済み",
    streamed_at: "2024-03-12 12:00",
  },
  {
    item_id: "xxx",
    account_id: "@yukio_takano",
    total_views: "11,000,223",
    favorites: "1,123",
    comments: "11,300",
    billable_views: "500,000",
    revenue: "1,202,000",
    payment_status: "支払済み",
    streamed_at: "2024-03-10 12:00",
  },
  {
    item_id: "xxx",
    account_id: "@kazuma_kawaguchi",
    total_views: "12,000,223",
    favorites: "1,223",
    comments: "12,300",
    billable_views: "500,000",
    revenue: "1,302,000",
    payment_status: "支払済み",
    streamed_at: "2024-03-08 12:00",
  },
];

const PaymentStatusBadge = ({ status }) => {
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
  const handleItemButtonClick = useCallback(() => {
    openViewLink("promotion-target-detail");
  }, []);

  return (
    <div className="flex flex-col gap-2 w-full h-full">
      <Heading size="sm">プロモーション配信履歴</Heading>
      <div className="flex-auto w-full">
        <Table
          rows={
            streamHistories.map((streamHistory) => {
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
      </div>
      <div className="flex-none flex space-x-2 pb-2">
        <Pagination
          currentPage={1}
          itemsPerPage={20}
          totalItems={300}
          onChange={() => {}}
        />
        <HStack>
          <Badge>全300件 (15ページ)</Badge>
        </HStack>
      </div>
    </div>
  );
};

export default App;
