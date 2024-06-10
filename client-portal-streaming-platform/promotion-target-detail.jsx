import { useEffect, useState, useCallback, useMemo } from "react";
import dayjs from "dayjs";
import {
  Badge,
  Grid,
  LoadingIndicator,
  useExecuteAction,
  Image,
  Link,
  Table,
  useURLQueries,
  useBaseMachinaContext,
} from "@basemachina/view";
import { VStack, Box, Heading } from "@chakra-ui/react";

const samplePromotionTargetDetail = {
  id: 1,
  name: "ルミナスグロウ ファンデーション",
  description: `ルミナスグロウ ファンデーションは、肌に自然なツヤを与えるファンデーションです。`,
  publish_status: "OPEN",
  price: 800,
  budget_per_play: 1.2,
  created_at: "2024-04-10 12:00",
  updated_at: "2024-04-10 12:00",
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
      <div className="flex-none w-full">
        <div className="flex flex-row space-x-4 w-full">
          <VStack
            align="start"
            spacing="0.5rem"
            className="w-full"
            style={{
              maxWidth: "60rem",
            }}
          >
            <VerticalTable descriptions={descriptions} />;
          </VStack>
          <div>プレビュー領域</div>
        </div>
      </div>
    </div>
  );
};

export default App;
