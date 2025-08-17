import clsx from 'clsx';
import PostCard from 'components/pages/blog/post-card';
import PostCardLoading from 'components/pages/blog/post-card-loading';
import Pagination from 'components/rua/rua-pagination';
import { PostPerPage, postLists } from 'lib/posts';
import { Fragment, Suspense } from 'react';

export default async function Page() {
  const allPosts = await postLists();
  const posts = allPosts.slice(0, PostPerPage);
  const next = 2;
  const total = Math.ceil(allPosts.length / PostPerPage);

  return (
    <>
      <main className="flex-1 w-full max-w-4xl mx-auto">
        <h1
          className={clsx(
            'text-5xl font-bold text-center font-Barlow',
            'mt-8 mb-20 text-gray-800 dark:text-gray-200',
          )}
        >
          Blog posts
        </h1>
        <div className="px-4 lg:px-0">
          {posts.map((post) => (
            <Fragment key={post.slug}>
              <Suspense fallback={<PostCardLoading />}>
                <PostCard post={post} />
              </Suspense>
            </Fragment>
          ))}

          <Pagination
            className="py-6 mt-4 px-7 lg:px-5"
            hasPrev={false}
            hasNext={next <= total}
            prevLink={''}
            nextLink={`/blog/${next}`}
            current={1}
            total={total}
          />
        </div>
      </main>
    </>
  );
}
