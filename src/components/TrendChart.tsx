"use client";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = [
  "#6366f1", "#f43f5e", "#10b981", "#f59e0b",
  "#3b82f6", "#8b5cf6", "#ec4899",
];

interface NewsItem {
  source: string;
  category: string;
}

export function SourcePieChart({ items }: { items: NewsItem[] }) {
  const sourceMap = new Map<string, number>();
  items.forEach((item) => {
    // 소스명 간소화
    const key = item.source.includes("YouTube")
      ? "YouTube"
      : item.source.includes("X (")
        ? "X"
        : item.source;
    sourceMap.set(key, (sourceMap.get(key) || 0) + 1);
  });

  const data = Array.from(sourceMap.entries()).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-500 mb-3">소스별 분포</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey="value"
            label={({ name, percent }) =>
              `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
            }
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CategoryBarChart({ items }: { items: NewsItem[] }) {
  const categoryMap = new Map<string, number>();
  items.forEach((item) => {
    categoryMap.set(item.category, (categoryMap.get(item.category) || 0) + 1);
  });

  const data = Array.from(categoryMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-500 mb-3">
        카테고리별 뉴스 수
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
