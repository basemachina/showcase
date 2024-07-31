// 下記の変数に、ビューのプレビューに使用する企業アカウントのサブドメイン、プロジェクトID、環境IDを設定してください
const subdomain = "basemachina";
const projectId = "cpil1li9io6g00fcf4sg";
const environmentId = "cpil1li9io6g00fcf4t0";

export default {
  baseUrl: `https://${subdomain}.basemachina.dev/projects/${projectId}/environments/${environmentId}`,
  sourceDir: "./dist",
};
