import React, { useEffect, useMemo, useRef, useState } from "react";
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

function buildInvoiceHtml(values: FormValues) {
  const subTotal = values.items.reduce((a, b) => a + b.qty * b.unitPrice, 0);
  const tax = Math.floor((subTotal * values.taxRate) / 100);
  const total = subTotal + tax;

  // Minimal, printable HTML sized to A4. Avoid external fonts and libraries.
  // Use inline CSS so the iframe stays self-contained.
  const escape = (s: string) =>
    s
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");

  const itemsRows = values.items.length
    ? values.items
      .map(
        (it) => `
        <tr>
          <td class="cell">${escape(it.name)}</td>
          <td class="cell num">${currency(it.qty)}</td>
          <td class="cell num">¥ ${currency(it.unitPrice)}</td>
          <td class="cell num">¥ ${currency(it.qty * it.unitPrice)}</td>
        </tr>`
      )
      .join("")
    : `<tr><td class="cell" colspan="4">（品目は未入力です）</td></tr>`;

  return `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escape(values.invoiceNumber || "invoice")}</title>
    <style>
      @page { size: A4; margin: 16mm; }
      html, body { height: 100%; }
      body { margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .page { box-sizing: border-box; width: 100%; min-height: 100%; font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Hiragino Kaku Gothic ProN", "Hiragino Sans", "Yu Gothic UI", "Yu Gothic", Meiryo, sans-serif; color: #111; }
      .title { text-align: center; font-size: 20px; font-weight: 700; margin-bottom: 12px; }
      .row { display: flex; gap: 12px; }
      .col { display: flex; flex-direction: column; }
      .section { margin-bottom: 12px; }
      .box { border: 1px solid #333; padding: 8px; border-radius: 4px; }
      .amountBox { border: 2px solid #000; padding: 10px; text-align: center; border-radius: 4px; }
      .label { color: #555; }
      .table { width: 100%; border-collapse: collapse; border: 1px solid #999; }
      .th { background: #eee; font-weight: 700; padding: 6px; border-right: 1px solid #999; }
      .cell { padding: 6px; border-top: 1px solid #999; border-right: 1px solid #999; }
      .num { text-align: right; white-space: nowrap; }
      .spaceBetween { display: flex; justify-content: space-between; gap: 12px; }
      .mt4 { margin-top: 4px; }
      .mt8 { margin-top: 8px; }
      .right { text-align: right; }
      .w50 { width: 50%; }
      .w40 { width: 40%; }
      .w60 { width: 60%; }
      @media screen {
        /* Add a white page background when previewing on screen */
        body { background: #f5f5f5; }
        .sheet { max-width: 210mm; min-height: 297mm; margin: 0 auto; background: white; box-shadow: 0 0 3mm rgba(0,0,0,0.1); padding: 16mm; }
      }
      @media print {
        .sheet { padding: 0; }
      }
    </style>
  </head>
  <body>
    <div class="page sheet">
      <div class="title">請求書</div>
      <div class="row section">
        <div class="col w60" style="padding-right:8px;">
          <div class="box" style="min-height: 120px;">
            <div style="font-size: 13px; font-weight: 700; margin-bottom: 4px;">御中：${escape(values.billToName || "")}</div>
            <div>ご担当者：${escape(values.billToPerson || "")} 様</div>
            <div>住所：${escape(values.billToAddress || "")}</div>
            <div style="height: 8px;"></div>
            <div>下記の通りご請求申し上げます。</div>
            <div style="height: 6px;"></div>
            <div>請求日：${escape(values.issueDate)}</div>
            <div>請求書番号：${escape(values.invoiceNumber)}</div>
          </div>
        </div>
        <div class="col w40">
          <div class="amountBox">
            <div style="font-size: 11px;">合計金額（税込）</div>
            <div style="font-size: 22px; font-weight: 700;">¥ ${currency(total)}</div>
          </div>
          <div class="box mt8">支払期日：${escape(values.dueDate)}</div>
        </div>
      </div>

      <div class="row section">
        <div style="flex:1"></div>
        <div class="box" style="flex:1">
          <div style="font-weight:700; font-size: 13px;">${escape(values.myCompany)}</div>
          <div>住所：${escape(values.myAddress)}</div>
          <div>TEL：${escape(values.myTel)}</div>
          <div>担当：${escape(values.myPerson)}</div>
        </div>
      </div>

      <table class="table section">
        <thead>
          <tr>
            <th class="th" style="width: 50%">品目</th>
            <th class="th" style="width: 10%" align="right">数量</th>
            <th class="th" style="width: 20%" align="right">単価</th>
            <th class="th" style="width: 20%" align="right">金額</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows}
        </tbody>
      </table>

      <div class="row section">
        <div style="flex:1"></div>
        <div class="box" style="width: 240px;">
          <div class="spaceBetween"><div>小計</div><div>¥ ${currency(subTotal)}</div></div>
          <div class="spaceBetween"><div>消費税（${currency(values.taxRate)}%）</div><div>¥ ${currency(tax)}</div></div>
          <div class="spaceBetween mt4" style="font-weight:700"><div>合計</div><div>¥ ${currency(total)}</div></div>
        </div>
      </div>

      <div class="box section">
        <div style="font-weight:700; margin-bottom: 4px;">お振込先</div>
        <div>${escape(values.bankName)} ${escape(values.bankBranch)} 支店 / ${escape(values.bankType)} / ${escape(values.bankNumber)}</div>
        <div>口座名義：${escape(values.bankHolder)}</div>
      </div>

      ${values.notes ? `<div class="box"><div style="font-weight:700; margin-bottom:4px;">備考</div><div>${escape(values.notes)}</div></div>` : ""}
    </div>
  </body>
  </html>`;
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

const GenerateInvoiceWithIframe: React.FC = () => {
  const [itemDraft, setItemDraft] = useState<Item>({ name: "", qty: 1, unitPrice: 0 });
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const formik = useFormik<FormValues>({
    initialValues: defaultValues,
    onSubmit: () => { },
  });

  const html = useMemo(() => buildInvoiceHtml(formik.values), [formik.values]);

  // Ensure the iframe reloads when HTML changes
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    // Use srcdoc to avoid blob/object URLs and keep everything inline
    if ("srcdoc" in iframe) {
      iframe.srcdoc = html;
    } else {
      // Fallback: write directly
      const doc = (iframe as HTMLIFrameElement).contentDocument;
      if (doc) {
        doc.open();
        doc.write(html);
        doc.close();
      }
    }
  }, [html]);

  const handlePrint = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const win = iframe.contentWindow;
    if (!win) return;
    // Ensure layout is ready before print if needed
    if (iframe.contentDocument?.readyState !== "complete") {
      const onLoad = () => {
        win.focus();
        win.print();
        iframe.removeEventListener("load", onLoad);
      };
      iframe.addEventListener("load", onLoad);
      return;
    }
    win.focus();
    win.print();
  };

  return (
    <Flex direction="column" gap={2} w="full" h="full">
      <Heading size="sm">請求書PDF相当（iframe印刷サンプル）</Heading>
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

              <Button colorScheme="green" onClick={handlePrint}>印刷（iframe.print）</Button>
            </Stack>
          </Card>
        </GridItem>

        <GridItem>
          <Card p={0} h="full" overflow="hidden">
            <Box p={2} borderBottomWidth="1px">
              <HStack justify="space-between">
                <Heading size="xs">プレビュー</Heading>
                <Button size="xs" onClick={handlePrint}>印刷</Button>
              </HStack>
            </Box>
            <Box h="full" minH="640px">
              <iframe
                ref={iframeRef}
                title="invoice-preview"
                style={{ width: "100%", height: "100%", minHeight: 640, border: 0, background: "#f5f5f5" }}
              />
            </Box>
          </Card>
        </GridItem>
      </Grid>
    </Flex>
  );
};

export default GenerateInvoiceWithIframe;

