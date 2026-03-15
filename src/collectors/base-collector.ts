import { CollectorResult } from "@/types";

export abstract class BaseCollector {
  abstract source: string;

  abstract collect(): Promise<CollectorResult>;

  protected getSevenDaysAgo(): Date {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date;
  }

  protected isWithinWeek(date: Date): boolean {
    return date >= this.getSevenDaysAgo();
  }
}
