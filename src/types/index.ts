export interface RawNewsItem {
  title: string;
  url: string;
  source: string;
  publishedAt: Date;
  content?: string;
  thumbnail?: string;
}

export interface ProcessedNewsItem {
  title: string;
  source: string;
  sourceUrl: string;
  publishedAt: Date;
  thumbnail?: string;
  summary: string;
  analysis: string;
  samsungRelevance?: string;
  category: string;
  importance: number;
}

export interface ReportData {
  date: Date;
  title: string;
  summary: string;
  trendAnalysis: string;
  samsungImpact: string;
  samsungInsights: string;
  newsItems: ProcessedNewsItem[];
}

export interface CollectorResult {
  source: string;
  items: RawNewsItem[];
  error?: string;
}

export type NewsCategory =
  | "모델 출시"
  | "서비스/제품"
  | "연구/논문"
  | "정책/규제"
  | "투자/인수"
  | "오픈소스"
  | "기타";

export type ImportanceLevel = 1 | 2 | 3 | 4 | 5;
