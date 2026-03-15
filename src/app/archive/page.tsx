"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface ReportSummary {
  id: string;
  date: string;
  title: string;
  summary: string;
  _count: { newsItems: number };
}

export default function ArchivePage() {
  const [reports, setReports] = useState<ReportSummary[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reports?limit=100")
      .then((res) => res.json())
      .then((data) => {
        setReports(data.reports || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = reports.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.summary.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">아카이브</h1>

      {/* 검색 */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="리포트 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {loading ? (
        <div className="text-center text-slate-500 py-12">로딩 중...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-slate-500 py-12">
          {search ? "검색 결과가 없습니다." : "아직 발행된 리포트가 없습니다."}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((report) => {
            const dateStr = report.date.split("T")[0];
            return (
              <Link
                key={report.id}
                href={`/reports/${dateStr}`}
                className="block bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h2 className="font-bold text-slate-900 truncate">
                      {report.title}
                    </h2>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-1">
                      {report.summary}
                    </p>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <p className="text-sm font-medium text-slate-600">
                      {dateStr}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {report._count.newsItems}건
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
