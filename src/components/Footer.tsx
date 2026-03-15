export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8 text-center text-sm text-slate-500">
        <p>
          AI Daily Digest - 매일 아침 6시 AI 최신 뉴스를 요약합니다.
        </p>
        <p className="mt-2">
          소스: AI Times | GeekNews | YouTube | X (Twitter)
        </p>
        <p className="mt-1 text-xs text-slate-400">
          Powered by Claude API | Built with Next.js
        </p>
      </div>
    </footer>
  );
}
