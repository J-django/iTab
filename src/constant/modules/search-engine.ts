import { loadImg, loadSvg } from "../../utils";

import type { SearchEngineItem, SearchEngineIcon } from "@/types";

export const searchEngineRecord: SearchEngineItem[] = [
  {
    key: "baidu",
    title: "百度",
    url: "https://www.baidu.com/s?&tn=15007414_9_pg&ie=utf-8&wd=",
  },
  {
    key: "google",
    title: "Google",
    url: "https://www.google.com/search?q=",
  },
  {
    key: "bing",
    title: "必应",
    url: "https://www.bing.com/search?q=",
  },
  {
    key: "yandex",
    title: "Yandex",
    url: "https://yandex.com/search/?text=",
  },
  {
    key: "360",
    title: "360搜索",
    url: "https://www.so.com/s?q=",
  },
  {
    key: "sougou",
    title: "搜狗",
    url: "https://www.sogou.com/sogou?query=",
  },
  {
    key: "fsou",
    title: "F搜",
    url: "https://fsoufsou.com/search?q=",
  },
  {
    key: "metaso",
    title: "秘塔AI",
    url: "https://metaso.cn/?s=itab1&q=",
  },
  {
    key: "douyin",
    title: "抖音",
    url: "https://www.douyin.com/search/%s?ug_source=lenovo_stream",
  },
  {
    key: "github",
    title: "GitHub",
    url: "https://github.com/search?q=",
  },
  {
    key: "jd",
    title: "京东",
    url: "https://search.jd.com/Search?keyword=",
  },
  {
    key: "weibo",
    title: "微博",
    url: "https://s.weibo.com/weibo?q=",
  },
  {
    key: "bilibili",
    title: "哔哩哔哩",
    url: "https://search.bilibili.com/all?keyword=",
  },
  {
    key: "taobao",
    title: "淘宝",
    url: "https://ai.taobao.com/search/index.htm?pid=mm_31205575_2237000308_114588650482&union_lens=lensId%3APUB%401667806444%402104ee54_0bea_1845102bd01_03e9%4001&key=",
  },
  {
    key: "xiaohongshu",
    title: "小红书",
    url: "https://www.xiaohongshu.com/search_result/?&m_source=itab&keyword=",
  },
  {
    key: "duckduckgo",
    title: "DuckDuckGo",
    url: "https://duckduckgo.com/?q=",
  },
  {
    key: "kaifabaidu",
    title: "开发者搜索",
    url: "https://kaifa.baidu.com/searchPage?wd=",
  },
  {
    key: "zhihu",
    title: "知乎",
    url: "https://www.zhihu.com/search?type=content&q=",
  },
  {
    key: "stackoverflow",
    title: "StackOverflow",
    url: "https://stackoverflow.com/nocaptcha?s=",
  },
  {
    key: "naver",
    title: "NAVER",
    url: "https://search.naver.com/search.naver?&query=312",
  },
  {
    key: "mdn",
    title: "MDN",
    url: "https://developer.mozilla.org/zh-CN/search?q=",
  },
  {
    key: "yahoo",
    title: "Yahoo",
    url: "https://hk.search.yahoo.com/search?p=",
  },
  {
    key: "googlescholar",
    title: "Google Scholar",
    url: "https://scholar.google.com/scholar?q=",
  },
  {
    key: "douban",
    title: "豆瓣",
    url: "https://www.douban.com/search?q=",
  },
  {
    key: "toutiao",
    title: "头条搜索",
    url: "https://so.toutiao.com/search?dvpf=pc&keyword=",
  },
];

export const searchEngineIcons: SearchEngineIcon[] = [
  {
    key: "baidu",
    url: loadSvg("baidu.svg"),
  },
  {
    key: "google",
    url: loadSvg("google.svg"),
  },
  {
    key: "bing",
    url: loadSvg("bing.svg"),
  },
  {
    key: "yandex",
    url: loadSvg("yandex.svg"),
  },
  {
    key: "360",
    url: loadSvg("search.svg"),
  },
  {
    key: "sougou",
    url: loadSvg("sougou.svg"),
  },
  {
    key: "fsou",
    url: loadSvg("fsou.svg"),
  },
  {
    key: "metaso",
    url: loadSvg("metaso.svg"),
  },
  {
    key: "douyin",
    url: loadSvg("douyin.svg"),
  },
  {
    key: "github",
    url: loadSvg("github.svg"),
  },
  {
    key: "jd",
    url: loadSvg("jd.svg"),
  },
  {
    key: "weibo",
    url: loadSvg("weibo.svg"),
  },
  {
    key: "bilibili",
    url: loadSvg("bilibili.svg"),
  },
  {
    key: "taobao",
    url: loadSvg("taobao.svg"),
  },
  {
    key: "xiaohongshu",
    url: loadSvg("xiaohongshu.svg"),
  },
  {
    key: "duckduckgo",
    url: loadSvg("duckduckgo.svg"),
  },
  {
    key: "kaifabaidu",
    url: loadSvg("kaifabaidu.svg"),
  },
  {
    key: "zhihu",
    url: loadSvg("zhihu.svg"),
  },
  {
    key: "stackoverflow",
    url: loadSvg("stackoverflow.svg"),
  },
  {
    key: "naver",
    url: loadSvg("naver.svg"),
  },
  {
    key: "mdn",
    url: loadSvg("mdn.svg"),
  },
  {
    key: "yahoo",
    url: loadSvg("yahoo.svg"),
  },
  {
    key: "googlescholar",
    url: loadSvg("googlescholar.svg"),
  },
  {
    key: "douban",
    url: loadSvg("douban.svg"),
  },
  {
    key: "toutiao",
    url: loadSvg("toutiao.svg"),
  },
  {
    key: "custom",
    url: loadImg("custom.png"),
  },
];

export const searchCookie =
  'BIDUPSID=59C71AE2DB908F5E4661C3624ACBA905; PSTM=1757182827; BAIDUID=59C71AE2DB908F5E685E9F4C98986085:FG=1; BD_UPN=123253; MAWEBCUID=web_jwkwtFadCWEapYbWEmOXEfOFVDVTrnImIWtyIedrIhJARMTJMQ; BAIDUID_BFESS=59C71AE2DB908F5E685E9F4C98986085:FG=1; ZFY=49LtncHfLkywnZObbU5kOX:AG7nIFM4cJ8Bno4M2YLP4:C; __bid_n=1992a80f3554944f4f3359; BA_HECTOR=a02k0l2h850k2h840025200505a00i1kctj4n24; BDORZ=B490B5EBF6F3CD402E515D22BCDA1598; H_PS_PSSID=63148_63327_64561_64654_64694_64814_64816_64833_64908_64920_64981_65134_65140_65142_65137_65194_65204_65227_65247_65144_65258_65270_65361_65367; BD_HOME=1; RT="z=1&dm=baidu.com&si=96d28ccd-890d-467b-9cf7-b20441ef55ce&ss=mftft9ga&sl=1&tt=211&bcn=https%3A%2F%2Ffclog.baidu.com%2Flog%2Fweirwood%3Ftype%3Dperf&ld=2x8&ul=9dc&hd=9di"; BD_CK_SAM=1; PSINO=6; delPer=0; BDSVRTM=348; H_WISE_SIDS=63148_63327_64561_64654_64694_64814_64816_64833_64908_64920_64981_65134_65140_65142_65137_65194_65204_65227_65247_65144_65258_65270_65361_65367; baikeVisitId=b972dd3c-cdf5-454c-aa3d-aa76c2200540; COOKIE_SESSION=62398_1_7_9_6_12_0_0_7_6_0_4_133091_0_0_1_1758383260_1758445658_1758445657%7C9%23541901_10_1758445657%7C4; shifen[964873820670_66178]=1758445659; shifen[8877318_91638]=1758445659; BCLID=11524629607583076214; BCLID_BFESS=11524629607583076214; BDSFRCVID=md8OJexroGWN3M5szFrVUmWSxQGQd7cTDYrEOwXPsp3LGJLVvfe5EG0PtOi2xEPM4ch-ogKK3gOTH4PF_2uxOjjg8UtVJeC6EG0Ptf8g0M5; BDSFRCVID_BFESS=md8OJexroGWN3M5szFrVUmWSxQGQd7cTDYrEOwXPsp3LGJLVvfe5EG0PtOi2xEPM4ch-ogKK3gOTH4PF_2uxOjjg8UtVJeC6EG0Ptf8g0M5; H_BDCLCKID_SF=JRAq_C8MJKK3fP36q4Oo5tD_hgT22-usJITi2hcH0KLKMpP4bj--KnIzKRjP2lbgMN6KVIjlaMb1MRjv3MnVMTL_DfJLQ-RNMgjWQl5TtUJheCnTDMRPMb_BKloyKMnitKv9-pP2LpQrh459XP68bTkA5bjZKxtq3mkjbPbDfn02JKKujj0KjjcLeH_s5JtXKD600PK8Kb7Vbn6geMnkbJkXhPJUWjJuJ67EKtoCQR6RVPnhQpQfjPt7QbrH0xRfyNReQIO13hcdS4QIbjopQT8r5-n0JJv4LgDJ3bPEab3vOIOTXpO1jh8zBN5thURB2DkO-4bCWJ5TMl5jDh3Mb6ksD-FtqtJHKbDD_KLbfUK; H_BDCLCKID_SF_BFESS=JRAq_C8MJKK3fP36q4Oo5tD_hgT22-usJITi2hcH0KLKMpP4bj--KnIzKRjP2lbgMN6KVIjlaMb1MRjv3MnVMTL_DfJLQ-RNMgjWQl5TtUJheCnTDMRPMb_BKloyKMnitKv9-pP2LpQrh459XP68bTkA5bjZKxtq3mkjbPbDfn02JKKujj0KjjcLeH_s5JtXKD600PK8Kb7Vbn6geMnkbJkXhPJUWjJuJ67EKtoCQR6RVPnhQpQfjPt7QbrH0xRfyNReQIO13hcdS4QIbjopQT8r5-n0JJv4LgDJ3bPEab3vOIOTXpO1jh8zBN5thURB2DkO-4bCWJ5TMl5jDh3Mb6ksD-FtqtJHKbDD_KLbfUK';
