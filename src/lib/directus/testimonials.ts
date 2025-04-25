import { directus } from '@/lib/directus';
import { readItems } from '@directus/sdk';

// Define the raw data structure from Directus
export interface RawTestimonialData {
  id: number;
  status: string;
  title: string;
  description: string;
  author: string;
  author_2: string;
  author_3: string;
  content: string;
  content_2: string;
  content_3: string;
  role: string;
  role_2: string;
  role_3: string;
  images_user: string;
  images_user_2: string;
  images_user_3: string;
}

// Define the structure for transformed testimonial items
export interface TestimonialItem {
  text: string;
  avatar: string;
  name: string;
  position: string;
}

// Define the transformed data structure
export interface TransformedTestimonialData {
  id: number;
  status: string;
  title: string;
  description: string;
  testimonials: TestimonialItem[];
}

// Function to transform data
function transformTestimonialData(data: RawTestimonialData): TransformedTestimonialData {
  const testimonials: TestimonialItem[] = [];
  const assetUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || '';

  // Create testimonials array from individual fields
  for (let i = 1; i <= 3; i++) {
    const authorKey = i === 1 ? 'author' : `author_${i}`;
    const contentKey = i === 1 ? 'content' : `content_${i}`;
    const roleKey = i === 1 ? 'role' : `role_${i}`;
    const imageKey = i === 1 ? 'images_user' : `images_user_${i}`;

    testimonials.push({
      text: data[contentKey as keyof RawTestimonialData] as string,
      // Constructing the avatar URL from Directus asset ID
      avatar: `${data[imageKey as keyof RawTestimonialData]}`,
      name: data[authorKey as keyof RawTestimonialData] as string,
      position: data[roleKey as keyof RawTestimonialData] as string,
    });
  }

  return {
    id: data.id,
    status: data.status,
    title: data.title,
    description: data.description,
    testimonials
  };
}

// Export the function to get testimonials
export async function getTestimonials(): Promise<TransformedTestimonialData[]> {
  const rawData = await directus.request(readItems('testimonials_section')) as RawTestimonialData[];
  
  // Normalize data: if rawData is an object, wrap it in an array
  const dataArray = Array.isArray(rawData) ? rawData : [rawData];
  
  // Transform the data
  return dataArray.map((item: RawTestimonialData) => transformTestimonialData(item));
}