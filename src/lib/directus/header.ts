export interface HeaderTranslation {
  id: number;
  header_id: number;
  languages_code: string;
  logo: string;
  header_image: string;
  main_title: string;
  subtitle: string;
  rate_text: string;
  cta_button_text: string;
  cta_button_url: string | null;
  nav_links: string;
  stats: string;
  stats_icon_1: string;
  stats_icon_2: string;
  stats_icon_3: string;
}

export interface RawHeaderData {
  id: number;
  status: string;
  logo: string;
  header_image: string;
  main_title: string;
  subtitle: string;
  rate_text: string;
  cta_button_text: string;
  cta_button_url: string;
  nav_links: string;
  stats: string;
  stats_icon_1: string;
  stats_icon_2: string;
  stats_icon_3: string;
  translations: HeaderTranslation[];
}

export interface TransformedHeaderData {
  id: number;
  status: string;
  logo: string;
  header_image: string;
  main_title: string;
  subtitle: string;
  rate_text: string;
  cta_button_text: string;
  cta_button_url: string;
  nav_links: { name: string; url: string }[];
  stats: { label: string; value: string }[];
  stats_icon_1: string;
  stats_icon_2: string;
  stats_icon_3: string;
}

function transformHeaderData(data: RawHeaderData, locale: string): TransformedHeaderData {
  const lang = locale === "vi" ? "vi-VN" : locale === "zh" ? "zh-CN" : "en-US";
  const translation = data.translations.find((t) => t.languages_code === lang);

  const source = translation || data;

  let nav_links: { name: string; url: string }[] = [];
  let stats: { label: string; value: string }[] = [];

  try {
    nav_links = JSON.parse(source.nav_links || '[]');
  } catch (e) {
    console.error("Error parsing nav_links:", e);
  }

  try {
    stats = source.stats
      .split('\n')
      .map((item) => item.trim())
      .filter((item) => item)
      .map((item) => JSON.parse(item.replace(/,$/, '')));
  } catch (e) {
    console.error("Error parsing stats:", e);
  }

  return {
    id: data.id,
    status: data.status,
    logo: source.logo || "914181cb-ab81-4031-85f6-9dc28bca820b",
    header_image: source.header_image || "61c1fa53-d194-4f26-9993-d092eaf69612",
    main_title: source.main_title || "UNLOCK PEAK PROFIT MODEL 2.0 BREAKTHROUGH WITH FUTURES TRADING",
    subtitle: source.subtitle || "To Be Smarter, We’ve Predicted Your Success",
    rate_text: source.rate_text || "Rate — How Much Is It?",
    cta_button_text: source.cta_button_text || "Get Started Now",
    cta_button_url: source.cta_button_url || "/get-started",
    nav_links,
    stats,
    stats_icon_1: data.stats_icon_1 || "5943fcfd-e965-4b39-8a28-12156a109c17",
    stats_icon_2: data.stats_icon_2 || "00bee491-f294-45b4-974d-5d4207f363dc",
    stats_icon_3: data.stats_icon_3 || "017cb077-6c00-4060-aa3e-ce8c14b009fb",
  };
}

export async function getHeader(locale: string): Promise<TransformedHeaderData> {
  try {
    const lang = locale === "vi" ? "vi-VN" : locale === "zh" ? "zh-CN" : "en-US";
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_DIRECTUS}/items/header?lang=${lang}&fields=*,translations.*`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch header data");
    }

    const result = await response.json();
    const rawData: RawHeaderData = Array.isArray(result.data) ? result.data[0] : result.data;

    return transformHeaderData(rawData, locale);
  } catch (error) {
    console.error("Error fetching header data:", error);
    return {
      id: 1,
      status: "draft",
      logo: "914181cb-ab81-4031-85f6-9dc28bca820b",
      header_image: "61c1fa53-d194-4f26-9993-d092eaf69612",
      main_title: "UNLOCK PEAK PROFIT MODEL 2.0 BREAKTHROUGH WITH FUTURES TRADING",
      subtitle: "To Be Smarter, We’ve Predicted Your Success",
      rate_text: "Rate — How Much Is It?",
      cta_button_text: "Get Started Now",
      cta_button_url: "/get-started",
      nav_links: [
        { name: "Home", url: "/home" },
        { name: "About us", url: "/about" },
        { name: "How", url: "/how" },
        { name: "Tutorial", url: "/tutorial" },
        { name: "Become IB", url: "/become-ib" },
        { name: "FAQ", url: "/faq" },
        { name: "Contact", url: "/contact" },
        { name: "Affiliate", url: "/affiliate" },
      ],
      stats: [
        { label: "Company size", value: "2,000 staff" },
        { label: "Client", value: "300,000 shop" },
        { label: "Coverage", value: "3 Nation" },
      ],
      stats_icon_1: "5943fcfd-e965-4b39-8a28-12156a109c17",
      stats_icon_2: "00bee491-f294-45b4-974d-5d4207f363dc",
      stats_icon_3: "017cb077-6c00-4060-aa3e-ce8c14b009fb",
    };
  }
}