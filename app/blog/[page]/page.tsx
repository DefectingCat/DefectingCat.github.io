import PostCard from 'app/blog/post-card';
import PostCardLoading from 'app/blog/post-card-loading';
import { PostPerPage, postLists } from 'lib/posts';
import { Fragment, Suspense } from 'react';
import Pagination from 'components/rua/rua-pagination';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { page: string } }) {
  const page = Number(params.page);
  if (!page) notFound();

  const allPosts = await postLists();
  const posts = allPosts.slice((page - 1) * PostPerPage, PostPerPage * page);
  const prev = page - 1;
  const next = page + 1;
  const total = Math.ceil(allPosts.length / PostPerPage);

  return (
    <>
      {posts.map((post) => (
        <Fragment key={post.slug}>
          <Suspense fallback={<PostCardLoading />}>
            <PostCard post={post} />
          </Suspense>
        </Fragment>
      ))}

      <Pagination
        className="py-6 mt-4 px-7 lg:px-5"
        hasPrev={!!prev}
        hasNext={next <= total}
        prevLink={prev === 1 ? '/blog' : `/blog/${prev}`}
        nextLink={`/blog/${next}`}
        current={next - 1}
        total={total}
      />
    </>
  );
}
