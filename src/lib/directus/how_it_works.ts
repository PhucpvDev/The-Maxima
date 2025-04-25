import { directus } from '@/lib/directus';
import { readItems } from '@directus/sdk';

// Định nghĩa cấu trúc của bước
export interface HowItWorksStep {
  title: string;
  description: string;
}

// Định nghĩa cấu trúc dữ liệu gốc từ Directus
export interface RawHowItWorksData {
  id: number;
  status: string;
  title: string;
  subtitle: string;
  conclusion: string;
  step_title_1: string;
  step_title_2: string;
  step_title_3: string;
  step_title_4: string;
  step_title_5: string;
  step_title_6: string;
  description_1: string;
  description_2: string;
  description_3: string;
  description_4: string;
  description_5: string;
  description_6: string;
}

// Định nghĩa cấu trúc dữ liệu đã chuyển đổi
export interface HowItWorksData {
  title: string;
  subtitle: string;
  steps: HowItWorksStep[];
  conclusion: string;
}

export async function getHowItWorks(): Promise<HowItWorksData[]> {
  const rawData = await directus.request(readItems('how_it_works')) as RawHowItWorksData[];

  // Chuẩn hóa dữ liệu: nếu rawData là một đối tượng, bọc nó trong một mảng
  const dataArray = Array.isArray(rawData) ? rawData : [rawData];

  // Chuyển đổi dữ liệu phẳng thành mảng steps
  return dataArray.map((item: RawHowItWorksData) => ({
    title: item.title,
    subtitle: item.subtitle,
    conclusion: item.conclusion,
    steps: [
      { title: item.step_title_1, description: item.description_1 },
      { title: item.step_title_2, description: item.description_2 },
      { title: item.step_title_3, description: item.description_3 },
      { title: item.step_title_4, description: item.description_4 },
      { title: item.step_title_5, description: item.description_5 },
      { title: item.step_title_6, description: item.description_6 },
    ],
  }));
}