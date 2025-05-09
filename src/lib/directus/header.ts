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

// Define the raw data structure from Directus
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

// Define the transformed data structure
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

// Function to transform data
function transformHeaderData(data: RawHeaderData, locale: string): TransformedHeaderData {
  // Find the translation matching the locale
  const lang = locale === "vi" ? "vi-VN" : locale === "zh" ? "zh-CN" : "en-US";
  const translation = data.translations.find((t) => t.languages_code === lang);

  // Use translation if found, otherwise fall back to default fields
  const source = translation || data;

  // Parse nav_links and stats JSON strings
  let nav_links: { name: string; url: string }[] = [];
  let stats: { label: string; value: string }[] = [];

  try {
    nav_links = JSON.parse(source.nav_links || '[]');
  } catch (e) {
    console.error("Error parsing nav_links:", e);
  }

  try {
    // Split stats string into an array and parse each item
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
    // Use main response's stats_icon IDs for consistency
    stats_icon_1: data.stats_icon_1 || "5943fcfd-e965-4b39-8a28-12156a109c17",
    stats_icon_2: data.stats_icon_2 || "00bee491-f294-45b4-974d-5d4207f363dc",
    stats_icon_3: data.stats_icon_3 || "017cb077-6c00-4060-aa3e-ce8c14b009fb",
  };
}

// Export the function to get header data
export async function getHeader(locale: string): Promise<TransformedHeaderData> {
  try {
    // Map locale to language code
    const lang = locale === "vi" ? "vi-VN" : locale === "zh" ? "zh-CN" : "en-US";
    const response = await fetch(
      `https://maximagoldhedging.com/items/header?lang=${lang}&fields=*,translations.*`,
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

    // Transform the data with the specified locale
    return transformHeaderData(rawData, locale);
  } catch (error) {
    console.error("Error fetching header data:", error);
    // Return fallback data
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