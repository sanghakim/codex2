import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const limit = parseInt(searchParams.get("limit") || "10");
  const offset = parseInt(searchParams.get("offset") || "0");

  try {
    if (date) {
      // 특정 날짜 리포트 조회
      const report = await prisma.report.findUnique({
        where: { date: new Date(date) },
        include: {
          newsItems: { orderBy: { importance: "desc" } },
        },
      });

      if (!report) {
        return NextResponse.json(
          { error: "Report not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(report);
    }

    // 리포트 목록 조회
    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        orderBy: { date: "desc" },
        take: limit,
        skip: offset,
        include: {
          _count: { select: { newsItems: true } },
        },
      }),
      prisma.report.count(),
    ]);

    return NextResponse.json({ reports, total, limit, offset });
  } catch (error) {
    console.error("리포트 조회 실패:", error);
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}
