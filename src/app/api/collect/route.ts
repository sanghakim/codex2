import { NextRequest, NextResponse } from "next/server";
import { generateDailyReport } from "@/processors/report-generator";

export const maxDuration = 300; // 5분 타임아웃

export async function POST(request: NextRequest) {
  // 인증 확인
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const report = await generateDailyReport();
    return NextResponse.json({
      success: true,
      title: report.title,
      newsCount: report.newsItems.length,
      date: report.date,
    });
  } catch (error) {
    console.error("리포트 생성 실패:", error);
    return NextResponse.json(
      {
        error: "Report generation failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
