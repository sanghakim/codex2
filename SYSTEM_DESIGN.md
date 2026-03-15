# AI 뉴스 다이제스트 시스템 설계서

## 1. 시스템 개요

매일 아침 6시(KST)에 AI 관련 최신 뉴스를 자동 수집·선별·요약하여 웹사이트에 리포트를 발행하는 시스템.

---

## 2. 아키텍처 개요

```
┌─────────────────────────────────────────────────────────────────┐
│                        데이터 소스 레이어                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────────────┐   │
│  │ AI Times │ │ GeekNews │ │ X (빅테크)│ │ YouTube (안될공학, │   │
│  │ RSS/Scrape│ │ RSS/API  │ │  API     │ │ 조코딩, T Times)  │   │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────────┬──────────┘  │
│       │             │            │                 │             │
└───────┼─────────────┼────────────┼─────────────────┼─────────────┘
        │             │            │                 │
        ▼             ▼            ▼                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    수집 & 처리 레이어 (Backend)                    │
│                                                                 │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────────┐  │
│  │ Collector    │  │ AI Processor │  │ Report Generator       │  │
│  │ (스크래퍼/API)│→│ (LLM 요약/분석)│→│ (마크다운/HTML 생성)     │  │
│  └─────────────┘  └──────────────┘  └────────────────────────┘  │
│                                                                 │
│  ┌─────────────┐  ┌──────────────┐                              │
│  │ Scheduler   │  │ Database     │                              │
│  │ (Cron 6AM)  │  │ (SQLite/PG)  │                              │
│  └─────────────┘  └──────────────┘                              │
└─────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────┐
│                     프론트엔드 레이어 (Web)                       │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Next.js App                                             │   │
│  │  ┌────────┐ ┌───────────┐ ┌──────────┐ ┌─────────────┐  │   │
│  │  │ 홈     │ │ 리포트 목록│ │ 리포트 상세│ │ 아카이브    │  │   │
│  │  │ (최신)  │ │ (날짜별)  │ │ (표/차트) │ │ (검색/필터) │  │   │
│  │  └────────┘ └───────────┘ └──────────┘ └─────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. 기술 스택

| 구분 | 기술 | 선정 이유 |
|------|------|-----------|
| **프론트엔드** | Next.js 14 (App Router) + TypeScript | SSG로 빠른 로딩, SEO 최적화 |
| **스타일링** | Tailwind CSS | 빠른 UI 개발, 반응형 |
| **차트/시각화** | Recharts | React 친화적, 가벼움 |
| **백엔드** | Next.js API Routes + Node.js | 프론트와 통합, 서버리스 배포 가능 |
| **스케줄러** | GitHub Actions (cron) 또는 node-cron | 매일 아침 6시 실행 (무료) |
| **LLM** | Claude API (Anthropic) | 뉴스 요약·분석·선별 |
| **데이터베이스** | SQLite (Prisma ORM) | 경량, 파일 기반, 배포 간편 |
| **스크래핑** | Cheerio + Axios | 가볍고 빠른 웹 스크래핑 |
| **X API** | Twitter/X API v2 | 빅테크 공식 계정 모니터링 |
| **YouTube** | YouTube Data API v3 | 채널별 최신 영상 수집 |
| **배포** | Vercel | Next.js 최적 배포 환경 |

---

## 4. 데이터 소스 상세

### 4.1 뉴스 사이트
| 소스 | 수집 방식 | URL |
|------|-----------|-----|
| AI Times | RSS + 웹 스크래핑 | https://www.aitimes.com |
| GeekNews | RSS Feed | https://news.hada.io |

### 4.2 X (Twitter) - 빅테크 기업 계정
| 기업 | 계정 | 모니터링 키워드 |
|------|-------|-----------------|
| OpenAI | @OpenAI | AI, GPT, model |
| Google DeepMind | @GoogleDeepMind | AI, Gemini |
| Meta AI | @MetaAI | AI, LLaMA |
| Microsoft | @Microsoft | AI, Copilot |
| Anthropic | @AnthropicAI | Claude, AI |
| NVIDIA | @NVIDIA | AI, GPU, CUDA |
| Apple | @Apple | AI, ML |

### 4.3 YouTube 채널
| 채널명 | 채널 ID | 콘텐츠 유형 |
|--------|---------|-------------|
| 안될공학 | 수집 시 확인 | AI/기술 해설 |
| 조코딩 | 수집 시 확인 | AI 개발/튜토리얼 |
| T Times | 수집 시 확인 | 테크 뉴스/분석 |

---

## 5. 디렉터리 구조

```
codex2/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # 공통 레이아웃
│   │   ├── page.tsx                  # 홈 (최신 리포트)
│   │   ├── reports/
│   │   │   ├── page.tsx              # 리포트 목록
│   │   │   └── [date]/
│   │   │       └── page.tsx          # 리포트 상세
│   │   ├── archive/
│   │   │   └── page.tsx              # 아카이브 (검색/필터)
│   │   └── api/
│   │       ├── collect/
│   │       │   └── route.ts          # 수집 트리거 API
│   │       └── reports/
│   │           └── route.ts          # 리포트 조회 API
│   │
│   ├── collectors/                   # 데이터 수집 모듈
│   │   ├── base-collector.ts         # 수집기 인터페이스
│   │   ├── aitimes-collector.ts      # AI Times 스크래퍼
│   │   ├── geeknews-collector.ts     # GeekNews 수집기
│   │   ├── x-collector.ts           # X(Twitter) API 수집기
│   │   └── youtube-collector.ts      # YouTube API 수집기
│   │
│   ├── processors/                   # AI 처리 모듈
│   │   ├── news-filter.ts            # 뉴스 선별 (AI 관련성 판단)
│   │   ├── news-summarizer.ts        # 뉴스 요약 (LLM)
│   │   ├── news-analyzer.ts          # 뉴스 분석 (트렌드, 영향도)
│   │   └── report-generator.ts       # 리포트 HTML 생성
│   │
│   ├── components/                   # React 컴포넌트
│   │   ├── ReportCard.tsx            # 리포트 카드
│   │   ├── NewsTable.tsx             # 뉴스 요약 테이블
│   │   ├── TrendChart.tsx            # 트렌드 차트
│   │   ├── SourceBadge.tsx           # 출처 배지
│   │   ├── Header.tsx                # 헤더
│   │   └── Footer.tsx                # 푸터
│   │
│   ├── lib/                          # 유틸리티
│   │   ├── db.ts                     # DB 연결 (Prisma)
│   │   ├── claude.ts                 # Claude API 클라이언트
│   │   └── date-utils.ts             # 날짜 유틸
│   │
│   └── types/                        # 타입 정의
│       └── index.ts                  # 공통 타입
│
├── prisma/
│   └── schema.prisma                 # DB 스키마
│
├── scripts/
│   └── daily-collect.ts              # 매일 실행 스크립트
│
├── .github/
│   └── workflows/
│       └── daily-digest.yml          # GitHub Actions 스케줄러
│
├── public/
│   └── images/                       # 정적 이미지
│
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── .env.example                      # 환경 변수 템플릿
```

---

## 6. 데이터 모델 (DB 스키마)

```prisma
model Report {
  id          String    @id @default(cuid())
  date        DateTime  @unique          // 발행일 (YYYY-MM-DD)
  title       String                     // 리포트 제목
  summary     String                     // 전체 요약
  trendAnalysis String                   // 트렌드 분석
  createdAt   DateTime  @default(now())
  newsItems   NewsItem[]
}

model NewsItem {
  id          String    @id @default(cuid())
  reportId    String
  report      Report    @relation(fields: [reportId], references: [id])

  title       String                     // 뉴스 제목
  source      String                     // 출처 (AI Times, GeekNews, X, YouTube)
  sourceUrl   String                     // 원본 URL
  publishedAt DateTime                   // 원본 발행일
  thumbnail   String?                    // 썸네일 이미지 URL

  summary     String                     // 핵심 요약 (LLM 생성)
  analysis    String                     // 분석 내용 (LLM 생성)
  category    String                     // 카테고리 (모델, 서비스, 정책, 연구 등)
  importance  Int       @default(3)      // 중요도 (1~5)

  createdAt   DateTime  @default(now())
}

model CollectionLog {
  id          String    @id @default(cuid())
  source      String                     // 수집 소스
  status      String                     // success | error
  itemCount   Int       @default(0)      // 수집 항목 수
  errorMsg    String?                    // 에러 메시지
  executedAt  DateTime  @default(now())
}
```

---

## 7. 핵심 파이프라인 흐름

```
06:00 KST - GitHub Actions Cron 트리거
    │
    ▼
[1단계] 데이터 수집 (병렬 실행, ~2분)
    ├── AI Times RSS/스크래핑 → 최근 7일 기사
    ├── GeekNews RSS → 최근 7일 AI 관련 게시물
    ├── X API → 빅테크 계정 최근 7일 AI 관련 트윗
    └── YouTube Data API → 3개 채널 최근 7일 영상
    │
    ▼
[2단계] AI 선별 & 필터링 (~1분)
    │   Claude API로 수집된 항목 중 AI 관련 핵심 뉴스 선별
    │   - 중복 제거
    │   - AI 관련성 점수 판단
    │   - 중요도 1~5 점수 부여
    │
    ▼
[3단계] AI 요약 & 분석 (~3분)
    │   선별된 뉴스 각각에 대해:
    │   - 핵심 내용 3줄 요약
    │   - 산업 영향도 분석
    │   - 카테고리 분류
    │   전체 리포트에 대해:
    │   - 오늘의 AI 트렌드 종합 분석
    │   - 주간 동향 요약
    │
    ▼
[4단계] 리포트 생성 & 저장 (~1분)
    │   - DB에 Report + NewsItem 저장
    │   - Next.js ISR 재검증 트리거
    │
    ▼
[5단계] 웹사이트 업데이트
        - 홈페이지에 최신 리포트 표시
        - 리포트 상세 페이지 생성
```

---

## 8. 리포트 페이지 구성

각 일일 리포트 페이지는 다음 섹션으로 구성:

### 8.1 헤더 영역
- 발행일, 수집 뉴스 수, 소스별 비율

### 8.2 오늘의 AI 트렌드 요약
- 3~5줄의 종합 분석

### 8.3 뉴스 요약 테이블
| 순위 | 제목 | 출처 | 발행일 | 카테고리 | 중요도 |
|------|------|------|--------|----------|--------|
| 1 | ... | AI Times | 03/15 | 모델 출시 | ★★★★★ |
| 2 | ... | X (@OpenAI) | 03/14 | 서비스 | ★★★★☆ |

### 8.4 핵심 뉴스 상세 (중요도 4 이상)
- 각 뉴스별 카드 형태
  - 썸네일 이미지
  - 핵심 요약
  - AI 분석 내용
  - 원본 링크

### 8.5 소스별 분포 차트
- 파이 차트: 소스별 뉴스 비율
- 바 차트: 카테고리별 뉴스 수

### 8.6 주간 트렌드
- 최근 7일간 카테고리별 뉴스 추이 라인 차트

---

## 9. API 키 & 환경 변수

```env
# Claude API
ANTHROPIC_API_KEY=sk-ant-...

# X (Twitter) API
X_BEARER_TOKEN=...

# YouTube Data API
YOUTUBE_API_KEY=...

# Database
DATABASE_URL=file:./dev.db

# App
NEXT_PUBLIC_SITE_URL=https://your-domain.com
CRON_SECRET=...                    # GitHub Actions → API 인증
```

---

## 10. GitHub Actions 스케줄러

```yaml
name: Daily AI News Digest

on:
  schedule:
    - cron: '0 21 * * *'           # UTC 21:00 = KST 06:00
  workflow_dispatch:                # 수동 실행 가능

jobs:
  collect-and-publish:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger collection
        run: |
          curl -X POST "${{ secrets.SITE_URL }}/api/collect" \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}" \
            -H "Content-Type: application/json"
```

---

## 11. 구현 우선순위 (단계별)

### Phase 1: MVP (핵심 기능)
1. Next.js 프로젝트 셋업 (Tailwind, Prisma, TypeScript)
2. GeekNews RSS 수집기 구현
3. AI Times 스크래퍼 구현
4. Claude API 연동 (요약/분석)
5. 리포트 생성 및 DB 저장
6. 리포트 목록/상세 페이지 UI
7. 수동 트리거 API

### Phase 2: 소스 확장
8. YouTube Data API 수집기 (안될공학, 조코딩, T Times)
9. X API 수집기 (빅테크 계정)
10. 소스별 배지 및 필터 UI

### Phase 3: 시각화 & 자동화
11. Recharts 차트 (소스 분포, 카테고리, 트렌드)
12. GitHub Actions 스케줄러 설정
13. 아카이브/검색 페이지

### Phase 4: 고도화
14. 이메일 구독 기능
15. 다크 모드
16. PWA 지원
17. 성능 최적화

---

## 12. 비용 추정 (월간)

| 항목 | 비용 | 비고 |
|------|------|------|
| Vercel 호스팅 | 무료 | Hobby 플랜 |
| Claude API | ~$10~30 | 일 1회 요약/분석 |
| YouTube Data API | 무료 | 일일 할당량 내 |
| X API | 무료~$100 | Basic 플랜 (읽기 전용) |
| GitHub Actions | 무료 | Public repo 기준 |
| **합계** | **~$10~130/월** | |

---

## 13. 주의사항 & 리스크

1. **X API 제한**: Free tier는 읽기 제한이 있으므로 Basic($100/월) 필요할 수 있음. 대안으로 Nitter 등 비공식 소스 고려.
2. **스크래핑 법적 이슈**: AI Times 스크래핑 시 robots.txt 준수, 과도한 요청 금지.
3. **LLM 비용 관리**: 뉴스 수가 많을 경우 배치 처리로 API 호출 최소화.
4. **YouTube 할당량**: 일일 10,000 단위 할당량 내 운영 (충분).
5. **시간대 관리**: 모든 시간은 KST 기준으로 통일.
