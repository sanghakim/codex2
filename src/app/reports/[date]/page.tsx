import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import NewsTable from "@/components/NewsTable";
import ReportCard from "@/components/ReportCard";
import SamsungInsightCard from "@/components/SamsungInsightCard";
import { SourcePieChart, CategoryBarChart } from "@/components/TrendChart";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ReportDetailPage({
  params,
}: {
  params: { date: string };
}) {
  const report = await prisma.report.findUnique({
    where: { date: new Date(params.date) },
    include: {
      newsItems: { orderBy: { importance: "desc" } },
    },
  });

  if (!report) {
    notFound();
  }

  const topNews = report.newsItems.filter((item) => item.importance >= 4);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* 뒤로 가기 */}
      <Link
        href="/reports"
        className="text-sm text-slate-500 hover:text-slate-700 mb-4 inline-block"
      >
        &larr; 리포트 목록
      </Link>

      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          {report.title}
        </h1>
        <div className="flex items-center gap-4 text-sm text-slate-500">
          <span>
            {report.date.toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
              weekday: "long",
            })}
          </span>
          <span>|</span>
          <span>{report.newsItems.length}건의 뉴스</span>
        </div>
      </div>

      {/* 오늘의 요약 */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
        <h2 className="text-lg font-bold text-slate-900 mb-3">
          AI 트렌드 요약
        </h2>
        <p className="text-slate-700 leading-relaxed whitespace-pre-line">
          {report.summary}
        </p>
      </section>

      {/* 트렌드 분석 */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
        <h2 className="text-lg font-bold text-slate-900 mb-3">트렌드 분석</h2>
        <p className="text-slate-700 leading-relaxed whitespace-pre-line">
          {report.trendAnalysis}
        </p>
      </section>

      {/* 삼성전자 영향 & 시사점 */}
      <section className="mb-8">
        <SamsungInsightCard
          impact={report.samsungImpact}
          insights={report.samsungInsights}
        />
      </section>

      {/* 뉴스 요약 테이블 */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
        <h2 className="text-lg font-bold text-slate-900 mb-4">
          뉴스 요약 테이블
        </h2>
        <NewsTable
          items={report.newsItems.map((item) => ({
            ...item,
            publishedAt: item.publishedAt.toISOString(),
          }))}
        />
      </section>

      {/* 핵심 뉴스 상세 */}
      {topNews.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            핵심 뉴스 상세
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topNews.map((item) => (
              <ReportCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* 차트 */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <SourcePieChart items={report.newsItems} />
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <CategoryBarChart items={report.newsItems} />
        </div>
      </section>
    </div>
  );
}
