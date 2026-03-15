import { askClaude } from "@/lib/claude";
import { ProcessedNewsItem } from "@/types";

export async function analyzeTrends(
  items: ProcessedNewsItem[]
): Promise<{ summary: string; trendAnalysis: string }> {
  if (items.length === 0) {
    return {
      summary: "오늘 수집된 AI 뉴스가 없습니다.",
      trendAnalysis: "분석할 데이터가 부족합니다.",
    };
  }

  const newsList = items
    .map(
      (item, i) =>
        `${i + 1}. [${item.category}] ${item.title} (${item.source}, 중요도: ${item.importance}/5)`
    )
    .join("\n");

  const prompt = `당신은 AI 산업 전문 애널리스트입니다. 다음은 오늘 수집된 AI 관련 뉴스입니다.

${newsList}

다음 두 가지를 한국어로 작성해주세요:

1. **오늘의 요약** (3-5줄): 오늘 AI 분야에서 가장 주목할 만한 동향을 종합 요약
2. **트렌드 분석** (5-8줄): 최근 AI 산업 트렌드 관점에서의 심층 분석. 기술 발전 방향, 시장 변화, 주요 플레이어 동향 등을 포함

JSON 형식으로 응답:
{"summary": "...", "trendAnalysis": "..."}`;

  try {
    const response = await askClaude(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("JSON parsing failed");
    return JSON.parse(jsonMatch[0]);
  } catch {
    return {
      summary: `오늘 총 ${items.length}건의 AI 뉴스가 수집되었습니다.`,
      trendAnalysis: "트렌드 분석을 생성하지 못했습니다.",
    };
  }
}
