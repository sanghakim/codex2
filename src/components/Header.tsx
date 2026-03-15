import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-slate-900">AI Daily Digest</span>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
            BETA
          </span>
        </Link>
        <nav className="flex gap-6 text-sm font-medium text-slate-600">
          <Link href="/" className="hover:text-slate-900 transition-colors">
            최신 리포트
          </Link>
          <Link href="/reports" className="hover:text-slate-900 transition-colors">
            리포트 목록
          </Link>
          <Link href="/archive" className="hover:text-slate-900 transition-colors">
            아카이브
          </Link>
        </nav>
      </div>
    </header>
  );
}
