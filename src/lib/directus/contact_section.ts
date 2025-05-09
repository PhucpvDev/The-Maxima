export interface ContactTranslation {
  id: number;
  contact_section_id: number;
  languages_code: string;
  title: string;
  head_office: string;
  hotline: string;
  email: string;
  social_ytb: string;
  social_fb: string;
  social_tiktok: string;
  get_in_touch_title: string;
  training_center: string;
  feedback_note: string;
  download_button_text: string;
  download_button_url: string;
  logo: string;
}

// Define the raw data structure from Directus
export interface RawContactData {
  id: number;
  status: string;
  title: string;
  head_office: string;
  hotline: string;
  email: string;
  social_ytb: string;
  social_fb: string;
  social_tiktok: string;
  get_in_touch_title: string;
  training_center: string;
  feedback_note: string;
  download_button_text: string;
  download_button_url: string;
  logo: string;
  translations: ContactTranslation[];
}

// Define the transformed data structure
export interface TransformedContactData {
  id: number;
  status: string;
  title: string;
  head_office: string;
  hotline: string;
  email: string;
  social_ytb: string;
  social_fb: string;
  social_tiktok: string;
  get_in_touch_title: string;
  training_center: string;
  feedback_note: string;
  download_button_text: string;
  download_button_url: string;
  logo: string;
}

// Function to transform data
function transformContactData(data: RawContactData, locale: string): TransformedContactData {
  // Find the translation matching the locale
  const lang = locale === "vi" ? "vi-VN" : locale === "zh" ? "zh-CN" : "en-US";
  const translation = data.translations.find((t) => t.languages_code === lang);

  // Use translation if found, otherwise fall back to default fields
  const source = translation || data;

  // Clean download_button_url for zh-CN (remove quotes)
  const download_button_url = source.download_button_url.replace(/^"|"$/g, "");

  return {
    id: data.id,
    status: data.status,
    title: source.title || "The Maxima Experience",
    head_office: source.head_office || "Head office: 1B Malaysia",
    hotline: source.hotline || "Hotline: 0243 990 4891",
    email: source.email || "Email: themaxima@gmail.com",
    social_ytb: source.social_ytb || "https://facebook.com/themaxima",
    social_fb: source.social_fb || "https://youtube.com/themaxima",
    social_tiktok: source.social_tiktok || "https://tiktok.com/themaxima",
    get_in_touch_title: source.get_in_touch_title || "Get in Touch",
    training_center: source.training_center || "Training Center in Kuala Lumpur, Malaysia",
    feedback_note: source.feedback_note || "Send us your feedback if needed!",
    download_button_text: source.download_button_text || "Download Now",
    download_button_url: download_button_url || "https://example.com/download",
    logo: source.logo || "914181cb-ab81-4031-85f6-9dc28bca820b",
  };
}

// Export the function to get contact data
export async function getContact(locale: string): Promise<TransformedContactData> {
  try {
    // Map locale to language code
    const lang = locale === "vi" ? "vi-VN" : locale === "zh" ? "zh-CN" : "en-US";
    const response = await fetch(
      `https://maximagoldhedging.com/items/contact_section?lang=${lang}&fields=*,translations.*`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch contact data");
    }

    const result = await response.json();
    const rawData: RawContactData = Array.isArray(result.data) ? result.data[0] : result.data;

    // Transform the data with the specified locale
    return transformContactData(rawData, locale);
  } catch (error) {
    console.error("Error fetching contact data:", error);
    // Return fallback data
    return {
      id: 1,
      status: "draft",
      title: "The Maxima Experience",
      head_office: "Head office: 1B Malaysia",
      hotline: "Hotline: 0243 990 4891",
      email: "Email: themaxima@gmail.com",
      social_ytb: "https://facebook.com/themaxima",
      social_fb: "https://youtube.com/themaxima",
      social_tiktok: "https://tiktok.com/themaxima",
      get_in_touch_title: "Get in Touch",
      training_center: "Training Center in Kuala Lumpur, Malaysia",
      feedback_note: "Send us your feedback if needed!",
      download_button_text: "Download Now",
      download_button_url: "https://example.com/download",
      logo: "914181cb-ab81-4031-85f6-9dc28bca820b",
    };
  }
}