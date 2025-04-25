import { directus } from '@/lib/directus';
import { readItems } from '@directus/sdk';

// Định nghĩa cấu trúc của điểm nổi bật
export interface IBPoint {
  title: string;
  desc: string;
}

// Định nghĩa cấu trúc dữ liệu gốc từ Directus
export interface RawTraditionalVsMaximaIBData {
  id: number;
  status: string;
  traditional_title: string;
  traditional_subtitle: string;
  traditional_points: string; // Chuỗi văn bản
  maxima_title: string;
  maxima_subtitle: string;
  maxima_points: string; // Chuỗi văn bản
}

// Định nghĩa cấu trúc dữ liệu đã chuyển đổi
export interface TraditionalVsMaximaIBData {
  id: number;
  status: string;
  traditional_title: string;
  traditional_subtitle: string;
  traditional_points: IBPoint[]; // Mảng các điểm nổi bật
  maxima_title: string;
  maxima_subtitle: string;
  maxima_points: IBPoint[]; // Mảng các điểm nổi bật
}

// Hàm phân tích chuỗi thành mảng các điểm nổi bật
function parsePoints(pointsString: string): IBPoint[] {
  const pointsArray = pointsString.split('•\n').filter(item => item.trim() !== '');
  const result: IBPoint[] = [];

  for (let i = 0; i < pointsArray.length; i += 2) {
    const title = pointsArray[i]?.trim();
    const desc = pointsArray[i + 1]?.trim();
    if (title && desc) {
      result.push({ title, desc });
    }
  }

  return result;
}

export async function getTraditionalVsMaximaIb(): Promise<TraditionalVsMaximaIBData[]> {
  const rawData = await directus.request(readItems('traditional_vs_maxima_ib'));

  // Chuẩn hóa dữ liệu: nếu rawData là một đối tượng, bọc nó trong một mảng
  const dataArray = Array.isArray(rawData) ? rawData as RawTraditionalVsMaximaIBData[] : [rawData as RawTraditionalVsMaximaIBData];

  // Chuyển đổi dữ liệu
  return dataArray.map((item: RawTraditionalVsMaximaIBData) => ({
    id: item.id,
    status: item.status,
    traditional_title: item.traditional_title,
    traditional_subtitle: item.traditional_subtitle,
    traditional_points: parsePoints(item.traditional_points),
    maxima_title: item.maxima_title,
    maxima_subtitle: item.maxima_subtitle,
    maxima_points: parsePoints(item.maxima_points),
  }));
}