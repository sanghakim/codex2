import axios from "axios";
import { BaseCollector } from "./base-collector";
import { CollectorResult, RawNewsItem } from "@/types";

interface YouTubeChannel {
  name: string;
  channelId: string;
  language: "ko" | "en";
}

const CHANNELS: YouTubeChannel[] = [
  // 국내 채널
  { name: "안될공학", channelId: "UCR23FgBPQ4BhGnWjIFMwgCQ", language: "ko" },
  { name: "조코딩", channelId: "UCQNE2JmbasNYbjGAcuBiRRg", language: "ko" },
  { name: "T Times", channelId: "UCp3DnJCqbOWBrGaruojlNbg", language: "ko" },
  // 해외 채널
  { name: "Two Minute Papers", channelId: "UCbfYPyITQ-7l4upoX8nvctg", language: "en" },
  { name: "AI Explained", channelId: "UCNJ1Ymd5yFuUPtn21xtRbbw", language: "en" },
  { name: "Matt Wolfe", channelId: "UCJMUEFAVPbi3hhMppSfSKMg", language: "en" },
  { name: "Fireship", channelId: "UCsBjURrPoezykLs9EqgamOA", language: "en" },
  { name: "TheAIGRID", channelId: "UCuSCKm5z1VkKjB-M38QVNQA", language: "en" },
];

export class YouTubeCollector extends BaseCollector {
  source = "YouTube";

  async collect(): Promise<CollectorResult> {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      return {
        source: this.source,
        items: [],
        error: "YOUTUBE_API_KEY not set",
      };
    }

    const allItems: RawNewsItem[] = [];
    const sevenDaysAgo = this.getSevenDaysAgo();
    const publishedAfter = sevenDaysAgo.toISOString();

    for (const channel of CHANNELS) {
      try {
        const { data } = await axios.get(
          "https://www.googleapis.com/youtube/v3/search",
          {
            params: {
              key: apiKey,
              channelId: channel.channelId,
              part: "snippet",
              order: "date",
              type: "video",
              publishedAfter,
              maxResults: 10,
            },
            timeout: 10000,
          }
        );

        if (data.items) {
          for (const item of data.items) {
            const snippet = item.snippet;
            const videoId = item.id?.videoId;
            if (!snippet || !videoId) continue;

            allItems.push({
              title: snippet.title,
              url: `https://www.youtube.com/watch?v=${videoId}`,
              source: `YouTube (${channel.name})`,
              publishedAt: new Date(snippet.publishedAt),
              content: snippet.description || "",
              thumbnail:
                snippet.thumbnails?.high?.url ||
                snippet.thumbnails?.default?.url,
            });
          }
        }
      } catch (error) {
        console.error(`YouTube ${channel.name} 수집 실패:`, error);
      }
    }

    return { source: this.source, items: allItems };
  }
}
