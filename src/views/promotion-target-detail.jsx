import { useState, useMemo } from "react";
import dayjs from "dayjs";
import {
  VStack,
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Card,
  CardBody,
  Badge,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Box,
  Heading,
  Button,
  Input,
  Image,
  Flex,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  FormControl,
  FormLabel,
  Text
} from "@chakra-ui/react";

const samplePromotionTargetDetail = {
  id: 1,
  name: "ルミナスグロウ ファンデーション",
  description: `ルミナスグロウ ファンデーションは、肌に自然なツヤを与えるファンデーションです。`,
  publish_status: "OPEN",
  price: 800,
  budget_per_play: 1.2,
  created_at: "2024-04-10 12:00",
  updated_at: "2024-04-10 12:00",
  stats: {
    promotion_count: 32,
    audience_count: 102053,
    budget_consumption: 2330000,
  },
  thumbnails: [
    {
      id: 1,
      url: "https://raw.githubusercontent.com/basemachina/showcase/main/client-portal-streaming-platform/assets/foundation_01.webp",
      title: "ファンデーション 正面画像",
    },
    {
      id: 2,
      url: "https://raw.githubusercontent.com/basemachina/showcase/main/client-portal-streaming-platform/assets/foundation_02.webp",
      title: "デスク配置例",
    },
    {
      id: 3,
      url: "https://raw.githubusercontent.com/basemachina/showcase/main/client-portal-streaming-platform/assets/foundation_03.webp",
      title: "モデル使用例",
    },
  ],
  operator_notes: [
    {
      id: 1,
      comment: "商品説明に誤解を招く表現が含まれていたので修正しました。",
      created_at: "2024-04-10 12:00",
    },
    {
      id: 2,
      comment: "商品画像が実際の商品と異なっていたので再アップロードしました。",
      created_at: "2024-04-10 12:00",
    },
    {
      id: 3,
      comment: "商品価格が誤っていたので修正しました。",
      created_at: "2024-04-10 12:00",
    },
  ],
  campaigns: [
    {
      id: 1,
      title: "期間限定！スペシャルビューティーキット プレゼント",
      kind: "cashback",
      release_timing: "immediate",
      budget: 1000000,
      release_datetime: "2024-04-10 12:00",
      close_at: "2024-04-20 12:00",
      status: "active",
    },
    {
      id: 2,
      title: "新製品発売記念！先着100名様に豪華サンプルセット",
      kind: "point",
      release_timing: "next_week",
      budget: 500000,
      release_datetime: "2024-02-10 12:00",
      close_at: "2024-02-20 12:00",
      status: "active",
    },
    {
      id: 3,
      title: "今だけ！2つ買うと1つ無料キャンペーン",
      kind: "cashback",
      release_timing: "immediate",
      budget: 420000,
      release_datetime: "2024-01-12 11:00",
      close_at: "2024-01-20 12:00",
      status: "inactive",
    },
  ],
};

const VerticalTable = ({ descriptions }) => {
  return (
    <Box borderWidth="1px" borderRadius="md" width="100%">
      <Table size="sm" variant="simple">
        <Tbody>
          {Object.entries(descriptions).map(([key, value], index) => {
            return (
              <Tr key={key} borderBottomWidth={index < Object.keys(descriptions).length - 1 ? "1px" : "0"}>
                <Th width="200px" bg="gray.50">{key}</Th>
                <Td>{value}</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Box>
  );
};

const statusLabel = {
  OPEN: "公開中",
  CLOSED: "非公開",
};

const PublishStatusBadge = ({ status }) => {
  const color = useMemo(() => {
    switch (status) {
      case "OPEN":
        return "green";
      case "CLOSED":
        return "gray";
      default:
        return "gray";
    }
  }, [status]);

  return <Badge colorScheme={color}>{statusLabel[status]}</Badge>;
};

const App = () => {
  const [formValues, setFormValues] = useState({
    title: "",
    campaign_kind: "",
    release_timing: "",
    price: "",
    release_datetime: "",
    comment: ""
  });
  
  const [submitValues, setSubmitValues] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const descriptions = {
    ID: samplePromotionTargetDetail.id,
    商品名: samplePromotionTargetDetail.name,
    公開ステータス: (
      <PublishStatusBadge status={samplePromotionTargetDetail.publish_status} />
    ),
    詳細: samplePromotionTargetDetail.description
      .split("\n")
      .map((line, index) => <Box key={index}>{line}</Box>),
    販売価格: samplePromotionTargetDetail.price + "円",
    プロモーション再生単価: samplePromotionTargetDetail.budget_per_play + "円",
    作成日: dayjs(samplePromotionTargetDetail.created_at).format("YYYY/MM/DD"),
    更新日: dayjs(samplePromotionTargetDetail.updated_at).format("YYYY/MM/DD"),
  };

  return (
    <Flex direction="column" gap={2} w="100%" h="100%">
      <Tabs variant="enclosed" width="100%" size="sm">
        <TabList>
          <Tab>基本情報</Tab>
          <Tab>キャンペーン</Tab>
          <Tab>事務局メモ</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Flex direction="row" gap={4} width="100%">
              <VStack align="start" spacing="1rem" width="100%">
                <SimpleGrid columns={3} spacing={4} width="100%">
                  <Stat>
                    <StatLabel>プロモーション回数</StatLabel>
                    <StatNumber>{samplePromotionTargetDetail.stats.promotion_count.toLocaleString()}</StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel>視聴UU</StatLabel>
                    <StatNumber>{samplePromotionTargetDetail.stats.audience_count.toLocaleString()}</StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel>予算消化額</StatLabel>
                    <StatNumber>{`${samplePromotionTargetDetail.stats.budget_consumption.toLocaleString()}円`}</StatNumber>
                  </Stat>
                </SimpleGrid>
                <VerticalTable descriptions={descriptions} />
                <Heading size="lg">画像一覧</Heading>
                <Box overflow="hidden">
                  <Flex
                    direction="row"
                    justifyContent="flex-start"
                    overflowX="auto"
                    flexWrap="nowrap"
                  >
                    {samplePromotionTargetDetail.thumbnails.map((thumbnail) => {
                      return (
                        <Box key={thumbnail.id} overflow="visible" mr={4}>
                          <Box width="300px" height="200px">
                            <Image
                              boxSize="100%"
                              objectFit="cover"
                              src={thumbnail.url}
                              alt={thumbnail.title}
                            />
                          </Box>
                          <Text fontWeight="bold" fontSize="sm" my={1}>
                            {thumbnail.title}
                          </Text>
                        </Box>
                      );
                    })}
                  </Flex>
                </Box>
              </VStack>
            </Flex>
          </TabPanel>
          <TabPanel>
            <Heading size="lg" mt={6} mb={4}>期間限定キャンペーンの作成</Heading>
            <Card>
              <CardBody>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitValues(formValues);
                }}>
                  <Flex direction="column" gap={4}>
                    <FormControl>
                      <FormLabel>お知らせタイトル</FormLabel>
                      <Input
                        name="title"
                        value={formValues.title}
                        onChange={handleChange}
                        placeholder="例) 入会キャンペーン適用のお知らせ"
                      />
                    </FormControl>
                    
                    <SimpleGrid columns={3} spacing={4}>
                      <FormControl>
                        <FormLabel>キャンペーン種別</FormLabel>
                        <Select 
                          name="campaign_kind"
                          value={formValues.campaign_kind}
                          onChange={handleChange}
                        >
                          <option value="">選択してください</option>
                          <option value="before_screening">キャッシュバック</option>
                          <option value="published">ポイント付与</option>
                        </Select>
                      </FormControl>
                      
                      <FormControl>
                        <FormLabel>適用タイミング</FormLabel>
                        <Select 
                          name="release_timing"
                          value={formValues.release_timing}
                          onChange={handleChange}
                        >
                          <option value="">選択してください</option>
                          <option value="before_screening">即時</option>
                          <option value="published">翌週</option>
                        </Select>
                      </FormControl>
                    </SimpleGrid>
                    
                    <FormControl>
                      <FormLabel>予算</FormLabel>
                      <Input
                        name="price"
                        value={formValues.price}
                        onChange={handleChange}
                        placeholder="例) 1,239,200円"
                      />
                    </FormControl>
                    
                    <SimpleGrid columns={2} spacing={4}>
                      <FormControl>
                        <FormLabel fontSize="sm" fontWeight="bold">適用開始日時</FormLabel>
                        <Input
                          name="release_datetime"
                          type="datetime-local"
                          value={formValues.release_datetime}
                          onChange={handleChange}
                        />
                      </FormControl>
                    </SimpleGrid>

                    <Button type="submit" colorScheme="blue" alignSelf="flex-start" mt={2}>
                      適用する
                    </Button>
                  </Flex>
                </form>
              </CardBody>
            </Card>

            <Heading size="lg" mt={6} mb={4}>キャンペーン一覧</Heading>
            <TableContainer>
              <Table size="sm">
                <Thead>
                  <Tr>
                    <Th>タイトル</Th>
                    <Th>種別</Th>
                    <Th>適用タイミング</Th>
                    <Th>予算</Th>
                    <Th>適用開始日時</Th>
                    <Th>終了日時</Th>
                    <Th>ステータス</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {samplePromotionTargetDetail.campaigns.map((campaign) => (
                    <Tr key={campaign.id}>
                      <Td>{campaign.title}</Td>
                      <Td>
                        <Badge
                          colorScheme={campaign.kind === "cashback" ? "blue" : "green"}
                        >
                          {campaign.kind === "cashback" ? "キャッシュバック" : "ポイント付与"}
                        </Badge>
                      </Td>
                      <Td>
                        <Badge
                          colorScheme={campaign.release_timing === "immediate" ? "green" : "yellow"}
                        >
                          {campaign.release_timing === "immediate" ? "即時" : "翌週"}
                        </Badge>
                      </Td>
                      <Td>{campaign.budget.toLocaleString() + "円"}</Td>
                      <Td>{campaign.release_datetime}</Td>
                      <Td>{campaign.close_at}</Td>
                      <Td>
                        <Badge
                          colorScheme={campaign.status === "active" ? "green" : "gray"}
                        >
                          {campaign.status === "active" ? "有効" : "無効"}
                        </Badge>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </TabPanel>
          <TabPanel>
            <Card mt={6}>
              <CardBody>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitValues({...formValues});
                }}>
                  <Flex direction="column" gap={4}>
                    <FormControl>
                      <FormLabel>コメント</FormLabel>
                      <Input
                        name="comment"
                        value={formValues.comment}
                        onChange={handleChange}
                        placeholder="コメントを入力してください"
                      />
                    </FormControl>
                    <Button type="submit" colorScheme="blue" alignSelf="flex-start">
                      コメントする
                    </Button>
                  </Flex>
                </form>
              </CardBody>
            </Card>

            <Heading size="lg" mt={6} mb={4}>コメント一覧</Heading>
            <TableContainer>
              <Table size="sm">
                <Thead>
                  <Tr>
                    <Th>コメント</Th>
                    <Th>日時</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {samplePromotionTargetDetail.operator_notes.map((note) => (
                    <Tr key={note.id}>
                      <Td>{note.comment}</Td>
                      <Td>{note.created_at}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
};

export default App;
