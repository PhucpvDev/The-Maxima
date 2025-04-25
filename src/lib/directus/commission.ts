import { directus } from '@/lib/directus';
import { readItems } from '@directus/sdk';

// Định nghĩa cấu trúc của commission (khớp với dataSource)
export interface CommissionData {
  key: string;
  rank: string;
  commission: string;
  profits: string;
  apple: string;
}

// Định nghĩa cấu trúc dữ liệu gốc từ Directus
export interface RawCommissionData {
  id: number;
  status: string;
  title: string;
  description: string;
  rank: string;
  rank_2: string;
  rank_3: string;
  commission_per_lot: string;
  commission_per_lot_2: string;
  commission_per_lot_3: string;
  profits_sharing: string;
  profits_sharing_2: string;
  profits_sharing_3: string;
  apple_orchard: string;
  apple_orchard_2: string;
  apple_orchard_3: string;
}

// Định nghĩa cấu trúc dữ liệu đã chuyển đổi
export interface TransformedCommissionData {
  id: number;
  status: string;
  title: string;
  description: string;
  commissions: CommissionData[];
}

// Hàm chuyển đổi dữ liệu từ Directus thành mảng commissions
function transformData(data: RawCommissionData): TransformedCommissionData {
  const commissions: CommissionData[] = [];

  // Tạo mảng commissions từ các trường riêng biệt
  for (let i = 1; i <= 3; i++) {
    const rankKey = i === 1 ? 'rank' : `rank_${i}`;
    const commissionKey = i === 1 ? 'commission_per_lot' : `commission_per_lot_${i}`;
    const profitsKey = i === 1 ? 'profits_sharing' : `profits_sharing_${i}`;
    const appleKey = i === 1 ? 'apple_orchard' : `apple_orchard_${i}`;

    commissions.push({
      key: i.toString(),
      rank: data[rankKey as keyof RawCommissionData] as string,
      commission: data[commissionKey as keyof RawCommissionData] as string,
      profits: data[profitsKey as keyof RawCommissionData] as string,
      apple: data[appleKey as keyof RawCommissionData] as string,
    });
  }

  return {
    id: data.id,
    status: data.status,
    title: data.title,
    description: data.description,
    commissions,
  };
}

export async function getCommission(): Promise<TransformedCommissionData[]> {
  const rawData = await directus.request(readItems('commission')) as RawCommissionData[];

  // Chuẩn hóa dữ liệu: nếu rawData là một đối tượng, bọc nó trong một mảng
  const dataArray = Array.isArray(rawData) ? rawData : [rawData];

  // Chuyển đổi dữ liệu
  return dataArray.map((item: RawCommissionData) => transformData(item));
}