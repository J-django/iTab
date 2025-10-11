declare module "vite-plugin-eslint" {
  import { Plugin } from "vite";
  interface Options {
    include?: string | string[];
    exclude?: string | string[];
    cache?: boolean;
  }
  function eslintPlugin(options?: Options): Plugin;
  export default eslintPlugin;
}
