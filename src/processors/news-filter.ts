import { askClaude } from "@/lib/claude";
import { RawNewsItem } from "@/types";

export async function filterAndRankNews(
  items: RawNewsItem[]
): Promise<RawNewsItem[]> {
  if (items.length === 0) return [];

  // 중복 제거 (URL 기반)
  const unique = Array.from(
    new Map(items.map((item) => [item.url, item])).values()
  );

  // 항목이 적으면 LLM 필터 없이 반환
  if (unique.length <= 15) return unique;

  // LLM으로 AI 관련성 필터링
  const itemList = unique
    .map((item, i) => `[${i}] ${item.title} (${item.source})`)
    .join("\n");

  const prompt = `다음 뉴스 목록에서 AI/인공지능과 직접적으로 관련된 핵심 뉴스의 인덱스 번호만 선별해주세요.
최대 20개까지 선별하고, 중요도가 높은 순서대로 정렬해주세요.

뉴스 목록:
${itemList}

응답 형식: 쉼표로 구분된 인덱스 번호만 출력 (예: 0,3,5,7)`;

  try {
    const response = await askClaude(prompt);
    const indices = response
      .trim()
      .split(",")
      .map((s) => parseInt(s.trim()))
      .filter((n) => !isNaN(n) && n >= 0 && n < unique.length);

    return indices.map((i) => unique[i]);
  } catch {
    // LLM 실패 시 최신순 20개 반환
    return unique.slice(0, 20);
  }
}
