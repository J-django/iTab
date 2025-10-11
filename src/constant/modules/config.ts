import type { Config } from "@/types";

export const defaultConfig: Config = {
  // 语言
  lang: "ZH_CN",

  // 主题
  theme: {
    color: "#0d6efd",
    mode: "system",
  },

  // 布局
  layout: {
    sidebar: {
      placement: "left",
      visible: true,
    },
  },

  // 墙纸
  wallpaper: {
    type: "picture",
    src: "https://files.codelife.cc/itab/defaultWallpaper/defaultWallpaper.webp",
    auto: false,
    overlay: false,
    blur: false,

    // type: "video",
    // src: "https://files.codelife.cc/itab/defaultWallpaper/videos/88.mp4",

    // type: "color",
    // src: "linear-gradient(0deg,#a18cd1 0%, #fbc2eb 100%)",
  },

  // 时钟
  clock: {
    show: true,
    color: "#ffffff",
    size: 70,
    bold: false,
    date: true,
    second: false,
    week: true,
    hover24: true,
    lunar: true,
  },

  // 搜索引擎
  searchEngine: {
    show: true,
    use: "360",
    list: [
      {
        key: "360",
        title: "360搜索",
        url: "https://www.so.com/s?src=lm&ls=sm3022768&lm_extend=ctype:31&q=",
      },
      {
        key: "baidu",
        title: "百度",
        url: "https://www.baidu.com/s?wd=%s&tn=75144485_6_dg&ch=2&ie=utf-8",
      },
      {
        key: "bing",
        title: "必应",
        url: "https://www.bing.com/search?form=QBLH&q=",
      },
      {
        key: "metaso",
        title: "秘塔AI",
        url: "https://metaso.cn/?s=3mitab&referrer_s=3mitab&q=",
      },
      {
        key: "google",
        title: "Google",
        url: "https://www.google.com/search?q=",
      },
    ],
  },
};
