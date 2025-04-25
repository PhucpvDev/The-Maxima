import { directus } from '@/lib/directus';
import { readItems } from '@directus/sdk';

export interface StatisticsData {
  id: number;
  status: string;
  line_1: string;
  line_2: string;
  line_3: string;
  button_text: string;
}

export async function getStatistics(): Promise<StatisticsData[]> {
  const rawData = await directus.request<StatisticsData | StatisticsData[]>(readItems('statistics'));

  return Array.isArray(rawData)
    ? rawData.map(item => ({
        id: item.id,
        status: item.status,
        line_1: item.line_1,
        line_2: item.line_2,
        line_3: item.line_3,
        button_text: item.button_text,
      }))
    : [{
        id: rawData.id,
        status: rawData.status,
        line_1: rawData.line_1,
        line_2: rawData.line_2,
        line_3: rawData.line_3,
        button_text: rawData.button_text,
      }];
}