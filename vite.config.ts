import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import UnoCSS from "unocss/vite";
import { createHtmlPlugin } from "vite-plugin-html";
import eslintPlugin from "vite-plugin-eslint";
import viteCompression from "vite-plugin-compression";
import { resolve } from "path";

export default defineConfig(({ mode }) => {
  // Env
  const env = loadEnv(mode, __dirname);

  return {
    // Base
    base: `./`,

    // Plugin
    plugins: [
      react(),
      UnoCSS(),
      createHtmlPlugin({
        minify: true,
        inject: {
          data: {
            title: env.VITE_GLOB_APP_TITLE,
          },
        },
      }),
      eslintPlugin({
        include: ["src/**/*.ts", "src/**/*.tsx", "src/**/*.js", "src/**/*.jsx"],
        exclude: ["node_modules"],
        cache: false,
      }),
      viteCompression({
        filter: /\.(js|css|json|html)(\?.*)?$/i, // 需要压缩的文件
        threshold: 10240, // 如果体积大于阈值，将被压缩，单位为b，体积过小时请不要压缩，以免适得其反
        algorithm: "gzip", // 压缩方式
        ext: "gz", // 后缀名
        deleteOriginFile: false, // 压缩后是否删除压缩源文件
      }),
    ],

    // Resolve
    resolve: {
      alias: {
        "@": resolve(__dirname, `./src`),
      },
    },

    // Server
    server: {
      open: true,
      host: true,
      proxy: {
        "/search-api": {
          target: env.VITE_SEARCH_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/search-api/, ""),
        },
      },
    },

    // Build
    build: {
      cssCodeSplit: true, //css 拆分,true为拆分
      sourcemap: false, //不生成sourcemap，false 为不生成
      assetsInlineLimit: 10 * 1000, //小于该值 10k, 图片将打包成Base64
    },
  };
});
