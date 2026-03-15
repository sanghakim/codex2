import { askClaude } from "@/lib/claude";
import { RawNewsItem, ProcessedNewsItem } from "@/types";
import { translateToKorean } from "./translator";

export async function summarizeNews(
  items: RawNewsItem[]
): Promise<ProcessedNewsItem[]> {
  if (items.length === 0) return [];

  // 배치로 처리 (API 호출 최소화)
  const itemDescriptions = items
    .map(
      (item, i) =>
        `[${i}] 제목: ${item.title}\n출처: ${item.source}\nURL: ${item.url}\n내용: ${item.content?.substring(0, 500) || "없음"}`
    )
    .join("\n\n");

  const prompt = `당신은 AI 뉴스 분석 전문가입니다. 다음 뉴스 항목들을 분석해주세요.
모든 응답은 반드시 한국어로 작성해주세요. 영문 뉴스도 한국어로 요약/분석해주세요.

뉴스 항목:
${itemDescriptions}

각 항목에 대해 다음 JSON 배열 형식으로 응답해주세요:
[
  {
    "index": 0,
    "summary": "핵심 내용 2-3줄 요약 (한국어)",
    "analysis": "이 뉴스의 의미와 AI 산업에 미치는 영향 분석 (한국어, 2-3줄)",
    "category": "모델 출시|서비스/제품|연구/논문|정책/규제|투자/인수|오픈소스|기타 중 하나",
    "importance": 1-5 사이 정수 (5가 가장 중요)
  }
]

JSON 배열만 출력하세요.`;

  try {
    const response = await askClaude(prompt);

    // JSON 파싱
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("JSON parsing failed");

    const results = JSON.parse(jsonMatch[0]) as Array<{
      index: number;
      summary: string;
      analysis: string;
      category: string;
      importance: number;
    }>;

    return await Promise.all(
      results.map(async (r) => {
        const item = items[r.index];
        if (!item) return null;

        // 제목이 영문이면 번역
        const title = await translateToKorean(item.title);

        return {
          title,
          source: item.source,
          sourceUrl: item.url,
          publishedAt: item.publishedAt,
          thumbnail: item.thumbnail,
          summary: r.summary,
          analysis: r.analysis,
          category: r.category,
          importance: Math.min(5, Math.max(1, r.importance)),
        } as ProcessedNewsItem;
      })
    ).then((items) => items.filter((item): item is ProcessedNewsItem => item !== null));
  } catch (error) {
    console.error("뉴스 요약 실패:", error);
    // fallback: 원본 데이터 그대로 반환
    return items.map((item) => ({
      title: item.title,
      source: item.source,
      sourceUrl: item.url,
      publishedAt: item.publishedAt,
      thumbnail: item.thumbnail,
      summary: item.content?.substring(0, 200) || "요약 없음",
      analysis: "분석 대기 중",
      category: "기타",
      importance: 3,
    }));
  }
}
