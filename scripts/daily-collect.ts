/**
 * 수동 실행용 스크립트
 * 사용법: npx ts-node --compiler-options '{"module":"commonjs"}' scripts/daily-collect.ts
 * 또는 API 호출: curl -X POST http://localhost:3000/api/collect -H "Authorization: Bearer dev-secret"
 */

async function main() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const cronSecret = process.env.CRON_SECRET || "dev-secret";

  console.log(`[${new Date().toISOString()}] 일일 AI 뉴스 수집 시작...`);
  console.log(`Target: ${siteUrl}/api/collect`);

  try {
    const response = await fetch(`${siteUrl}/api/collect`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cronSecret}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (response.ok) {
      console.log("리포트 생성 성공:", data);
    } else {
      console.error("리포트 생성 실패:", data);
      process.exit(1);
    }
  } catch (error) {
    console.error("요청 실패:", error);
    process.exit(1);
  }
}

main();
