import { directus } from '@/lib/directus';
import { readItems } from '@directus/sdk';

// Định nghĩa cấu trúc của trader ranking (khớp với dataSource)
export interface TraderRanking {
  key: string;
  rank: string;
  capital: string;
  trades: number;
  profits: string;
  referral: string;
}

// Định nghĩa cấu trúc dữ liệu gốc từ Directus
export interface RawTradersRanksData {
  id: number;
  status: string;
  title: string;
  description: string;
  rank: string;
  rank_2: string;
  rank_3: string;
  rank_4: string;
  rank_5: string;
  capital: string;
  capital_2: string;
  capital_3: string;
  capital_4: string;
  capital_5: string;
  trade_per_day: number;
  trade_per_day_2: number;
  trade_per_day_3: number;
  trade_per_day_4: number;
  trade_per_day_5: number;
  monthly_profits: string;
  monthly_profits_2: string;
  monthly_profits_3: string;
  monthly_profits_4: string;
  monthly_profits_5: string;
  referral_earning: string;
  referral_earning_2: string;
  referral_earning_3: string;
  referral_earning_4: string;
  referral_earning_5: string;
}

// Định nghĩa cấu trúc dữ liệu đã chuyển đổi
export interface TradersRanksData {
  id: number;
  status: string;
  title: string;
  description: string;
  rankings: TraderRanking[];
}

// Hàm chuyển đổi dữ liệu từ Directus thành mảng rankings
function transformData(data: RawTradersRanksData): TradersRanksData {
  const rankings: TraderRanking[] = [];

  // Tạo mảng rankings từ các trường riêng biệt
  for (let i = 1; i <= 5; i++) {
    const rankKey = i === 1 ? 'rank' : `rank_${i}`;
    const capitalKey = i === 1 ? 'capital' : `capital_${i}`;
    const tradePerDayKey = i === 1 ? 'trade_per_day' : `trade_per_day_${i}`;
    const profitsKey = i === 1 ? 'monthly_profits' : `monthly_profits_${i}`;
    const referralKey = i === 1 ? 'referral_earning' : `referral_earning_${i}`;

    rankings.push({
      key: i.toString(),
      rank: data[rankKey as keyof RawTradersRanksData] as string,
      capital: data[capitalKey as keyof RawTradersRanksData] as string,
      trades: data[tradePerDayKey as keyof RawTradersRanksData] as number,
      profits: data[profitsKey as keyof RawTradersRanksData] as string,
      referral: data[referralKey as keyof RawTradersRanksData] as string,
    });
  }

  return {
    id: data.id,
    status: data.status,
    title: data.title,
    description: data.description,
    rankings,
  };
}

export async function getTradersRanks(): Promise<TradersRanksData[]> {
  const rawData = await directus.request(readItems('traders_ranks')) as RawTradersRanksData[];

  // Chuẩn hóa dữ liệu: nếu rawData là một đối tượng, bọc nó trong một mảng
  const dataArray = Array.isArray(rawData) ? rawData : [rawData];

  // Chuyển đổi dữ liệu
  return dataArray.map((item: RawTradersRanksData) => transformData(item));
}