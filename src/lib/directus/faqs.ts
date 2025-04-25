import { directus } from '@/lib/directus';
import { readItems } from '@directus/sdk';

// Define the raw data structure from Directus
export interface RawFaqData {
  id: number;
  status: string;
  title: string;
  question: string;
  question_2: string;
  question_3: string;
  question_4: string;
  question_5: string;
  question_6: string;
  answer: string;
  answer_2: string;
  answer_3: string;
  answer_4: string;
  answer_5: string;
  answer_6: string;
}

// Define the structure for FAQ items
export interface FaqItem {
  question: string;
  answer: string;
}

// Define the transformed data structure
export interface TransformedFaqData {
  id: number;
  status: string;
  title: string;
  faqs: FaqItem[];
}

// Function to transform data
function transformFaqData(data: RawFaqData): TransformedFaqData {
  const faqs: FaqItem[] = [];

  // Create faqs array from individual fields
  for (let i = 1; i <= 6; i++) {
    const questionKey = i === 1 ? 'question' : `question_${i}`;
    const answerKey = i === 1 ? 'answer' : `answer_${i}`;

    // Only add if both question and answer exist
    const question = data[questionKey as keyof RawFaqData] as string;
    const answer = data[answerKey as keyof RawFaqData] as string;
    
    if (question && answer) {
      faqs.push({
        question,
        answer
      });
    }
  }

  return {
    id: data.id,
    status: data.status,
    title: data.title,
    faqs
  };
}

// Export the function to get FAQs
export async function getFaqs(): Promise<TransformedFaqData[]> {
  const rawData = await directus.request(readItems('faqs')) as RawFaqData[];
  
  // Normalize data: if rawData is an object, wrap it in an array
  const dataArray = Array.isArray(rawData) ? rawData : [rawData];
  
  // Transform the data
  return dataArray.map((item: RawFaqData) => transformFaqData(item));
}