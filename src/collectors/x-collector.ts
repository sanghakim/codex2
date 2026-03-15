import axios from "axios";
import { BaseCollector } from "./base-collector";
import { CollectorResult, RawNewsItem } from "@/types";

interface XAccount {
  name: string;
  username: string;
}

const ACCOUNTS: XAccount[] = [
  { name: "OpenAI", username: "OpenAI" },
  { name: "Google DeepMind", username: "GoogleDeepMind" },
  { name: "Meta AI", username: "MetaAI" },
  { name: "Microsoft", username: "Microsoft" },
  { name: "Anthropic", username: "AnthropicAI" },
  { name: "NVIDIA", username: "NVIDIA" },
  { name: "Apple", username: "Apple" },
];

const AI_KEYWORDS = [
  "AI", "artificial intelligence", "machine learning", "deep learning",
  "LLM", "GPT", "model", "neural", "AGI", "generative",
  "Claude", "Gemini", "Copilot", "agent",
];

export class XCollector extends BaseCollector {
  source = "X";

  async collect(): Promise<CollectorResult> {
    const bearerToken = process.env.X_BEARER_TOKEN;
    if (!bearerToken) {
      return {
        source: this.source,
        items: [],
        error: "X_BEARER_TOKEN not set",
      };
    }

    const allItems: RawNewsItem[] = [];
    const sevenDaysAgo = this.getSevenDaysAgo();

    for (const account of ACCOUNTS) {
      try {
        // X API v2: 사용자 트윗 검색
        const query = `from:${account.username} (${AI_KEYWORDS.slice(0, 5).join(" OR ")})`;
        const { data } = await axios.get(
          "https://api.twitter.com/2/tweets/search/recent",
          {
            params: {
              query,
              "tweet.fields": "created_at,text,entities",
              max_results: 10,
              start_time: sevenDaysAgo.toISOString(),
            },
            headers: {
              Authorization: `Bearer ${bearerToken}`,
            },
            timeout: 10000,
          }
        );

        if (data.data) {
          for (const tweet of data.data) {
            allItems.push({
              title: tweet.text.substring(0, 100) + (tweet.text.length > 100 ? "..." : ""),
              url: `https://x.com/${account.username}/status/${tweet.id}`,
              source: `X (@${account.username})`,
              publishedAt: new Date(tweet.created_at),
              content: tweet.text,
              thumbnail: undefined,
            });
          }
        }
      } catch (error) {
        console.error(`X @${account.username} 수집 실패:`, error);
      }
    }

    return { source: this.source, items: allItems };
  }
}
