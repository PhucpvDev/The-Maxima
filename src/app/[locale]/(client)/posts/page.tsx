// Remove 'use client'
import { getAbout1 } from '@/lib/directus/about_1';

export default async function PostPage() {
  const data = await getAbout1();
  console.log("data======", data);

  return (
    <div>
      cccc
    </div>
  );
}
