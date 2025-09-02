import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  HStack,
  Input,
  NumberInput,
  NumberInputField,
  Select,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { useFormik } from "formik";
import { BlobProvider, Document, Font, Page, PDFViewer, StyleSheet, Text, View } from "@react-pdf/renderer";
import NotoSansRegular from "./fonts/NotoSansJP-Regular.ttf?inline";
import NotoSansBold from "./fonts/NotoSansJP-Bold.ttf?inline";

// 日本語文字化け対策: ローカル配置の Noto Sans JP (TTF) を登録
try {
  Font.register({
    family: "NotoSansJP",
    fonts: [
      { src: NotoSansRegular, fontWeight: "normal" },
      { src: NotoSansBold, fontWeight: "bold" },
    ],
  });
} catch { }

const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontSize: 10,
    fontFamily: "NotoSansJP",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  row: { flexDirection: "row" },
  col: { flexDirection: "column" },
  section: { marginBottom: 10 },
  label: { color: "#555" },
  box: {
    borderWidth: 1,
    borderColor: "#333",
    padding: 8,
  },
  amountBox: {
    borderWidth: 2,
    borderColor: "#000",
    padding: 10,
    alignItems: "center",
  },
  table: {
    borderWidth: 1,
    borderColor: "#999",
  },
  th: {
    backgroundColor: "#eee",
    fontWeight: "bold",
    padding: 6,
    borderRightWidth: 1,
    borderRightColor: "#999",
  },
  td: {
    padding: 6,
    borderRightWidth: 1,
    borderRightColor: "#999",
    borderTopWidth: 1,
    borderTopColor: "#999",
  },
});

type Item = {
  name: string;
  qty: number;
  unitPrice: number;
};

type FormValues = {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  billToName: string;
  billToAddress: string;
  billToPerson: string;
  items: Item[];
  taxRate: number; // percentage e.g. 10
  bankName: string;
  bankBranch: string;
  bankType: "普通" | "当座" | "貯蓄";
  bankNumber: string;
  bankHolder: string;
  myCompany: string;
  myAddress: string;
  myTel: string;
  myPerson: string;
  notes: string;
};

function currency(n: number) {
  return new Intl.NumberFormat("ja-JP").format(n);
}

function makePdf(values: FormValues) {
  const subTotal = values.items.reduce((a, b) => a + b.qty * b.unitPrice, 0);
  const tax = Math.floor((subTotal * values.taxRate) / 100);
  const total = subTotal + tax;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>請求書</Text>

        {/* Header row: Bill To and Summary */}
        <View style={[styles.row, styles.section]}>
          <View style={{ flex: 2, paddingRight: 8 }}>
            <View style={[styles.box, { minHeight: 120 }]}>
              <Text style={{ fontSize: 12, fontWeight: "bold", marginBottom: 4 }}>御中：{values.billToName || ""}</Text>
              <Text>ご担当者：{values.billToPerson || ""} 様</Text>
              <Text>住所：{values.billToAddress || ""}</Text>
              <View style={{ height: 8 }} />
              <Text>下記の通りご請求申し上げます。</Text>
              <View style={{ height: 6 }} />
              <Text>請求日：{values.issueDate}</Text>
              <Text>請求書番号：{values.invoiceNumber}</Text>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.amountBox}>
              <Text style={{ fontSize: 10 }}>合計金額（税込）</Text>
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>¥ {currency(total)}</Text>
            </View>
            <View style={[styles.box, { marginTop: 8 }]}>
              <Text>支払期日：{values.dueDate}</Text>
            </View>
          </View>
        </View>

        {/* My company info */}
        <View style={[styles.row, styles.section]}>
          <View style={{ flex: 1 }} />
          <View style={[styles.box, { flex: 1 }]}>
            <Text style={{ fontWeight: "bold", fontSize: 12 }}>{values.myCompany}</Text>
            <Text>住所：{values.myAddress}</Text>
            <Text>TEL：{values.myTel}</Text>
            <Text>担当：{values.myPerson}</Text>
          </View>
        </View>

        {/* Items table */}
        <View style={[styles.table, styles.section]}>
          <View style={[styles.row]}>
            <Text style={[styles.th, { flex: 4 }]}>品目</Text>
            <Text style={[styles.th, { flex: 1, textAlign: "right" }]}>数量</Text>
            <Text style={[styles.th, { flex: 2, textAlign: "right" }]}>単価</Text>
            <Text style={[styles.th, { flex: 2, textAlign: "right" }]}>金額</Text>
          </View>
          {values.items.length === 0 ? (
            <View style={[styles.row]}>
              <Text style={[styles.td, { flex: 9 }]}>（品目は未入力です）</Text>
            </View>
          ) : (
            values.items.map((it, idx) => (
              <View key={idx} style={[styles.row]}>
                <Text style={[styles.td, { flex: 4 }]}>{it.name}</Text>
                <Text style={[styles.td, { flex: 1, textAlign: "right" }]}>{currency(it.qty)}</Text>
                <Text style={[styles.td, { flex: 2, textAlign: "right" }]}>¥ {currency(it.unitPrice)}</Text>
                <Text style={[styles.td, { flex: 2, textAlign: "right" }]}>¥ {currency(it.qty * it.unitPrice)}</Text>
              </View>
            ))
          )}
        </View>

        {/* Totals */}
        <View style={[styles.row, styles.section]}>
          <View style={{ flex: 1 }} />
          <View style={[styles.box, { width: 240 }]}>
            <View style={[styles.row, { justifyContent: "space-between" }]}>
              <Text>小計</Text>
              <Text>¥ {currency(subTotal)}</Text>
            </View>
            <View style={[styles.row, { justifyContent: "space-between" }]}>
              <Text>消費税（{values.taxRate}%）</Text>
              <Text>¥ {currency(tax)}</Text>
            </View>
            <View style={[styles.row, { justifyContent: "space-between", marginTop: 4 }]}>
              <Text style={{ fontWeight: "bold" }}>合計</Text>
              <Text style={{ fontWeight: "bold" }}>¥ {currency(total)}</Text>
            </View>
          </View>
        </View>

        {/* Bank info */}
        <View style={[styles.box, styles.section]}>
          <Text style={{ fontWeight: "bold", marginBottom: 4 }}>お振込先</Text>
          <Text>
            {values.bankName} {values.bankBranch} 支店 / {values.bankType} / {values.bankNumber}
          </Text>
          <Text>口座名義：{values.bankHolder}</Text>
        </View>

        {/* Notes */}
        {values.notes ? (
          <View style={[styles.box]}>
            <Text style={{ fontWeight: "bold", marginBottom: 4 }}>備考</Text>
            <Text>{values.notes}</Text>
          </View>
        ) : null}
      </Page>
    </Document>
  );
}

const defaultValues: FormValues = {
  invoiceNumber: "INV-2024-0001",
  issueDate: dayjs().format("YYYY-MM-DD"),
  dueDate: dayjs().add(14, "day").format("YYYY-MM-DD"),
  billToName: "株式会社サンプル",
  billToAddress: "東京都千代田区丸の内1-1-1",
  billToPerson: "山田太郎",
  items: [
    { name: "開発作業費（8月分）", qty: 1, unitPrice: 300000 },
    { name: "保守サポート費（8月分）", qty: 1, unitPrice: 50000 },
  ],
  taxRate: 10,
  bankName: "三井住友銀行",
  bankBranch: "本店",
  bankType: "普通",
  bankNumber: "1234567",
  bankHolder: "カ）ベースマキナ",
  myCompany: "ベースマキナ株式会社",
  myAddress: "東京都渋谷区桜丘町00-00",
  myTel: "03-1234-5678",
  myPerson: "高橋",
  notes: "お振込み手数料は貴社ご負担にてお願いいたします。",
};

const GenerateInvoicePdf: React.FC = () => {
  const [itemDraft, setItemDraft] = useState<Item>({ name: "", qty: 1, unitPrice: 0 });

  const formik = useFormik<FormValues>({
    initialValues: defaultValues,
    onSubmit: () => { },
  });

  const doc = useMemo(() => makePdf(formik.values), [formik.values]);

  return (
    <Flex direction="column" gap={2} w="full" h="full">
      <Heading size="sm">請求書PDF生成（react-pdf サンプル）</Heading>
      <Grid templateColumns={{ base: "1fr", md: "420px 1fr" }} gap={4} h="full" minH="640px">
        <GridItem>
          <Card p={4} as="form" onSubmit={(e) => e.preventDefault()}>
            <Stack spacing={3}>
              <Heading size="xs">請求情報</Heading>
              <HStack>
                <FormControl>
                  <FormLabel>請求書番号</FormLabel>
                  <Input name="invoiceNumber" value={formik.values.invoiceNumber} onChange={formik.handleChange} />
                </FormControl>
                <FormControl>
                  <FormLabel>請求日</FormLabel>
                  <Input type="date" name="issueDate" value={formik.values.issueDate} onChange={formik.handleChange} />
                </FormControl>
              </HStack>
              <FormControl>
                <FormLabel>支払期日</FormLabel>
                <Input type="date" name="dueDate" value={formik.values.dueDate} onChange={formik.handleChange} />
              </FormControl>

              <Divider />
              <Heading size="xs">請求先</Heading>
              <FormControl>
                <FormLabel>御中</FormLabel>
                <Input name="billToName" value={formik.values.billToName} onChange={formik.handleChange} />
              </FormControl>
              <FormControl>
                <FormLabel>ご担当者</FormLabel>
                <Input name="billToPerson" value={formik.values.billToPerson} onChange={formik.handleChange} />
              </FormControl>
              <FormControl>
                <FormLabel>住所</FormLabel>
                <Textarea name="billToAddress" value={formik.values.billToAddress} onChange={formik.handleChange} />
              </FormControl>

              <Divider />
              <Heading size="xs">品目</Heading>
              <HStack align="end">
                <FormControl>
                  <FormLabel>品目名</FormLabel>
                  <Input
                    value={itemDraft.name}
                    onChange={(e) => setItemDraft((s) => ({ ...s, name: e.target.value }))}
                  />
                </FormControl>
                <FormControl w="120px">
                  <FormLabel>数量</FormLabel>
                  <NumberInput value={itemDraft.qty} min={1} onChange={(_, v) => setItemDraft((s) => ({ ...s, qty: Number.isFinite(v) ? v : 0 }))}>
                    <NumberInputField />
                  </NumberInput>
                </FormControl>
                <FormControl w="180px">
                  <FormLabel>単価</FormLabel>
                  <NumberInput value={itemDraft.unitPrice} min={0} step={1000} onChange={(_, v) => setItemDraft((s) => ({ ...s, unitPrice: Number.isFinite(v) ? v : 0 }))}>
                    <NumberInputField />
                  </NumberInput>
                </FormControl>
                <Button
                  onClick={() =>
                    formik.setFieldValue("items", [...formik.values.items, { ...itemDraft }])
                  }
                  isDisabled={!itemDraft.name || itemDraft.unitPrice <= 0}
                  colorScheme="blue"
                >
                  追加
                </Button>
              </HStack>
              {formik.values.items.length > 0 && (
                <Stack spacing={2}>
                  {formik.values.items.map((it, idx) => (
                    <HStack key={idx} justify="space-between">
                      <Box fontSize="sm">
                        {it.name} / {it.qty} × ¥{currency(it.unitPrice)} = ¥{currency(it.qty * it.unitPrice)}
                      </Box>
                      <Button size="xs" onClick={() => formik.setFieldValue("items", formik.values.items.filter((_, i) => i !== idx))}>削除</Button>
                    </HStack>
                  ))}
                </Stack>
              )}

              <FormControl>
                <FormLabel>消費税率</FormLabel>
                <NumberInput value={formik.values.taxRate} min={0} max={20} onChange={(_, v) => formik.setFieldValue("taxRate", Number.isFinite(v) ? v : 10)}>
                  <NumberInputField />
                </NumberInput>
              </FormControl>

              <Divider />
              <Heading size="xs">振込先</Heading>
              <FormControl>
                <FormLabel>銀行名</FormLabel>
                <Input name="bankName" value={formik.values.bankName} onChange={formik.handleChange} />
              </FormControl>
              <HStack>
                <FormControl>
                  <FormLabel>支店名</FormLabel>
                  <Input name="bankBranch" value={formik.values.bankBranch} onChange={formik.handleChange} />
                </FormControl>
                <FormControl>
                  <FormLabel>口座種別</FormLabel>
                  <Select name="bankType" value={formik.values.bankType} onChange={formik.handleChange}>
                    <option value="普通">普通</option>
                    <option value="当座">当座</option>
                    <option value="貯蓄">貯蓄</option>
                  </Select>
                </FormControl>
              </HStack>
              <HStack>
                <FormControl>
                  <FormLabel>口座番号</FormLabel>
                  <Input name="bankNumber" value={formik.values.bankNumber} onChange={formik.handleChange} />
                </FormControl>
                <FormControl>
                  <FormLabel>口座名義</FormLabel>
                  <Input name="bankHolder" value={formik.values.bankHolder} onChange={formik.handleChange} />
                </FormControl>
              </HStack>

              <Divider />
              <Heading size="xs">自社情報</Heading>
              <FormControl>
                <FormLabel>会社名</FormLabel>
                <Input name="myCompany" value={formik.values.myCompany} onChange={formik.handleChange} />
              </FormControl>
              <FormControl>
                <FormLabel>住所</FormLabel>
                <Textarea name="myAddress" value={formik.values.myAddress} onChange={formik.handleChange} />
              </FormControl>
              <HStack>
                <FormControl>
                  <FormLabel>TEL</FormLabel>
                  <Input name="myTel" value={formik.values.myTel} onChange={formik.handleChange} />
                </FormControl>
                <FormControl>
                  <FormLabel>担当</FormLabel>
                  <Input name="myPerson" value={formik.values.myPerson} onChange={formik.handleChange} />
                </FormControl>
              </HStack>

              <FormControl>
                <FormLabel>備考</FormLabel>
                <Textarea name="notes" value={formik.values.notes} onChange={formik.handleChange} />
              </FormControl>

              <BlobProvider document={doc}>
                {({ url, loading }: { url: string | null; loading: boolean }) => (
                  <Button
                    as="a"
                    href={url ?? undefined}
                    download={`${formik.values.invoiceNumber || "invoice"}.pdf`}
                    colorScheme="green"
                    isLoading={loading}
                    loadingText="生成中..."
                    isDisabled={!url}
                  >
                    PDFダウンロード
                  </Button>
                )}
              </BlobProvider>
            </Stack>
          </Card>
        </GridItem>

        <GridItem>
          <Card p={0} h="full" overflow="hidden">
            <Box h="full" minH="640px">
              {/* The PDFViewer needs explicit width/height */}
              <PDFViewer style={{ width: "100%", height: "100%", minHeight: 640 }} showToolbar>
                {doc}
              </PDFViewer>
            </Box>
          </Card>
        </GridItem>
      </Grid>
    </Flex>
  );
};

export default GenerateInvoicePdf;
