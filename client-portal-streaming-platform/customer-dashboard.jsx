import { useCallback, useState, useEffect, useMemo } from "react";
import { useFormikContext } from "formik";
import {
  Grid,
  Select,
  DatePicker,
  Form,
  Button,
  Stat,
  Table,
  openLink,
  Pagination,
} from "@basemachina/view";
import {
  HStack,
  VStack,
  Heading,
  Button as ChakraButton,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { Bar } from "react-chartjs-2";

const sampleCosmetics = [
  { value: "1", label: "ルミナスグロウ ファンデーション" },
  { value: "2", label: "シルキーラディアンス パウダー" },
  { value: "3", label: "ベルベットタッチ ルージュ" },
  { value: "4", label: "ピュアシャイン リップグロス" },
  { value: "5", label: "ボリュームエクスプレス マスカラ" },
  { value: "6", label: "スムースライン アイライナー" },
  { value: "7", label: "ブロンズゴッデス ハイライター" },
];

const sampleCampaigns = [
  { value: "1", label: "期間限定！スペシャルビューティーキット プレゼント" },
  { value: "2", label: "新製品発売記念！先着100名様に豪華サンプルセット" },
  { value: "3", label: "今だけ！2つ買うと1つ無料キャンペーン" },
  { value: "4", label: "リピーター限定！20%オフクーポンプレゼント" },
  { value: "5", label: "夏の大感謝祭！全品10%オフ＋送料無料" },
  { value: "6", label: "ビューティーポイント2倍！期間限定キャンペーン" },
  { value: "7", label: "新規会員登録で500円分のクーポンをゲット！" },
  {
    value: "8",
    label: "SNS投稿で当たる！豪華コスメセットプレゼントキャンペーン",
  },
];

const dateLabels = [
  "2024-04-10",
  "2024-04-11",
  "2024-04-12",
  "2024-04-13",
  "2024-04-14",
  "2024-04-15",
  "2024-04-16",
  "2024-04-17",
  "2024-04-18",
  "2024-04-19",
  "2024-04-20",
  "2024-04-21",
  "2024-04-22",
  "2024-04-23",
  "2024-04-24",
  "2024-04-25",
  "2024-04-26",
  "2024-04-27",
  "2024-04-28",
  "2024-04-29",
  "2024-04-30",
  "2024-04-31",
  "2024-05-01",
  "2024-05-02",
  "2024-05-03",
  "2024-05-04",
  "2024-05-05",
  "2024-05-06",
  "2024-05-07",
  "2024-05-08",
];

const dailyStreamCounts = [
  3, 2, 15, 7, 7, 2, 9, 8, 1, 5, 2, 9, 3, 2, 6, 1, 2, 3, 1, 7, 22, 20, 1, 0, 28,
  64, 30, 34, 35, 27,
];

const dailyViewCounts = [
  2092, 639, 8317, 4775, 27864, 1605, 7621, 241335, 7127, 2452, 764, 40783,
  4385, 2554, 22525, 79, 5355, 62379, 911, 491777, 100608, 1447624, 26115, 0,
  60306, 60870, 338833, 125748, 64205, 86533,
];

const cumulativeStreamCounts = dailyStreamCounts.reduce((acc, count, index) => {
  if (index === 0) {
    return [count];
  }
  return [...acc, acc[acc.length - 1] + count];
}, []);

const cumulativeViewCounts = dailyViewCounts.reduce((acc, count, index) => {
  if (index === 0) {
    return [count];
  }
  return [...acc, acc[acc.length - 1] + count];
}, []);

const stats = {
  stream_count: 120,
  audience_count: 9238,
  promotion_budget_usage: 1260000,
  comment_count: 1004002,
};

const initialStartDate = new Date(
  new Date().getTime() - 30 * 24 * 60 * 60 * 1000
)
  .toISOString()
  .split("T")[0];
const initialEndDate = new Date().toISOString().split("T")[0];

const DateRangeFormContent = ({ searchCondition }) => {
  const { values, submitForm } = useFormikContext();
  useEffect(() => {
    submitForm();
  }, [values.startDate, values.endDate]);

  return (
    <div className="flex flex-row space-x-4 items-center">
      <DatePicker name="startDate" value={searchCondition.startDate} />
      <p class="font-bold text-sm text-gray-700">〜</p>
      <DatePicker name="endDate" value={searchCondition.endDate} />
    </div>
  );
};

const SearchConditionFormContent = () => {
  return (
    <VStack align="start" spacing={2}>
      <Select
        name="productId"
        label="商品"
        options={[{ value: "", label: "選択してください" }, ...sampleCosmetics]}
      />
      <Select
        name="campaignId"
        label="キャンペーン"
        options={[{ value: "", label: "選択してください" }, ...sampleCampaigns]}
      />
    </VStack>
  );
};

const SearchConditionModal = ({
  searchCondition,
  onSubmit,
  isOpen,
  onClose,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <Form
          onSubmit={onSubmit}
          initialValues={{
            ...searchCondition,
          }}
        >
          <ModalHeader>集計結果の検索条件</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SearchConditionFormContent />
          </ModalBody>

          <ModalFooter>
            <Button type="submit" title="検索" color="indigo" />
          </ModalFooter>
        </Form>
      </ModalContent>
    </Modal>
  );
};

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
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [searchCondition, setSearchCondition] = useState({
    startDate: initialStartDate,
    endDate: initialEndDate,
    productId: "",
    campaignId: "",
  });

  const handleChangeSearchCondition = useCallback(
    ({ values }) => {
      setSearchCondition((searchCondition) => {
        return {
          ...searchCondition,
          ...values,
        };
      });
      onClose();
    },
    [setSearchCondition, onClose]
  );

  return (
    <div className="flex flex-col gap-2 w-full h-full">
      <SearchConditionModal
        isOpen={isOpen}
        onClose={onClose}
        searchCondition={searchCondition}
        onSubmit={handleChangeSearchCondition}
      />
      <VStack align="start" spacing="1rem" className="w-full max-w-6xl">
        {/* SearchCondition Form */}
        <div className="flex flex-row justify-between w-full items-center">
          <Heading size="md" className="mr-4">
            株式会社ベースマキナ
          </Heading>
          <div className="flex flex-row space-x-4 items-center">
            <Form
              onSubmit={handleChangeSearchCondition}
              initialValues={{
                ...searchCondition,
              }}
            >
              <DateRangeFormContent searchCondition={searchCondition} />
            </Form>
            <button
              class="flowbite-btn flowbite-btn-white"
              type="button"
              style={{
                marginBottom: "0px",
                width: "190px",
              }}
              onClick={onOpen}
            >
              検索条件を変更する
            </button>
          </div>
        </div>

        {/* Stats */}
        <Grid repeatCount={4} gap={4} width="full">
          <Stat
            title="消化済み広告予算"
            value={`${stats.promotion_budget_usage.toLocaleString()}円`}
          />
          <Stat title="動画配信数" value={stats.stream_count} />
          <Stat
            title="閲覧UU数"
            value={stats.audience_count.toLocaleString()}
          />
          <Stat
            title="コメント数"
            value={stats.comment_count.toLocaleString()}
          />
        </Grid>

        {/* Charts */}
        <Heading size="sm">宣伝実績レポート</Heading>
        <Grid repeatCount={2} gap={4} width="full">
          <div className="w-full">
            <Bar
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
                  title: {
                    display: true,
                    text: "配信数・累計配信数の推移",
                  },
                },
              }}
              data={{
                labels: dateLabels,
                datasets: [
                  {
                    label: "投稿数",
                    data: dailyStreamCounts,
                    backgroundColor: "rgba(53, 162, 235, 0.5)",
                    type: "line",
                  },
                  {
                    label: "累計投稿数",
                    data: cumulativeStreamCounts,
                    backgroundColor: "rgba(255, 99, 132, 0.5)",
                  },
                ],
              }}
            />
          </div>
          <div className="w-full">
            <Bar
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
                  title: {
                    display: true,
                    text: "閲覧数・累計閲覧数の推移",
                  },
                },
              }}
              data={{
                labels: dateLabels,
                datasets: [
                  {
                    label: "閲覧数",
                    data: dailyViewCounts,
                    backgroundColor: "rgba(53, 162, 235, 0.5)",
                    type: "line",
                  },
                  {
                    label: "累計閲覧数",
                    data: cumulativeViewCounts,
                    backgroundColor: "rgba(255, 99, 132, 0.5)",
                  },
                ],
              }}
            />
          </div>
        </Grid>
      </VStack>
    </div>
  );
};

export default App;
