// 下記の環境変数を設定するか、値を直接書き換えてください
const subdomain = process.env.BM_VIEW_PREVIEW_SUBDOMAIN;
const projectId = process.env.BM_VIEW_PREVIEW_PROJECT_ID;
const environmentId = process.env.BM_VIEW_PREVIEW_ENVIRONMENT_ID;

export default {
  baseUrl: `https://${subdomain}.basemachina.com/projects/${projectId}/environments/${environmentId}`,
  sourceDir: "./dist",
};
