export interface FaqTranslation {
  id: number;
  faq_id: number;
  languages_code: string;
  question: string;
  answer: string | null;
  answer_image: string | null;
}

export interface RawFaqData {
  id: number;
  translations: FaqTranslation[];
}

export interface FaqItem {
  question: string;
  answer: string;
  answer_image?: string | null; 
}

export interface TransformedFaqData {
  id: number;
  status?: string;
  title: string;
  faqs: FaqItem[];
}

function transformFaqData(data: RawFaqData, locale: string): TransformedFaqData {
  const lang = locale === "vi" ? "vi-VN" : locale === "zh" ? "zh-CN" : "en-US";
  const translation = data.translations.find((t) => t.languages_code === lang);

  const source = translation || {
    question: "",
    answer: null,
    answer_image: null,
  };

  const faqItem: FaqItem = {
    question: source.question || "No question provided",
    answer: source.answer || "No answer provided",
    answer_image: source.answer_image || null,
  };

  return {
    id: data.id,
    status: "published",
    title: "Frequently Asked Questions",
    faqs: [faqItem],
  };
}

export async function getFaqs(locale: string): Promise<TransformedFaqData[]> {
  try {
    const response = await fetch(
      `https://admin.maximagoldhedging.com/items/faq?lang=${locale}&fields=*,translations.*`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    const rawData: RawFaqData[] = Array.isArray(result.data) ? result.data : [result.data];

    return rawData.map((item) => transformFaqData(item, locale));
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return [
      {
        id: 1,
        status: "draft",
        title: "Frequently Asked Questions",
        faqs: [
          {
            question: "How do users withdraw their profits?",
            answer: "Users can withdraw profits via their account dashboard using supported payment methods.",
            answer_image: null,
          },
          {
            question: "What makes Maxima different from traditional brokers?",
            answer: "Maxima uses modern technology and a client-first approach, offering transparency and flexibility.",
            answer_image: null,
          },
          {
            question: "Is it safe to trade in Maxima platform?",
            answer: "Yes, Maxima applies encryption, multi-factor authentication, and secure financial protocols.",
            answer_image: null,
          },
        ],
      },
    ];
  }
}