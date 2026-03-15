import axios from "axios";
import * as cheerio from "cheerio";
import { BaseCollector } from "./base-collector";
import { CollectorResult, RawNewsItem } from "@/types";

export class AITimesCollector extends BaseCollector {
  source = "AI Times";

  async collect(): Promise<CollectorResult> {
    try {
      const items: RawNewsItem[] = [];
      // AI Times 최신 기사 페이지 스크래핑
      const url = "https://www.aitimes.com/news/articleList.html?sc_section_code=S1N1&view_type=sm";
      const { data } = await axios.get(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; AINewsDigestBot/1.0; +https://github.com)",
        },
        timeout: 10000,
      });

      const $ = cheerio.load(data);
      const sevenDaysAgo = this.getSevenDaysAgo();

      $(".article-list-content .list-block").each((_, el) => {
        const titleEl = $(el).find(".list-titles a");
        const title = titleEl.text().trim();
        const href = titleEl.attr("href");
        const dateText = $(el).find(".list-dated").text().trim();
        const thumbnail = $(el).find("img").attr("src") || undefined;
        const snippet = $(el).find(".list-summary").text().trim();

        if (!title || !href) return;

        const publishedAt = this.parseDate(dateText);
        if (publishedAt < sevenDaysAgo) return;

        const fullUrl = href.startsWith("http")
          ? href
          : `https://www.aitimes.com${href}`;

        items.push({
          title,
          url: fullUrl,
          source: this.source,
          publishedAt,
          content: snippet,
          thumbnail: thumbnail?.startsWith("http")
            ? thumbnail
            : thumbnail
              ? `https://www.aitimes.com${thumbnail}`
              : undefined,
        });
      });

      return { source: this.source, items };
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      return { source: this.source, items: [], error: msg };
    }
  }

  private parseDate(dateStr: string): Date {
    // "2026.03.15 08:30" 형식
    const match = dateStr.match(/(\d{4})\.(\d{2})\.(\d{2})/);
    if (match) {
      return new Date(`${match[1]}-${match[2]}-${match[3]}`);
    }
    return new Date();
  }
}
