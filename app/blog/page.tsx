import PostCard from 'components/post-card';
import PostCardLoading from 'components/rua/loading/post-card-loading';
import { PostPerPage, postLists } from 'lib/posts';
import { Fragment, Suspense } from 'react';
import Pagination from 'components/rua/rua-pagination';

export default async function Page() {
  const posts = (await postLists()).slice(0, PostPerPage);
  const next = 2;
  const total = Math.ceil(posts.length / PostPerPage);

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
        hasPrev={false}
        hasNext={next <= total}
        prevLink={''}
        nextLink={`/blog/${next}`}
        current={1}
        total={total}
      />
    </>
  );
}
