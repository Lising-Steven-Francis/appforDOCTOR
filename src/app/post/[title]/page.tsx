import type { Metadata } from 'next';
import type { IPostItem } from 'src/types/blog';

import { kebabCase } from 'es-toolkit';

import { CONFIG } from 'src/global-config';
import axios, { endpoints } from 'src/lib/axios';
import { PostDetailsHomeView } from 'src/sections/blog/view';
import { getPost, getLatestPosts } from 'src/actions/blog-ssr';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Post details - ${CONFIG.appName}` };

type Props = {
  params: Promise<{ title: string }>;
};

export default async function Page({ params }: Props) {
  try {
    const { title } = await params;
    const { post } = await getPost(title);
    const { latestPosts } = await getLatestPosts(title);

    if (!post) {
      throw new Error('Post not found');
    }

    return <PostDetailsHomeView post={post} latestPosts={latestPosts} />;
  } catch (error) {
    console.error('Error loading post:', error);
    throw error;
  }
}

// ----------------------------------------------------------------------

/**
 * Static Exports in Next.js
 *
 * 1. Set `isStaticExport = true` in `next.config.{mjs|ts}`.
 * 2. This allows `generateStaticParams()` to pre-render dynamic routes at build time.
 *
 * For more details, see:
 * https://nextjs.org/docs/app/building-your-application/deploying/static-exports
 *
 * NOTE: Remove all "generateStaticParams()" functions if not using static exports.
 */
export async function generateStaticParams() {
  try {
    const res = await axios.get(endpoints.post.list);
    const data: IPostItem[] = CONFIG.isStaticExport ? res.data.posts : res.data.posts.slice(0, 1);

    return data.map((post) => ({
      title: kebabCase(post.title),
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}
