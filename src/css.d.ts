// This file contains module declarations for CSS files.

declare module "*.css?string" {
  const string: string;
  export default string;
}

declare module "*.css?apply";

declare module "*.css?sheet" {
  const sheet: CSSStyleSheet;
  export default sheet;
}
