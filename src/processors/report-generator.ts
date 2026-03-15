import { prisma } from "@/lib/db";
import { ProcessedNewsItem, ReportData } from "@/types";
import { GeekNewsCollector } from "@/collectors/geeknews-collector";
import { AITimesCollector } from "@/collectors/aitimes-collector";
import { YouTubeCollector } from "@/collectors/youtube-collector";
import { XCollector } from "@/collectors/x-collector";
import { filterAndRankNews } from "./news-filter";
import { summarizeNews } from "./news-summarizer";
import { analyzeTrends } from "./news-analyzer";
import { analyzeSamsungImpact } from "./samsung-analyzer";
import { getDateString } from "@/lib/date-utils";
import { RawNewsItem } from "@/types";

export async function generateDailyReport(): Promise<ReportData> {
  const today = new Date();
  const dateStr = getDateString(today);

  // 1. 병렬로 데이터 수집
  console.log("[1/5] 데이터 수집 시작...");
  const collectors = [
    new GeekNewsCollector(),
    new AITimesCollector(),
    new YouTubeCollector(),
    new XCollector(),
  ];

  const results = await Promise.allSettled(
    collectors.map((c) => c.collect())
  );

  const allItems: RawNewsItem[] = [];
  for (const result of results) {
    if (result.status === "fulfilled") {
      const { source, items, error } = result.value;
      console.log(`  ${source}: ${items.length}건 수집${error ? ` (경고: ${error})` : ""}`);
      allItems.push(...items);

      // 수집 로그 저장
      await prisma.collectionLog.create({
        data: {
          source,
          status: error ? "error" : "success",
          itemCount: items.length,
          errorMsg: error,
        },
      });
    }
  }

  console.log(`  총 ${allItems.length}건 수집 완료`);

  // 2. AI 필터링
  console.log("[2/5] AI 필터링...");
  const filtered = await filterAndRankNews(allItems);
  console.log(`  ${filtered.length}건 선별`);

  // 3. AI 요약 & 분석
  console.log("[3/5] AI 요약 & 분석...");
  const processed = await summarizeNews(filtered);

  // 4. 트렌드 분석
  console.log("[4/5] 트렌드 분석...");
  const { summary, trendAnalysis } = await analyzeTrends(processed);

  // 5. 삼성전자 영향 분석
  console.log("[5/5] 삼성전자 영향 분석...");
  const samsung = await analyzeSamsungImpact(processed);

  // 개별 뉴스에 삼성 관련성 추가
  const finalItems: ProcessedNewsItem[] = processed.map((item, i) => {
    const relevance = samsung.itemRelevance.find((r) => r.index === i);
    return {
      ...item,
      samsungRelevance: relevance?.relevance || undefined,
    };
  });

  // 중요도순 정렬
  finalItems.sort((a, b) => b.importance - a.importance);

  const reportData: ReportData = {
    date: today,
    title: `AI 뉴스 다이제스트 - ${dateStr}`,
    summary,
    trendAnalysis,
    samsungImpact: samsung.samsungImpact,
    samsungInsights: samsung.samsungInsights,
    newsItems: finalItems,
  };

  // DB에 저장
  const report = await prisma.report.upsert({
    where: { date: new Date(dateStr) },
    update: {
      title: reportData.title,
      summary: reportData.summary,
      trendAnalysis: reportData.trendAnalysis,
      samsungImpact: reportData.samsungImpact,
      samsungInsights: reportData.samsungInsights,
    },
    create: {
      date: new Date(dateStr),
      title: reportData.title,
      summary: reportData.summary,
      trendAnalysis: reportData.trendAnalysis,
      samsungImpact: reportData.samsungImpact,
      samsungInsights: reportData.samsungInsights,
    },
  });

  // 기존 뉴스 아이템 삭제 후 재생성
  await prisma.newsItem.deleteMany({ where: { reportId: report.id } });

  for (const item of finalItems) {
    await prisma.newsItem.create({
      data: {
        reportId: report.id,
        title: item.title,
        source: item.source,
        sourceUrl: item.sourceUrl,
        publishedAt: item.publishedAt,
        thumbnail: item.thumbnail,
        summary: item.summary,
        analysis: item.analysis,
        samsungRelevance: item.samsungRelevance,
        category: item.category,
        importance: item.importance,
      },
    });
  }

  console.log(`리포트 생성 완료: ${reportData.title} (${finalItems.length}건)`);
  return reportData;
}
