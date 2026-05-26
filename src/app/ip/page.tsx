"use client";

import { useState } from "react";
import { searchIP } from "@/lib/review-engine";
import type { IPSearchResult } from "@/lib/legal-data";

export default function IPPage() {
  const [brandName, setBrandName] = useState("");
  const [searching, setSearching] = useState(false);
  const [result, setResult] = useState<IPSearchResult | null>(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!brandName.trim()) return;
    setSearching(true);
    setError("");
    setResult(null);

    try {
      const data = searchIP(brandName.trim());
      setResult(data);
    } catch {
      setError("检索失败，请重试");
    } finally {
      setSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
      <div className="mb-8 sm:mb-10 text-center">
        <h1 className="mb-3 text-2xl font-bold text-primary sm:text-3xl md:text-4xl">知产预警</h1>
        <p className="text-sm text-gray-500 sm:text-base">
          接入官方权威数据库，全方位检索品牌的知识产权状态
        </p>
      </div>

      <div className="mx-auto rounded-2xl bg-white p-5 shadow-sm sm:p-8">
        <div className="mb-6 text-center">
          <div className="mb-4 flex justify-center">
            <svg className="h-10 w-10 text-gold sm:h-14 sm:w-14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </div>
          <p className="text-base font-semibold text-primary sm:text-lg">输入品牌名称，一键检索知识产权风险</p>
          <p className="mt-1 text-xs text-gray-400 sm:text-sm">
            系统将检索专利库、商标库、版权库、域名库等权威数据源
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="请输入品牌名称…"
            disabled={searching}
            className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition-colors focus:border-gold focus:bg-white disabled:opacity-60"
          />
          <button
            onClick={handleSearch}
            disabled={searching || !brandName.trim()}
            className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-primary/90 disabled:opacity-50 sm:px-8"
          >
            {searching ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-30" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
                检索中…
              </span>
            ) : (
              "开始检测"
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-10 space-y-8">
          <div className={`rounded-xl border p-6 ${
            result.riskAssessment.level === "high"
              ? "text-red-600 bg-red-50 border-red-200"
              : result.riskAssessment.level === "medium"
                ? "text-yellow-600 bg-yellow-50 border-yellow-200"
                : "text-green-600 bg-green-50 border-green-200"
          }`}>
            <div className="mb-2 flex items-center gap-3">
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                result.riskAssessment.level === "high"
                  ? "bg-red-100 text-red-700"
                  : result.riskAssessment.level === "medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
              }`}>
                {result.riskAssessment.level === "high" ? "高风险" : result.riskAssessment.level === "medium" ? "中风险" : "低风险"}
              </span>
              <span className="text-2xl font-bold">{result.riskAssessment.score}/100</span>
            </div>
            <p className="text-sm leading-relaxed">{result.riskAssessment.summary}</p>
          </div>

          <div>
            <h2 className="mb-4 text-xl font-bold text-primary">数据库检索结果</h2>
            <div className="grid gap-6 lg:grid-cols-2">
              <DatabaseSection
                icon="📜"
                title="专利库"
                color="border-blue-200 bg-blue-50"
                items={result.results.patents}
              />
              <DatabaseSection
                icon="™️"
                title="商标库"
                color="border-purple-200 bg-purple-50"
                items={result.results.trademarks}
              />
              <DatabaseSection
                icon="©️"
                title="版权库"
                color="border-teal-200 bg-teal-50"
                items={result.results.copyrights}
              />
              <DatabaseSection
                icon="🌐"
                title="域名库"
                color="border-orange-200 bg-orange-50"
                items={result.results.domains}
              />
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-lg font-bold text-primary">风险应对建议</h2>
            <ul className="space-y-2">
              {result.riskAssessment.recommendations.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  {r}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-3 text-lg font-bold text-primary">参考数据库来源</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {result.databases.map((db, i) => (
                <a
                  key={i}
                  href={db.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:border-gold hover:shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {db.category}
                    </span>
                    <span className="font-semibold text-primary">{db.name}</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-400">{db.description}</p>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DatabaseSection({
  icon,
  title,
  color,
  items,
}: {
  icon: string;
  title: string;
  color: string;
  items: { source: string; url: string; count: number; related: string[] }[];
}) {
  return (
    <div className={`rounded-lg border p-5 ${color}`}>
      <h3 className="mb-3 flex items-center gap-2 font-bold text-primary">
        <span className="text-lg">{icon}</span>
        {title}
      </h3>
      {items.map((item, i) => (
        <div key={i} className="mb-3 last:mb-0">
          <div className="mb-1 flex items-center justify-between">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-primary hover:text-gold transition-colors"
            >
              {item.source}
            </a>
            <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-gray-500">
              {item.count > 0 ? `${item.count} 条相关` : "无相关"}
            </span>
          </div>
          {item.related.length > 0 && (
            <ul className="space-y-1">
              {item.related.map((r, j) => (
                <li key={j} className="text-xs text-gray-500">
                  · {r}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}