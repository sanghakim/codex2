import { askClaude } from "@/lib/claude";

export async function translateToKorean(text: string): Promise<string> {
  if (!text) return "";

  // 이미 한국어인지 간단히 판단 (한글 비율 체크)
  const koreanChars = text.match(/[\uAC00-\uD7A3]/g);
  const koreanRatio = koreanChars ? koreanChars.length / text.length : 0;
  if (koreanRatio > 0.3) return text;

  const prompt = `다음 텍스트를 자연스러운 한국어로 번역해주세요. 기술 용어는 원문을 괄호 안에 병기해주세요.
번역문만 출력하세요.

${text}`;

  try {
    return await askClaude(prompt);
  } catch {
    return text;
  }
}
