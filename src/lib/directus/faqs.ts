export interface FaqTranslation {
  id: number;
  faqs_id: number;
  languages_code: string;
  title: string;
  question: string;
  answer: string;
  question_2: string;
  answer_2: string;
  question_3: string;
  answer_3: string;
  question_4: string;
  answer_4: string;
  question_5: string;
  answer_5: string;
  question_6: string;
  answer_6: string;
}

export interface RawFaqData {
  id: number;
  status: string;
  title: string;
  question: string;
  answer: string;
  question_2: string;
  answer_2: string;
  question_3: string;
  answer_3: string;
  question_4: string;
  answer_4: string;
  question_5: string;
  answer_5: string;
  question_6: string;
  answer_6: string;
  translations: FaqTranslation[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface TransformedFaqData {
  id: number;
  status: string;
  title: string;
  faqs: FaqItem[];
}

// Function to transform data
function transformFaqData(data: RawFaqData, locale: string): TransformedFaqData {
  const lang = locale === "vi" ? "vi-VN" : locale === "zh" ? "zh-CN" : "en-US";
  const translation = data.translations.find((t) => t.languages_code === lang);

  const source = translation || data;

  const question_5 = lang === "en-US" ? data.question_5 : source.question_5;

  const faqs: FaqItem[] = [];

  for (let i = 1; i <= 10; i++) {
    const questionKey = i === 1 ? 'question' : `question_${i}`;
    const answerKey = i === 1 ? 'answer' : `answer_${i}`;

    const question =
      questionKey === 'question_5' && lang === "en-US"
        ? question_5
        : (source[questionKey as keyof typeof source] as string);
    const answer = source[answerKey as keyof typeof source] as string;

    if (question && answer) {
      faqs.push({
        question,
        answer,
      });
    }
  }

  return {
    id: data.id,
    status: data.status,
    title: source.title || "Frequently Asked Questions",
    faqs,
  };
}

export async function getFaqs(locale: string): Promise<TransformedFaqData[]> {
  try {
    const lang = locale === "vi" ? "vi-VN" : locale === "zh" ? "zh-CN" : "en-US";
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_DIRECTUS}/items/faqs?lang=${lang}&fields=*,translations.*`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch FAQs");
    }

    const result = await response.json();
    const rawData: RawFaqData = Array.isArray(result.data) ? result.data[0] : result.data;

    return [transformFaqData(rawData, locale)];
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
          },
          {
            question: "What makes Maxima different from traditional brokers?",
            answer: "Maxima uses modern technology and a client-first approach, offering transparency and flexibility.",
          },
          {
            question: "Is it safe to trade in Maxima platform?",
            answer: "Yes, Maxima applies encryption, multi-factor authentication, and secure financial protocols.",
          },
          {
            question: "How does Maxima stand out compared to conventional brokerage firms?",
            answer: "Maxima offers lower fees, faster execution, and a more intuitive user experience.",
          },
          {
            question: "In what ways is Maxima's approach unique from traditional brokers?",
            answer: "Maxima focuses on technology-driven solutions and user-friendly platforms over outdated manual processes.",
          },
          {
            question: "What are the key differences between Maxima and typical brokerage services?",
            answer: "Lower fees, improved security, and real-time analytics are Maxima's standout features.",
          },
        ],
      },
    ];
  }
}