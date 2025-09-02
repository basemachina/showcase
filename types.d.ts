// `@basemachina/view` の型定義は公開されていないので、モジュールの宣言だけ行う
declare module "@basemachina/view";
declare module "*.ttf" {
  const url: string;
  export default url;
}
declare module "*.otf" {
  const url: string;
  export default url;
}
