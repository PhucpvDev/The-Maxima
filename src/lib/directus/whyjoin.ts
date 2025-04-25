import { directus } from '@/lib/directus';
import { readItems } from '@directus/sdk';

export interface RawWhyJoinMaximaData {
  id: number;
  status: string;
  title: string;
  subtitle: string;
  conclusion_title: string;
  conclusion_title_2: string;
  conclusion_title_3: string;
  conclusion_title_4: string;
  conclusion_description: string;
  conclusion_description_2: string;
  conclusion_description_3: string;
  conclusion_description_4: string;
  conclusion_button?: string;
  conclusion_button_2?: string;
  conclusion_image: string;
  conclusion_image_2: string;
  conclusion_image_3: string;
  conclusion_image_4: string;
}

export async function getWhyJoin(): Promise<RawWhyJoinMaximaData[]> {
  const rawData = await directus.request(readItems('why_join_maxima'));

  // Normalize the data: if rawData is an object, wrap it in an array; if it's an array, use it as-is
  const dataArray = Array.isArray(rawData) ? rawData : [rawData];

  return dataArray.map((item: Record<string, any>) => ({
    id: item.id,
    status: item.status,
    title: item.title,
    subtitle: item.subtitle,
    conclusion_title: item.conclusion_title,
    conclusion_title_2: item.conclusion_title_2,
    conclusion_title_3: item.conclusion_title_3,
    conclusion_title_4: item.conclusion_title_4,
    conclusion_description: item.conclusion_description,
    conclusion_description_2: item.conclusion_description_2,
    conclusion_description_3: item.conclusion_description_3,
    conclusion_description_4: item.conclusion_description_4,
    conclusion_button: item.conclusion_button,
    conclusion_button_2: item.conclusion_button_2,
    conclusion_image: item.conclusion_image,
    conclusion_image_2: item.conclusion_image_2,
    conclusion_image_3: item.conclusion_image_3,
    conclusion_image_4: item.conclusion_image_4,
  })) as RawWhyJoinMaximaData[];
}