"use client";

import { use } from "react";
import BlogPostDetail from "@/components/client/posts/postDetails";
import Header from "@/components/client/layout/header";
import Footer from "@/components/client/layout/footer";
import { NextPage } from "next";

interface PostPageProps {
  params: Promise<{ postId: string }>; // Hỗ trợ params bất đồng bộ
}

const PostPage: NextPage<PostPageProps> = ({ params }) => {
  const { postId } = use(params); // Unwrap Promise bằng use

  return (
    <>
      <Header />
      <BlogPostDetail params={{ postId }} />
      <Footer />
    </>
  );
};

export default PostPage;
