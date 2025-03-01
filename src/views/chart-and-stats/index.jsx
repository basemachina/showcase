import { useCallback, useState, useEffect } from "react";
import {
  VStack,
  Heading,
  Button, Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Flex,
  Box,
  Text,
  FormControl,
  FormLabel,
  Input,
  Select
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

const DateRangeFormContent = ({ searchCondition, onChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  return (
    <Flex direction="row" alignItems="center" gap={4}>
      <Input
        name="startDate"
        type="date"
        value={searchCondition.startDate}
        onChange={handleChange}
        size="sm"
        width="auto"
      />
      <Text fontWeight="bold" fontSize="sm" color="gray.700">〜</Text>
      <Input
        name="endDate"
        type="date"
        value={searchCondition.endDate}
        onChange={handleChange}
        size="sm"
        width="auto"
      />
    </Flex>
  );
};

const SearchConditionFormContent = ({ formValues, onChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  return (
    <VStack align="start" spacing={4}>
      <FormControl>
        <FormLabel>商品</FormLabel>
        <Select
          name="productId"
          value={formValues.productId}
          onChange={handleChange}
        >
          <option value="">選択してください</option>
          {sampleCosmetics.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </Select>
      </FormControl>
      <FormControl>
        <FormLabel>キャンペーン</FormLabel>
        <Select
          name="campaignId"
          value={formValues.campaignId}
          onChange={handleChange}
        >
          <option value="">選択してください</option>
          {sampleCampaigns.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </Select>
      </FormControl>
    </VStack>
  );
};

const SearchConditionModal = ({
  searchCondition,
  onSubmit,
  isOpen,
  onClose,
}) => {
  const [formValues, setFormValues] = useState(searchCondition);

  useEffect(() => {
    setFormValues(searchCondition);
  }, [searchCondition, isOpen]);

  const handleChange = (values) => {
    setFormValues((prev) => ({ ...prev, ...values }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ values: formValues });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>集計結果の検索条件</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SearchConditionFormContent
              formValues={formValues}
              onChange={handleChange}
            />
          </ModalBody>

          <ModalFooter>
            <Button type="submit" colorScheme="blue">
              検索
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
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
      setSearchCondition((prev) => ({
        ...prev,
        ...values,
      }));
      onClose();
    },
    [onClose]
  );

  const handleDateRangeChange = useCallback(
    (values) => {
      setSearchCondition((prev) => ({
        ...prev,
        ...values,
      }));
    },
    []
  );

  return (
    <Flex direction="column" gap={2} w="100%" h="100%">
      <SearchConditionModal
        isOpen={isOpen}
        onClose={onClose}
        searchCondition={searchCondition}
        onSubmit={handleChangeSearchCondition}
      />
      <VStack align="start" spacing="1rem" width="100%" maxWidth="6xl">
        {/* SearchCondition Form */}
        <Flex justifyContent="space-between" width="100%" alignItems="center">
          <Heading size="md" mr={4}>
            株式会社ベースマキナ
          </Heading>
          <Flex alignItems="center" gap={4}>
            <DateRangeFormContent
              searchCondition={searchCondition}
              onChange={handleDateRangeChange}
            />
            <Button
              variant="outline"
              size="sm"
              width="190px"
              onClick={onOpen}
            >
              検索条件を変更する
            </Button>
          </Flex>
        </Flex>

        {/* Stats */}
        <SimpleGrid columns={4} spacing={4} width="100%">
          <Stat>
            <StatLabel>消化済み広告予算</StatLabel>
            <StatNumber>{`${stats.promotion_budget_usage.toLocaleString()}円`}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>動画配信数</StatLabel>
            <StatNumber>{stats.stream_count}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>閲覧UU数</StatLabel>
            <StatNumber>{stats.audience_count.toLocaleString()}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>コメント数</StatLabel>
            <StatNumber>{stats.comment_count.toLocaleString()}</StatNumber>
          </Stat>
        </SimpleGrid>

        {/* Charts */}
        <Heading size="sm">宣伝実績レポート</Heading>
        <SimpleGrid columns={2} spacing={4} width="100%">
          <Box width="100%">
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
          </Box>
          <Box width="100%">
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
          </Box>
        </SimpleGrid>
      </VStack>
    </Flex>
  );
};

export default App;
