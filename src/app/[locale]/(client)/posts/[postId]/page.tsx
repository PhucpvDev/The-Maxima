"use client";

import BlogPostDetail from "@/components/client/posts/postDetails";
import Header from "@/components/client/layout/header";
import Footer from "@/components/client/layout/footer";

export default function PostPage({ params }: { params: { postId: string } }) {
  return (
    <>
      <Header />
      <BlogPostDetail params={params} />
      <Footer />
    </>
  );
}
