'use client';

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

interface ClientLayoutProps {
  children: React.ReactNode;
  defaultTitle: string;
  description: string;
}

export default function ClientLayout({
  children,
  defaultTitle,
  description,
}: ClientLayoutProps) {
  const searchParams = useSearchParams();
  const user = searchParams.get("user");
  const title = defaultTitle; 

  useEffect(() => {
    document.title = `${user ? ` ${user} |` : ""} ${title}`;
    const metaDescription = document.querySelector('meta[name="description"]');
    const metaTwitterTitle = document.querySelector('meta[name="twitter:title"]');
    const metaOgTitle = document.querySelector('meta[property="og:title"]');
    const metaOgDescription = document.querySelector(
      'meta[property="og:description"]'
    );

    if (metaDescription) {
      metaDescription.setAttribute("content", description);
    }
    if (metaTwitterTitle) {
      metaTwitterTitle.setAttribute("content", title);
    }
    if (metaOgTitle) {
      metaOgTitle.setAttribute("content", title);
    }
    if (metaOgDescription) {
      metaOgDescription.setAttribute("content", description);
    }
  }, [user, title, description]);

  return <>{children}</>;
}