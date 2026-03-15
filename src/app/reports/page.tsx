import { prisma } from "@/lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const reports = await prisma.report.findMany({
    orderBy: { date: "desc" },
    include: {
      _count: { select: { newsItems: true } },
    },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">리포트 목록</h1>

      {reports.length === 0 ? (
        <p className="text-slate-500 text-center py-12">
          아직 발행된 리포트가 없습니다.
        </p>
      ) : (
        <div className="space-y-3">
          {reports.map((report) => {
            const dateStr = report.date.toISOString().split("T")[0];
            return (
              <Link
                key={report.id}
                href={`/reports/${dateStr}`}
                className="block bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-bold text-slate-900">{report.title}</h2>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-1">
                      {report.summary}
                    </p>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <p className="text-sm font-medium text-slate-600">
                      {report.date.toLocaleDateString("ko-KR", {
                        month: "long",
                        day: "numeric",
                      })}
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
