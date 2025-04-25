import { directus } from '@/lib/directus';
import { readItems } from '@directus/sdk';

// Định nghĩa cấu trúc dữ liệu từ Directus
export interface MaximaSuperWalletData {
  id: number;
  status: string;
  title: string;
  description: string;
  additional_description: string;
  cta_title: string;
  cta_button_text: string;
}

export async function getMaximaSuperWallet(): Promise<MaximaSuperWalletData[]> {
  const rawData = await directus.request<MaximaSuperWalletData | MaximaSuperWalletData[]>(readItems('maxima_super_wallet'));

  // Chuẩn hóa dữ liệu: nếu rawData là một đối tượng, bọc nó trong một mảng
  return Array.isArray(rawData)
    ? rawData.map(item => ({
        id: item.id,
        status: item.status,
        title: item.title,
        description: item.description,
        additional_description: item.additional_description,
        cta_title: item.cta_title,
        cta_button_text: item.cta_button_text,
      }))
    : [{
        id: rawData.id,
        status: rawData.status,
        title: rawData.title,
        description: rawData.description,
        additional_description: rawData.additional_description,
        cta_title: rawData.cta_title,
        cta_button_text: rawData.cta_button_text,
      }];
}