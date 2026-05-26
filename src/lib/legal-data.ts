export interface LegalReference {
  name: string;
  url: string;
  description: string;
  category: string;
}

export const legalDatabases: LegalReference[] = [
  {
    name: "国家法律法规数据库",
    url: "https://flk.npc.gov.cn",
    description: "全国人大常委会办公厅维护的官方法律法规数据库",
    category: "法律法规",
  },
  {
    name: "中国裁判文书网",
    url: "https://wenshu.court.gov.cn",
    description: "最高人民法院建设的全国法院裁判文书公开平台",
    category: "司法案例",
  },
  {
    name: "北大法宝",
    url: "https://www.pkulaw.com",
    description: "中国最早、最大的法律数据库之一",
    category: "法律检索",
  },
  {
    name: "中国法律信息网",
    url: "https://www.lawinfochina.com",
    description: "北大法律英文网，提供中英双语法律法规",
    category: "法律检索",
  },
  {
    name: "信用中国",
    url: "https://www.creditchina.gov.cn",
    description: "国家社会信用体系建设官方网站",
    category: "企业信用",
  },
  {
    name: "国家企业信用信息公示系统",
    url: "https://www.gsxt.gov.cn",
    description: "市场监督管理总局企业信用信息平台",
    category: "企业信用",
  },
  {
    name: "中国劳动保障新闻网",
    url: "https://www.clssn.com",
    description: "人力资源和社会保障领域权威媒体",
    category: "劳动法规",
  },
];

export const contractLawReferences: LegalReference[] = [
  {
    name: "中华人民共和国民法典",
    url: "https://flk.npc.gov.cn/detail2.html?ZmY4MDgxODE3OTZhNjM2YTAxNzk4NTk4MTJiZjA1Yjk",
    description: "民法典合同编（第三编），2021年1月1日起施行",
    category: "核心法律",
  },
  {
    name: "最高人民法院关于适用《民法典》合同编通则的解释",
    url: "https://www.court.gov.cn",
    description: "合同纠纷案件审理的司法解释",
    category: "司法解释",
  },
  {
    name: "全国法院民商事审判工作会议纪要",
    url: "https://www.court.gov.cn",
    description: "最高法关于合同纠纷审理的重要指导意见（九民纪要）",
    category: "司法文件",
  },
];

export const laborLawReferences: LegalReference[] = [
  {
    name: "中华人民共和国劳动法",
    url: "https://flk.npc.gov.cn/detail2.html?ZmY4MDgxODE3OTZhNjM2YTAxNzk4NTk4MTJiZjA1Yjk",
    description: "1995年1月1日起施行，2018年修正",
    category: "核心法律",
  },
  {
    name: "中华人民共和国劳动合同法",
    url: "https://flk.npc.gov.cn",
    description: "2008年1月1日起施行，2012年修正",
    category: "核心法律",
  },
  {
    name: "中华人民共和国社会保险法",
    url: "https://flk.npc.gov.cn",
    description: "2011年7月1日起施行，2018年修正",
    category: "核心法律",
  },
  {
    name: "工伤保险条例",
    url: "https://flk.npc.gov.cn",
    description: "2004年1月1日起施行，2010年修订",
    category: "行政法规",
  },
  {
    name: "女职工劳动保护特别规定",
    url: "https://flk.npc.gov.cn",
    description: "2012年4月28日起施行",
    category: "行政法规",
  },
  {
    name: "劳动合同法实施条例",
    url: "https://flk.npc.gov.cn",
    description: "2008年9月18日起施行",
    category: "行政法规",
  },
];

export const ipDatabases: LegalReference[] = [
  {
    name: "中国专利公布公告",
    url: "http://epub.sipo.gov.cn",
    description: "国家知识产权局(SIPO/CNIPA)官方专利查询系统",
    category: "专利库",
  },
  {
    name: "中国商标网",
    url: "https://sbj.cnipa.gov.cn/sbcx",
    description: "国家知识产权局商标局官方商标查询平台",
    category: "商标库",
  },
  {
    name: "中国版权保护中心",
    url: "https://www.ccopyright.com.cn",
    description: "国家版权局直属的版权登记与查询机构",
    category: "版权库",
  },
  {
    name: "WIPO全球品牌数据库",
    url: "https://www.wipo.int/branddb",
    description: "世界知识产权组织国际商标查询系统",
    category: "国际商标",
  },
  {
    name: "CNNIC域名信息查询",
    url: "https://whois.cnnic.cn",
    description: "中国互联网络信息中心官方域名Whois查询",
    category: "域名库",
  },
  {
    name: "工信部ICP备案查询",
    url: "https://beian.miit.gov.cn",
    description: "工业和信息化部网站备案信息查询",
    category: "域名库",
  },
  {
    name: "全国作品登记信息数据库",
    url: "https://www.ccopyright.com.cn",
    description: "中国版权保护中心作品登记查询",
    category: "版权库",
  },
  {
    name: "马德里国际商标体系",
    url: "https://www.wipo.int/madrid",
    description: "WIPO马德里体系国际商标注册查询",
    category: "国际商标",
  },
];

export interface ReviewResult {
  riskLevel: "high" | "medium" | "low";
  riskScore: number;
  summary: string;
  issues: ReviewIssue[];
  suggestions: string[];
  references: LegalReference[];
}

export interface ReviewIssue {
  severity: "high" | "medium" | "low";
  title: string;
  description: string;
  suggestion: string;
  lawRef: string;
}

export interface IPSearchResult {
  brandName: string;
  searchedAt: string;
  results: {
    patents: { source: string; url: string; count: number; related: string[] }[];
    trademarks: { source: string; url: string; count: number; related: string[] }[];
    copyrights: { source: string; url: string; count: number; related: string[] }[];
    domains: { source: string; url: string; count: number; related: string[] }[];
  };
  riskAssessment: {
    level: "high" | "medium" | "low";
    score: number;
    summary: string;
    recommendations: string[];
  };
  databases: LegalReference[];
}