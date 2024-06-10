import { useEffect, useState, useCallback, useMemo } from "react";
import dayjs from "dayjs";
import {
  Card,
  Badge,
  Grid,
  Form,
  Stat,
  Box,
  Heading,
  Button,
  TextInput,
  DatePicker,
  Image,
  Flexbox,
  Select,
  Table,
} from "@basemachina/view";
import {
  VStack,
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
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
      url: "/assets/foundation_01.webp",
      title: "ファンデーション 正面画像",
    },
    {
      id: 2,
      url: "/assets/foundation_02.webp",
      title: "デスク配置例",
    },
    {
      id: 3,
      url: "/assets/foundation_03.webp",
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
    <div class="ring-1 ring-black ring-opacity-5 sm:rounded-md w-full">
      <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <tbody>
          {Object.entries(descriptions).map(([key, value], index) => {
            return (
              <tr
                class={`${
                  index < Object.keys(descriptions).length - 1 ? "border-b" : ""
                } border-gray-200 dark:border-gray-700`}
              >
                <th
                  scope="row"
                  class="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800 w-40"
                >
                  {key}
                </th>
                <td class="px-6 py-4 text-gray-600">{value}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
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

  return <Badge color={color} title={statusLabel[status]} />;
};

const App = () => {
  const descriptions = {
    ID: samplePromotionTargetDetail.id,
    商品名: samplePromotionTargetDetail.name,
    公開ステータス: (
      <PublishStatusBadge status={samplePromotionTargetDetail.publish_status} />
    ),
    詳細: samplePromotionTargetDetail.description
      .split("\n")
      .map((line, index) => <div key={index}>{line}</div>),
    販売価格: samplePromotionTargetDetail.price + "円",
    プロモーション再生単価: samplePromotionTargetDetail.budget_per_play + "円",
    作成日: dayjs(samplePromotionTargetDetail.created_at).format("YYYY/MM/DD"),
    更新日: dayjs(samplePromotionTargetDetail.updated_at).format("YYYY/MM/DD"),
  };

  return (
    <div className="flex flex-col gap-2 w-full h-full">
      <Tabs variant="enclosed" class="w-full" size="sm">
        <TabList>
          <Tab>基本情報</Tab>
          <Tab>キャンペーン</Tab>
          <Tab>事務局メモ</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <div className="flex flex-row space-x-4 w-full">
              <VStack align="start" spacing="1rem" className="w-full">
                <Grid repeatCount={3} gap={4} width="full">
                  <Stat
                    title="プロモーション回数"
                    value={samplePromotionTargetDetail.stats.promotion_count.toLocaleString()}
                  />
                  <Stat
                    title="視聴UU"
                    value={samplePromotionTargetDetail.stats.audience_count.toLocaleString()}
                  />
                  <Stat
                    title="予算消化額"
                    value={`${samplePromotionTargetDetail.stats.budget_consumption.toLocaleString()}円`}
                  />
                </Grid>
                <VerticalTable descriptions={descriptions} />;
                <Heading size="lg" text="画像一覧" />
                <div className="flex overflow-hidden">
                  <Flexbox
                    direction="row"
                    justify="start"
                    overflow="x-auto"
                    wrap="nowrap"
                  >
                    {
                      // 画像一覧を表示する
                      samplePromotionTargetDetail.thumbnails.map((thumbnail) => {
                        return (
                          <Box overflow="visible">
                          <Box width="xl" height="md">
                            <Image
                              size="md"
                              objectFit="cover"
                              url={thumbnail.url}
                            />
                          </Box>
                          <p className="font-bold text-sm my-1">
                            {thumbnail.title}
                          </p>
                          </Box>
                        );
                      })
                    }
                  </Flexbox>
                </div>
              </VStack>
            </div>
          </TabPanel>
          <TabPanel>
            <Heading size="lg" text="期間限定キャンペーンの作成" />
            <Card>
              <Form
                initialValues={{}}
                onSubmit={(v) => {
                  setSubmitValues(v);
                }}
              >
                <Flexbox direction="col">
                  <Box>
                    <TextInput
                      name="title"
                      label="お知らせタイトル"
                      placeholder="例) 入会キャンペーン適用のお知らせ"
                    />
                  </Box>
                  <Grid repeatCount={3}>
                    <Box>
                      <Select
                        name="campaign_kind"
                        label="キャンペーン種別"
                        options={[
                          {
                            label: "キャッシュバック",
                            value: "before_screening",
                          },
                          { label: "ポイント付与", value: "published" },
                        ]}
                      />
                    </Box>
                    <Box>
                      <Select
                        name="release_timing"
                        label="適用タイミング"
                        options={[
                          { label: "即時", value: "before_screening" },
                          { label: "翌週", value: "published" },
                        ]}
                      />
                    </Box>
                  </Grid>
                  <Box>
                    <TextInput
                      name="price"
                      label="金額"
                      placeholder="例) 1,200円"
                    />
                  </Box>
                  <Grid repeatCount={2}>
                    <Box>
                      <p className="text-sm font-bold">適用開始日時</p>
                      <DatePicker name="release_datetime" withTime />
                    </Box>
                  </Grid>

                  <Button type="submit" title="適用する" color="blue" />
                </Flexbox>
              </Form>
            </Card>
            {/* キャンペーンのテーブル。ステータスはバッヂ表記にする */}
            <Heading size="lg" text="キャンペーン一覧" />
            <Table
              rows={
                samplePromotionTargetDetail.campaigns.map((campaign) => {
                  return {
                    title: campaign.title,
                    kind: (
                      <Badge
                        title={
                          campaign.kind === "cashback"
                            ? "キャッシュバック"
                            : "ポイント付与"
                        }
                        color={campaign.kind === "cashback" ? "blue" : "green"}
                      />
                    ),
                    release_timing: (
                      <Badge
                        title={
                          campaign.release_timing === "immediate"
                            ? "即時"
                            : "翌週"
                        }
                        color={
                          campaign.release_timing === "immediate"
                            ? "green"
                            : "yellow"
                        }
                      />
                    ),
                    budget: campaign.budget.toLocaleString() + "円",
                    release_datetime: campaign.release_datetime,
                    close_at: campaign.close_at,
                    status: (
                      <Badge
                        title={campaign.status === "active" ? "有効" : "無効"}
                        color={campaign.status === "active" ? "green" : "gray"}
                      />
                    ),
                  };
                }) ?? []
              }
              columnNames={{
                title: "タイトル",
                kind: "種別",
                release_timing: "適用タイミング",
                budget: "予算",
                release_datetime: "適用開始日時",
                close_at: "終了日時",
                status: "ステータス",
              }}
              searchDisabled={true}
              scrollable={true}
            />
          </TabPanel>
          <TabPanel>
            <Card>
              <Form
                initialValues={{
                  comment: "",
                }}
                onSubmit={(v) => {
                  setSubmitValues(v);
                }}
              >
                <Flexbox direction="col">
                  <Box>
                    <TextInput
                      name="comment"
                      label="コメント"
                      placeholder="コメントを入力してください"
                    />
                  </Box>
                  <Button type="submit" title="コメントする" color="blue" />
                </Flexbox>
              </Form>
            </Card>

            <Heading size="lg" text="コメント一覧" />
            <Table
              rows={
                samplePromotionTargetDetail.operator_notes.map((note) => {
                  return {
                    comment: note.comment,
                    created_at: note.created_at,
                  };
                }) ?? []
              }
              columnNames={{
                comment: "コメント",
                created_at: "日時",
              }}
              searchDisabled={true}
              scrollable={true}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default App;
