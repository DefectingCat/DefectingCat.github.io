import { GetStaticProps, InferGetStaticPropsType } from 'next';
import React, { useEffect } from 'react';
import 'highlight.js/styles/atom-one-light.css';
import Head from 'next/head';
import cn from 'classnames';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { FiChevronLeft } from 'react-icons/fi';
import Sticky from 'react-stickynode';
import useMediaQuery from 'lib/hooks/useMediaQuery';
import { useRUAContext } from 'lib/store';
import Link from 'next/link';
import useInView from 'lib/hooks/useInView';
import { PrismaClient, Posts, Tags } from '@prisma/client';
import PostHeadLoading from 'components/loading/PostHeadLoading';
import { useRouter } from 'next/router';
import useUnified from 'lib/hooks/useUnified';

const PostCommentLoading = dynamic(
  () => import('components/loading/PostCommentLoading')
);

const Button = dynamic(() => import('components/RUA/RUAButton'));
const TableOfContent = dynamic(() => import('components/post/PostTOC'));
const PostHeader = dynamic(() => import('components/post/PostHeader'), {
  loading: () => <PostHeadLoading />,
});
const Footer = dynamic(() => import('components/Footer'));
const PostComment = dynamic(() => import('components/post/PostComment'), {
  loading: () => <PostCommentLoading />,
});
const DarkModeBtn = dynamic(() => import('components/nav/DarkModeBtn'));

const Post = ({ post }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { targetRef, inView } = useInView();

  const matched = useMediaQuery('(max-width: 640px)');
  const { state } = useRUAContext();
  const { backPath } = state;

  const router = useRouter();

  useEffect(() => {
    if (!post) router.replace('/404');
  });

  const postContent = useUnified(post ? post.content : '');

  if (!post) return;
  const { title, index_img, content, tags, date } = post;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <div
        className={cn(
          'grid grid-cols-12 gap-4 px-2 py-4 container mx-auto',
          'md:py-8'
        )}
      >
        <aside
          className={cn(
            'col-span-12 justify-end',
            'md:col-span-2 lg:col-span-1',
            'relative text-right'
          )}
        >
          <Sticky enabled={!matched} top={32}>
            <Link href={backPath || '/'} passHref>
              <a>
                <Button
                  className={cn(
                    'flex items-center w-full',
                    'text-gray-600 md:justify-center'
                  )}
                >
                  <FiChevronLeft className="mr-2 md:hidden" />
                  BACK
                </Button>
              </a>
            </Link>
          </Sticky>

          <DarkModeBtn
            className={cn(
              'absolute top-[50%] right-1 translate-y-[-50%]',
              'md:fixed md:top-[unset] md:translate-y-0 md:right-[unset]',
              'md:bottom-[32px] md:translate-x-[-100%]'
            )}
          />
        </aside>

        <main className={'md:col-span-10 col-span-12 lg:col-span-8'}>
          <div
            className={
              'bg-white dark:bg-rua-gray-800 shadow-md rounded-lg overflow-hidden'
            }
          >
            {index_img && (
              <div className="relative aspect-video">
                <Image
                  src={index_img}
                  layout="fill"
                  objectFit="cover"
                  alt="Article image"
                  priority
                />
              </div>
            )}

            <article className={'p-4 lg:p-8'}>
              <PostHeader title={title} tags={tags} date={date.toString()} />

              <section id={'write'}>{postContent}</section>
            </article>
          </div>

          <div ref={targetRef} className={'mt-8 min-h-[349px]'}>
            {inView && <PostComment />}
          </div>

          <Footer />
        </main>

        <aside className={cn('hidden lg:block col-span-3')}>
          <Sticky enabled top={32}>
            <TableOfContent content={content} />
          </Sticky>
        </aside>
      </div>
    </>
  );
};

export default Post;

export async function getStaticPaths() {
  const prisma = new PrismaClient();
  const posts = await prisma.posts.findMany({
    orderBy: {
      date: 'desc',
    },
    select: {
      url: true,
    },
  });
  const paths = posts.map((post) => {
    return {
      params: {
        slug: post.url,
      },
    };
  });

  return {
    paths,
    fallback: true,
  };
}

export type Post = {
  tags: Tags[];
} & Posts;

export const getStaticProps: GetStaticProps<{
  post: Post | null;
}> = async ({ params }) => {
  const prisma = new PrismaClient();
  const post = await prisma.posts.findFirst({
    where: {
      url: params?.slug?.toString() ?? '',
    },
    include: {
      tags: {
        select: {
          name: true,
        },
      },
    },
  });

  return {
    props: {
      post: JSON.parse(JSON.stringify(post)),
    },
    revalidate: 10,
  };
};
