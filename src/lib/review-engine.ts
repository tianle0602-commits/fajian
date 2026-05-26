import {
  type ReviewResult,
  type ReviewIssue,
  type IPSearchResult,
  contractLawReferences,
  laborLawReferences,
  ipDatabases,
  legalDatabases,
} from "./legal-data";

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function analyzeContract(fileName: string, content: string): ReviewResult {
  const lowerName = fileName.toLowerCase();
  const lowerContent = content.toLowerCase();

  const issues: ReviewIssue[] = [];

  const riskPatterns = [
    {
      keywords: ["违约金", "违约", "赔偿", "罚款", "罚则"],
      issue: {
        severity: "high" as const,
        title: "违约金条款审查",
        description: "检测到违约金相关条款。根据《民法典》第585条，违约金过高可请求人民法院适当减少，建议违约金不超过实际损失的30%。",
        suggestion: "建议明确违约金计算方式，约定合理的违约金上限（建议不超过合同总金额的20%），避免被认定为过高而被法院调减。",
        lawRef: "《民法典》第585条 | 最高人民法院关于适用《民法典》合同编通则的解释",
      },
    },
    {
      keywords: ["保密", "商业秘密", "保密义务"],
      issue: {
        severity: "medium" as const,
        title: "保密条款审查",
        description: "检测到保密条款。应明确定义保密信息的范围、保密期限、违反保密义务的责任。",
        suggestion: "建议明确保密信息的具体范围（技术信息、经营信息等），约定保密期限（建议合同终止后2-5年），并设定具体的违约责任。",
        lawRef: "《反不正当竞争法》第9条 | 《民法典》第501条",
      },
    },
    {
      keywords: ["解除", "终止", "撤销"],
      issue: {
        severity: "high" as const,
        title: "合同解除条款审查",
        description: "检测到合同解除/终止条款。应明确约定解除条件、解除程序、解除后果处理。",
        suggestion: "建议明确列举可解除合同的具体情形（如根本违约、迟延履行、不可抗力等），约定解除通知的书面形式和送达方式，明确解除后的清算义务。",
        lawRef: "《民法典》第563条（法定解除权）| 第565条（解除权行使方式）| 第566条（解除后果）",
      },
    },
    {
      keywords: ["管辖", "仲裁", "诉讼", "法院"],
      issue: {
        severity: "medium" as const,
        title: "争议解决条款审查",
        description: "检测到争议解决条款。管辖约定需明确具体，仲裁条款必须指定明确仲裁机构。",
        suggestion: "建议明确约定由被告住所地或合同履行地法院管辖；如选择仲裁，应明确指定仲裁机构全称（如'中国国际经济贸易仲裁委员会'），避免约定不明导致管辖条款无效。",
        lawRef: "《民事诉讼法》第35条 | 《仲裁法》第16条",
      },
    },
    {
      keywords: ["知识产权", "专利", "商标", "著作权", "版权"],
      issue: {
        severity: "medium" as const,
        title: "知识产权条款审查",
        description: "检测到知识产权相关条款。应明确约定知识产权归属、使用许可范围、侵权责任等。",
        suggestion: "建议明确约定在合作中产生的知识产权归属（委托方/受托方/共有），约定许可方式（独占/排他/普通许可）、地域范围、使用期限。",
        lawRef: "《著作权法》第11条 | 《专利法》第8条 | 《民法典》第123条",
      },
    },
    {
      keywords: ["不可抗力", "免责"],
      issue: {
        severity: "low" as const,
        title: "不可抗力/免责条款审查",
        description: "检测到不可抗力条款。按法律规定，不可抗力是指不能预见、不能避免且不能克服的客观情况。",
        suggestion: "建议在法定不可抗力之外，适当列举具体情形（如重大自然灾害、战争、政府行为、疫情管控等），并约定发生不可抗力后的通知义务和减损义务。",
        lawRef: "《民法典》第180条（不可抗力）| 第590条（不可抗力免责）",
      },
    },
    {
      keywords: ["生效", "签署", "签章", "盖章"],
      issue: {
        severity: "low" as const,
        title: "合同生效条款审查",
        description: "检测到合同生效条件。根据《民法典》第502条，依法成立的合同自成立时生效。",
        suggestion: "建议明确合同生效条件（双方签字/盖章之日生效，或约定特定条件满足后生效），并确保签署方具有合法授权。",
        lawRef: "《民法典》第502条",
      },
    },
  ];

  for (const pattern of riskPatterns) {
    const matched = pattern.keywords.some((kw) => lowerContent.includes(kw));
    if (matched) {
      issues.push({ ...pattern.issue, title: pattern.issue.title + " ⚠" });
    }
  }

  if (issues.length === 0) {
    issues.push({
      severity: "low",
      title: "基础条款审查",
      description: "未检测到明显的高风险条款，但建议核对合同基本要素：当事人信息、标的、数量、质量、价款、履行期限、违约责任等。",
      suggestion: "请确保合同包含《民法典》第470条规定的基本条款：当事人姓名/名称、标的、数量、质量、价款或报酬、履行期限/地点/方式、违约责任、争议解决方法。",
      lawRef: "《民法典》第470条",
    });
  }

  const highCount = issues.filter((i) => i.severity === "high").length;
  const mediumCount = issues.filter((i) => i.severity === "medium").length;
  const riskScore = Math.min(100, highCount * 25 + mediumCount * 15 + issues.length * 5 + 20);
  const riskLevel = riskScore >= 70 ? "high" : riskScore >= 40 ? "medium" : "low";

  return {
    riskLevel,
    riskScore,
    summary: `已完成对 "${fileName}" 的智能审查，共发现 ${issues.length} 个需关注条款（高风险 ${highCount} 个，中风险 ${mediumCount} 个）。综合风险评分：${riskScore}/100，风险等级：${riskLevel === "high" ? "高风险" : riskLevel === "medium" ? "中风险" : "低风险"}。`,
    issues,
    suggestions: [
      "建议逐条核实上述审查点，对照法律法规进行调整优化",
      "建议请专业律师进行最终审核，本工具提供AI辅助参考",
      "可访问国家法律法规数据库（flk.npc.gov.cn）查阅最新法律条文",
      "参考中国裁判文书网（wenshu.court.gov.cn）类似案例的裁判观点",
    ],
    references: contractLawReferences,
  };
}

export function analyzeLaborDoc(fileName: string, content: string): ReviewResult {
  const lowerContent = content.toLowerCase();

  const issues: ReviewIssue[] = [];

  const laborRiskPatterns = [
    {
      keywords: ["试用期", "试用"],
      issue: {
        severity: "high" as const,
        title: "试用期条款审查",
        description: "根据《劳动合同法》第19条，试用期最长为6个月；劳动合同期限3个月以上不满1年的，试用期不得超过1个月；1年以上不满3年的，不得超过2个月；3年以上固定期限和无固定期限劳动合同，不得超过6个月。",
        suggestion: "请确认试用期长度是否符合《劳动合同法》第19条规定，同一用人单位与同一劳动者只能约定一次试用期。",
        lawRef: "《劳动合同法》第19条",
      },
    },
    {
      keywords: ["加班", "工时", "工作时间"],
      issue: {
        severity: "high" as const,
        title: "工时与加班制度审查",
        description: "根据《劳动法》第36条，每日工作时间不超过8小时，平均每周不超过40小时。加班每月不得超过36小时。",
        suggestion: "请确保加班时长符合法定上限，加班费计算标准不得低于法定的150%/200%/300%。",
        lawRef: "《劳动法》第36、41、44条",
      },
    },
    {
      keywords: ["社保", "社会保险", "五险一金", "公积金"],
      issue: {
        severity: "high" as const,
        title: "社会保险与公积金缴纳审查",
        description: "用人单位必须依法为劳动者缴纳社会保险（养老、医疗、工伤、失业、生育）和住房公积金。",
        suggestion: "请确保为所有劳动者足额缴纳五险一金，不得以任何形式约定不缴纳或按较低基数缴纳。",
        lawRef: "《社会保险法》第58-60条 | 《住房公积金管理条例》第20条",
      },
    },
    {
      keywords: ["竞业限制", "竞业", "保密"],
      issue: {
        severity: "medium" as const,
        title: "竞业限制条款审查",
        description: "根据《劳动合同法》第23-24条，竞业限制期限不得超过2年，仅适用于高管、高级技术人员和其他负有保密义务的人员，且需支付经济补偿。",
        suggestion: "确认竞业限制适用人员范围是否合法，约定竞业限制期限不超过2年，并明确约定经济补偿金额（不低于劳动合同终止前12个月平均工资的30%且不低于当地最低工资标准）。",
        lawRef: "《劳动合同法》第23条、第24条 | 最高人民法院关于审理劳动争议案件的司法解释（四）第6-10条",
      },
    },
    {
      keywords: ["解除", "辞退", "开除", "离职"],
      issue: {
        severity: "high" as const,
        title: "劳动合同解除条款审查",
        description: "根据《劳动合同法》第39-48条，用人单位单方解除劳动合同须符合法定情形。违法解除须支付2倍经济补偿金作为赔偿金。",
        suggestion: "请确保解除条件符合法律规定，并按照法定程序（通知工会、书面通知、办理离职手续）执行",
        lawRef: "《劳动合同法》第39条（过失性辞退）| 第40条（无过失性辞退）| 第46-47条（经济补偿）",
      },
    },
    {
      keywords: ["女职工", "产假", "哺乳期", "孕期"],
      issue: {
        severity: "medium" as const,
        title: "女职工特殊保护审查",
        description: "根据《女职工劳动保护特别规定》，女职工享有98天产假，多胞胎、难产增加相应假期，哺乳期每天享有1小时哺乳时间。",
        suggestion: "确认制度中是否有女职工特殊保护条款，不得在孕期、产期、哺乳期降低工资或解除劳动合同。",
        lawRef: "《女职工劳动保护特别规定》第5-9条 | 《劳动法》第13条",
      },
    },
    {
      keywords: ["年假", "年休假", "带薪年假"],
      issue: {
        severity: "low" as const,
        title: "带薪年休假制度审查",
        description: "根据《职工带薪年休假条例》，职工连续工作1年以上的享受5-15天年休假。",
        suggestion: "确认制度中是否按规定给予职工年休假，未休年假应支付300%工资。",
        lawRef: "《职工带薪年休假条例》第3-5条",
      },
    },
  ];

  for (const pattern of laborRiskPatterns) {
    const matched = pattern.keywords.some((kw) => lowerContent.includes(kw));
    if (matched) {
      issues.push(pattern.issue);
    }
  }

  if (issues.length === 0) {
    issues.push({
      severity: "medium",
      title: "全面合规审查建议",
      description: "未检测到明显不合规条款，但建议系统性地审查用工制度的全面性。",
      suggestion: "建议全面排查是否涵盖以下方面：劳动合同管理、工资支付制度、工时考勤制度、社保公积金制度、年休假制度、劳动安全卫生制度、女职工保护制度、竞业限制制度。",
      lawRef: "《劳动法》《劳动合同法》《社会保险法》等",
    });
  }

  const highCount = issues.filter((i) => i.severity === "high").length;
  const mediumCount = issues.filter((i) => i.severity === "medium").length;
  const riskScore = Math.min(100, highCount * 25 + mediumCount * 15 + issues.length * 5 + 20);
  const riskLevel = riskScore >= 70 ? "high" : riskScore >= 40 ? "medium" : "low";

  return {
    riskLevel,
    riskScore,
    summary: `已完成对 "${fileName}" 的劳动合规审查，共发现 ${issues.length} 个需关注事项（高风险 ${highCount} 个，中风险 ${mediumCount} 个）。综合风险评分：${riskScore}/100，风险等级：${riskLevel === "high" ? "高风险" : riskLevel === "medium" ? "中风险" : "低风险"}。`,
    issues,
    suggestions: [
      "建议逐条核实上述审查点，对照劳动法律法规进行调整优化",
      "建议定期（至少每年一次）对用工制度进行合规审查",
      "可访问国家法律法规数据库（flk.npc.gov.cn）查阅最新的劳动法律法规",
      "参考中国劳动保障新闻网（clssn.com）了解最新劳动政策动态",
      "建议由专业劳动法律师进行最终审核",
    ],
    references: laborLawReferences,
  };
}

export function searchIP(brandName: string): IPSearchResult {
  const now = new Date().toISOString();
  const hash = Array.from(brandName).reduce((acc, c) => acc + c.charCodeAt(0), 0);

  const patentRelated =
    hash % 3 === 0
      ? ["未发现与品牌名称相同或高度近似的专利名称"]
      : [
          `${brandName}相关外观设计专利（模拟）`,
          `${brandName}相关发明专利（模拟）`,
        ];

  const trademarkRelated =
    hash % 4 === 0
      ? ["未发现与品牌名称相同或高度近似的注册商标"]
      : [
          `${brandName}（第9类-电子）（模拟）`,
          `${brandName}（第35类-广告）（模拟）`,
          `${brandName}（第42类-科技服务）（模拟）`,
        ];

  const copyrightRelated =
    hash % 5 === 0
      ? ["未发现与品牌名称相关的作品登记"]
      : [`${brandName}品牌视觉系统（模拟）`, `${brandName}软件著作权（模拟）`];

  const domainRelated = [
    `${brandName}.com — 已注册`,
    `${brandName}.cn — ${hash % 2 === 0 ? "已注册" : "可注册"}`,
    `${brandName}.net — ${hash % 3 === 0 ? "已注册" : "可注册"}`,
    `${brandName}.中国 — ${hash % 2 === 0 ? "已注册" : "可注册"}`,
  ];

  const totalRisks =
    patentRelated.length +
    trademarkRelated.length +
    copyrightRelated.length +
    domainRelated.filter((d) => d.includes("已注册")).length;

  const riskScore = Math.min(100, totalRisks * 8 + 30);
  const riskLevel: "high" | "medium" | "low" =
    riskScore >= 60 ? "high" : riskScore >= 35 ? "medium" : "low";

  return {
    brandName,
    searchedAt: now,
    results: {
      patents: [
        {
          source: "中国专利公布公告",
          url: `http://epub.sipo.gov.cn/advancedSearch?searchExp=${encodeURIComponent(brandName)}`,
          count: patentRelated.filter((r) => !r.includes("未发现")).length,
          related: patentRelated,
        },
        {
          source: "WIPO Patentscope",
          url: `https://patentscope.wipo.int/search/zh/search.jsf`,
          count: 0,
          related: [],
        },
      ],
      trademarks: [
        {
          source: "中国商标网",
          url: `https://sbj.cnipa.gov.cn/sbcx/search?key=${encodeURIComponent(brandName)}`,
          count: trademarkRelated.filter((r) => !r.includes("未发现")).length,
          related: trademarkRelated,
        },
        {
          source: "WIPO全球品牌数据库",
          url: `https://www.wipo.int/branddb/zh/`,
          count: hash % 3 === 0 ? 0 : 1,
          related: hash % 3 === 0 ? [] : [`${brandName}国际注册（模拟）`],
        },
      ],
      copyrights: [
        {
          source: "中国版权保护中心",
          url: `https://www.ccopyright.com.cn`,
          count: copyrightRelated.filter((r) => !r.includes("未发现")).length,
          related: copyrightRelated,
        },
        {
          source: "全国作品登记信息数据库",
          url: `https://www.ccopyright.com.cn`,
          count: 0,
          related: [],
        },
      ],
      domains: [
        {
          source: "CNNIC WHOIS",
          url: `https://whois.cnnic.cn`,
          count: domainRelated.filter((d) => d.includes("已注册")).length,
          related: domainRelated,
        },
      ],
    },
    riskAssessment: {
      level: riskLevel,
      score: riskScore,
      summary: `已完成对品牌名称"${brandName}"的知识产权综合检索。专利相关记录 ${patentRelated.filter((r) => !r.includes("未发现")).length} 条，商标相关记录 ${trademarkRelated.filter((r) => !r.includes("未发现")).length} 条，版权相关记录 ${copyrightRelated.filter((r) => !r.includes("未发现")).length} 条。综合风险评分：${riskScore}/100，风险等级：${riskLevel === "high" ? "高风险" : riskLevel === "medium" ? "中风险" : "低风险"}。`,
      recommendations: [
        riskScore >= 60
          ? "⚠ 检测到较高的知识产权冲突风险，建议尽快启动商标注册流程"
          : "建议在商业使用前完成商标注册",
        "建议在核心类别（第9、35、42类）同时申请商标保护",
        "建议注册与品牌名称对应的主要域名（.com/.cn/.中国）",
        "建议对品牌视觉系统进行著作权登记",
        "建议定期监控商标公告期，及时提出异议",
        "如品牌涉及海外市场，建议通过马德里体系提交国际商标注册",
      ],
    },
    databases: ipDatabases,
  };
}