"use client";

import { useState } from "react";
import FileUpload from "@/components/FileUpload";
import { analyzeContract } from "@/lib/review-engine";
import { readFileAsText } from "@/lib/file-reader";
import type { ReviewResult } from "@/lib/legal-data";

export default function ContractPage() {
  const [file, setFile] = useState<File | null>(null);
  const [reviewing, setReviewing] = useState(false);
  const [result, setResult] = useState<ReviewResult | null>(null);
  const [error, setError] = useState("");

  const handleReview = async () => {
    if (!file) return;
    setReviewing(true);
    setError("");
    setResult(null);

    try {
      const content = await readFileAsText(file);
      const data = analyzeContract(file.name, content);
      setResult(data);
    } catch {
      setError("文件读取失败，请检查文件后重试");
    } finally {
      setReviewing(false);
    }
  };

  const severityColor: Record<string, string> = {
    high: "text-red-600 bg-red-50 border-red-200",
    medium: "text-yellow-600 bg-yellow-50 border-yellow-200",
    low: "text-green-600 bg-green-50 border-green-200",
  };

  const severityBadge: Record<string, string> = {
    high: "bg-red-100 text-red-700",
    medium: "bg-yellow-100 text-yellow-700",
    low: "bg-green-100 text-green-700",
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
      <div className="mb-8 sm:mb-10 text-center">
        <h1 className="mb-3 text-2xl font-bold text-primary sm:text-3xl md:text-4xl">合同审查</h1>
        <p className="text-sm text-gray-500 sm:text-base">
          上传合同文件，AI 智能分析条款，识别风险点并提供专业修改建议
        </p>
      </div>

      <FileUpload
        accept=".pdf,.doc,.docx,.txt"
        maxSizeMB={10}
        hint="点击或拖拽上传合同文件"
        formats="PDF、DOCX、TXT"
        onUpload={setFile}
        disabled={reviewing}
      />

      {file && (
        <div className="mt-6 text-center">
          <button
            onClick={handleReview}
            disabled={reviewing}
            className="rounded-lg bg-primary px-10 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl disabled:opacity-60"
          >
            {reviewing ? (
              <span className="flex items-center gap-2">
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-30" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
                正在审查中…
              </span>
            ) : (
              "开始审查"
            )}
          </button>
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-10 space-y-8">
          <div className={`rounded-xl border p-6 ${severityColor[result.riskLevel]}`}>
            <div className="mb-2 flex items-center gap-3">
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${severityBadge[result.riskLevel]}`}>
                {result.riskLevel === "high" ? "高风险" : result.riskLevel === "medium" ? "中风险" : "低风险"}
              </span>
              <span className="text-2xl font-bold">{result.riskScore}/100</span>
            </div>
            <p className="text-sm leading-relaxed">{result.summary}</p>
          </div>

          <div>
            <h2 className="mb-4 text-xl font-bold text-primary">审查详情</h2>
            <div className="space-y-4">
              {result.issues.map((issue, i) => (
                <div
                  key={i}
                  className={`rounded-lg border p-5 ${severityColor[issue.severity]}`}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span className={`rounded px-2 py-0.5 text-xs font-semibold ${severityBadge[issue.severity]}`}>
                      {issue.severity === "high" ? "高风险" : issue.severity === "medium" ? "中风险" : "低风险"}
                    </span>
                    <h3 className="font-bold">{issue.title}</h3>
                  </div>
                  <p className="mb-2 text-sm">{issue.description}</p>
                  <p className="mb-2 text-sm">
                    <span className="font-semibold">建议：</span>
                    {issue.suggestion}
                  </p>
                  <p className="text-xs opacity-70">依据：{issue.lawRef}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-lg font-bold text-primary">综合建议</h2>
            <ul className="space-y-2">
              {result.suggestions.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-3 text-lg font-bold text-primary">参考法律依据</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {result.references.map((ref, i) => (
                <a
                  key={i}
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:border-gold hover:shadow-sm"
                >
                  <p className="font-semibold text-primary">{ref.name}</p>
                  <p className="mt-1 text-xs text-gray-400">{ref.description}</p>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}