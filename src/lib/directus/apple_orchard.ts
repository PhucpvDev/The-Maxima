import { directus } from '@/lib/directus';
import { readItems } from '@directus/sdk';

// Định nghĩa cấu trúc dữ liệu từ Directus
export interface AppleOrchardData {
  id: number;
  status: string;
  title: string;
  subtitle: string;
  description: string;
  image: string; // ID của file hình ảnh
}

export async function getAppleOrchard(): Promise<AppleOrchardData[]> {
  const rawData = await directus.request<AppleOrchardData | AppleOrchardData[]>(readItems('apple_orchard'));

  // Chuẩn hóa dữ liệu: nếu rawData là một đối tượng, bọc nó trong một mảng
  return Array.isArray(rawData)
    ? rawData.map(item => ({
        id: item.id,
        status: item.status,
        title: item.title,
        subtitle: item.subtitle,
        description: item.description,
        image: item.image,
      }))
    : [{
        id: rawData.id,
        status: rawData.status,
        title: rawData.title,
        subtitle: rawData.subtitle,
        description: rawData.description,
        image: rawData.image,
      }];
}