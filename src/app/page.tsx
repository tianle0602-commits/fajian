import Link from "next/link";

const features = [
  {
    title: "合同审查",
    description: "AI 智能分析合同条款，识别潜在风险点，提供专业修改建议，助您规避法律陷阱。",
    href: "/contract",
    icon: (
      <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    ),
  },
  {
    title: "劳动合规",
    description: "全面检查企业用工制度合规性，覆盖劳动合同、社保缴纳、工时制度等关键领域。",
    href: "/labor",
    icon: (
      <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    ),
  },
  {
    title: "知产预警",
    description: "实时监测品牌商标状态，智能预警侵权风险，守护您的知识产权安全。",
    href: "/ip",
    icon: (
      <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
      </svg>
    ),
  },
];

export default function HomePage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-primary to-primary/80 px-4 py-12 text-white sm:py-16 md:py-20">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            <span className="text-gold">AI</span> 驱动的法律智能助手
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-base text-white/80 sm:text-lg">
            法鉴致力于将人工智能技术与法律服务深度结合，为企业提供高效率、低成本的合同审查、劳动合规和知产预警一站式解决方案。
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/contract"
              className="rounded-lg bg-gold px-6 py-3 text-sm font-semibold text-primary transition-opacity hover:opacity-90 sm:px-8 sm:text-base"
            >
              立即体验
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:py-16 md:py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-4 text-center text-2xl font-bold text-primary sm:text-3xl">核心功能</h2>
          <p className="mx-auto mb-10 max-w-xl text-center text-sm text-gray-500 sm:mb-14 sm:text-base">
            三大智能法律服务模块，全面守护企业合规经营
          </p>
          <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
            {features.map((feature) => (
              <Link
                key={feature.title}
                href={feature.href}
                className="group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-5 text-gold transition-transform group-hover:scale-110">
                  {feature.icon}
                </div>
                <h3 className="mb-3 text-xl font-bold text-primary group-hover:text-gold transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-500">
                  {feature.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 px-4 py-12 sm:py-16 md:py-20">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="mb-4 text-2xl font-bold text-primary sm:text-3xl">为什么选择法鉴？</h2>
          <p className="mx-auto mb-10 max-w-xl text-sm text-gray-500 sm:mb-14 sm:text-base">
            我们不只是提供工具，更是您企业的法律数字管家
          </p>
          <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 md:grid-cols-4">
            {[
              { title: "AI 驱动", desc: "深度学习法律模型，精准识别潜在风险" },
              { title: "高效便捷", desc: "一键上传，秒级生成专业分析报告" },
              { title: "数据安全", desc: "企业级加密存储，保障数据隐私" },
              { title: "持续更新", desc: "紧跟法律法规变化，保持前沿合规" },
            ].map((item) => (
              <div key={item.title} className="p-6">
                <h3 className="mb-2 text-lg font-bold text-primary">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}