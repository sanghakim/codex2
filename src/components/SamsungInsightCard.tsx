interface SamsungInsightCardProps {
  impact: string;
  insights: string;
}

export default function SamsungInsightCard({
  impact,
  insights,
}: SamsungInsightCardProps) {
  if (!impact && !insights) return null;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">S</span>
        </div>
        <h2 className="text-xl font-bold text-blue-900">
          삼성전자 영향 & 시사점
        </h2>
      </div>

      {impact && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-blue-700 mb-2">
            삼성전자에 미치는 영향
          </h3>
          <p className="text-slate-700 leading-relaxed whitespace-pre-line">
            {impact}
          </p>
        </div>
      )}

      {insights && (
        <div>
          <h3 className="text-sm font-semibold text-blue-700 mb-2">
            주목해야 할 시사점
          </h3>
          <div className="text-slate-700 leading-relaxed whitespace-pre-line">
            {insights}
          </div>
        </div>
      )}
    </div>
  );
}
