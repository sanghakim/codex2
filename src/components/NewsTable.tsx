import SourceBadge from "./SourceBadge";

interface NewsItem {
  id: string;
  title: string;
  source: string;
  sourceUrl: string;
  publishedAt: string;
  category: string;
  importance: number;
}

function ImportanceStars({ level }: { level: number }) {
  return (
    <span className="text-amber-500">
      {"★".repeat(level)}
      <span className="text-slate-300">{"★".repeat(5 - level)}</span>
    </span>
  );
}

export default function NewsTable({ items }: { items: NewsItem[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-left text-slate-500">
            <th className="py-3 px-2 w-10">#</th>
            <th className="py-3 px-2">제목</th>
            <th className="py-3 px-2 w-36">출처</th>
            <th className="py-3 px-2 w-20">발행일</th>
            <th className="py-3 px-2 w-24">카테고리</th>
            <th className="py-3 px-2 w-28">중요도</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr
              key={item.id}
              className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
            >
              <td className="py-3 px-2 text-slate-400 font-mono">{i + 1}</td>
              <td className="py-3 px-2">
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-900 hover:text-blue-600 font-medium transition-colors"
                >
                  {item.title}
                </a>
              </td>
              <td className="py-3 px-2">
                <SourceBadge source={item.source} />
              </td>
              <td className="py-3 px-2 text-slate-500">
                {new Date(item.publishedAt).toLocaleDateString("ko-KR", {
                  month: "2-digit",
                  day: "2-digit",
                })}
              </td>
              <td className="py-3 px-2">
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                  {item.category}
                </span>
              </td>
              <td className="py-3 px-2">
                <ImportanceStars level={item.importance} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
