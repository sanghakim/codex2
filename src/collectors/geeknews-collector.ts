import RSSParser from "rss-parser";
import { BaseCollector } from "./base-collector";
import { CollectorResult, RawNewsItem } from "@/types";

const AI_KEYWORDS = [
  "AI", "인공지능", "LLM", "GPT", "Claude", "Gemini", "딥러닝",
  "머신러닝", "Machine Learning", "Deep Learning", "OpenAI",
  "Anthropic", "생성형", "Generative", "트랜스포머", "Transformer",
  "파인튜닝", "RAG", "벡터", "임베딩", "에이전트", "Agent",
  "Copilot", "ChatGPT", "Midjourney", "Stable Diffusion", "Llama",
  "neural", "model", "NVIDIA", "GPU",
];

export class GeekNewsCollector extends BaseCollector {
  source = "GeekNews";

  async collect(): Promise<CollectorResult> {
    try {
      const parser = new RSSParser();
      const feed = await parser.parseURL("https://news.hada.io/rss/news");
      const sevenDaysAgo = this.getSevenDaysAgo();

      const items: RawNewsItem[] = feed.items
        .filter((item) => {
          const pubDate = item.pubDate ? new Date(item.pubDate) : new Date();
          return pubDate >= sevenDaysAgo;
        })
        .filter((item) => {
          const text = `${item.title || ""} ${item.contentSnippet || ""}`.toLowerCase();
          return AI_KEYWORDS.some((kw) => text.toLowerCase().includes(kw.toLowerCase()));
        })
        .map((item) => ({
          title: item.title || "제목 없음",
          url: item.link || "",
          source: this.source,
          publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
          content: item.contentSnippet || item.content || "",
          thumbnail: undefined,
        }));

      return { source: this.source, items };
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      return { source: this.source, items: [], error: msg };
    }
  }
}
