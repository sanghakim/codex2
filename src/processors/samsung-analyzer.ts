import { askClaude } from "@/lib/claude";
import { ProcessedNewsItem } from "@/types";

interface SamsungAnalysis {
  samsungImpact: string;
  samsungInsights: string;
  itemRelevance: Array<{ index: number; relevance: string }>;
}

export async function analyzeSamsungImpact(
  items: ProcessedNewsItem[]
): Promise<SamsungAnalysis> {
  if (items.length === 0) {
    return {
      samsungImpact: "오늘 분석할 AI 뉴스가 없습니다.",
      samsungInsights: "",
      itemRelevance: [],
    };
  }

  const newsList = items
    .map(
      (item, i) =>
        `[${i}] ${item.title}\n   요약: ${item.summary}\n   카테고리: ${item.category}`
    )
    .join("\n\n");

  const prompt = `당신은 삼성전자 전략기획 부서의 AI 산업 분석 전문가입니다.
다음 오늘의 AI 뉴스를 삼성전자 관점에서 분석해주세요.

삼성전자 주요 사업 영역:
- 반도체(메모리/파운드리/시스템LSI)
- 모바일(갤럭시, Galaxy AI)
- 가전(SmartThings, Bixby)
- 디스플레이(OLED, QD)
- 네트워크/클라우드
- 삼성 리서치/삼성 AI 센터

오늘의 AI 뉴스:
${newsList}

다음 JSON 형식으로 한국어 응답해주세요:
{
  "samsungImpact": "삼성전자에 미치는 영향 종합 분석 (5-8줄). 어떤 사업 부문에 어떤 영향이 있는지 구체적으로 서술.",
  "samsungInsights": "삼성전자가 주목해야 할 시사점과 액션 아이템 (불릿 포인트 3-5개). 경쟁사 동향, 기술 트렌드, 파트너십 기회 등 포함.",
  "itemRelevance": [
    {"index": 0, "relevance": "해당 뉴스가 삼성전자에 시사하는 바 (1-2줄). 관련 없으면 빈 문자열."}
  ]
}

JSON만 출력하세요.`;

  try {
    const response = await askClaude(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("JSON parsing failed");

    const result = JSON.parse(jsonMatch[0]) as SamsungAnalysis;
    return result;
  } catch (error) {
    console.error("삼성전자 분석 실패:", error);
    return {
      samsungImpact:
        "삼성전자 영향 분석을 생성하지 못했습니다. 추후 업데이트 예정입니다.",
      samsungInsights: "",
      itemRelevance: [],
    };
  }
}
