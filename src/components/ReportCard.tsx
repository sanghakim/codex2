import Link from "next/link";
import SourceBadge from "./SourceBadge";

interface NewsItem {
  id: string;
  title: string;
  source: string;
  sourceUrl: string;
  summary: string;
  analysis: string;
  samsungRelevance?: string | null;
  thumbnail?: string | null;
  importance: number;
  category: string;
}

export default function ReportCard({ item }: { item: NewsItem }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
      {item.thumbnail && (
        <div className="h-48 bg-slate-100 overflow-hidden">
          <img
            src={item.thumbnail}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <SourceBadge source={item.source} />
          <span className="text-xs text-slate-400">{item.category}</span>
          <span className="ml-auto text-amber-500 text-sm">
            {"★".repeat(item.importance)}
          </span>
        </div>

        <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-2">
          <a
            href={item.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 transition-colors"
          >
            {item.title}
          </a>
        </h3>

        <p className="text-sm text-slate-600 mb-3 line-clamp-3">
          {item.summary}
        </p>

        <div className="bg-slate-50 rounded-lg p-3 mb-3">
          <p className="text-xs font-semibold text-slate-500 mb-1">분석</p>
          <p className="text-sm text-slate-700">{item.analysis}</p>
        </div>

        {item.samsungRelevance && (
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
            <p className="text-xs font-semibold text-blue-600 mb-1">
              삼성전자 시사점
            </p>
            <p className="text-sm text-blue-800">{item.samsungRelevance}</p>
          </div>
        )}
      </div>
    </div>
  );
}
