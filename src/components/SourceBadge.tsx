const SOURCE_COLORS: Record<string, string> = {
  "AI Times": "bg-purple-100 text-purple-700",
  GeekNews: "bg-green-100 text-green-700",
  YouTube: "bg-red-100 text-red-700",
  X: "bg-sky-100 text-sky-700",
};

function getSourceColor(source: string): string {
  for (const [key, value] of Object.entries(SOURCE_COLORS)) {
    if (source.includes(key)) return value;
  }
  return "bg-slate-100 text-slate-700";
}

export default function SourceBadge({ source }: { source: string }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSourceColor(source)}`}
    >
      {source}
    </span>
  );
}
