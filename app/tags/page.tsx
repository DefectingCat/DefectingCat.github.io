import clsx from 'clsx';
import { postLists } from 'lib/posts';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RUA - Tags',
};

const Page = async () => {
  const posts = await postLists();
  // tag ["Rust", "React"] or "Rust"
  // tag object {"Rust": 1, "React": 1}
  const tags = posts.reduce<{
    [key: string]: number;
  }>((prev, cur) => {
    if (cur.tags?.length <= 0) {
      return prev;
    }
    if (typeof cur.tags === 'string') {
      const tag = prev[cur.tags];
      if (tag) {
        prev[cur.tags] += 1;
      } else {
        prev[cur.tags] = 1;
      }
    }
    if (Array.isArray(cur.tags)) {
      cur.tags.forEach((tag) => {
        const tagCount = prev[tag];
        if (tagCount) {
          prev[tag] += 1;
        } else {
          prev[tag] = 1;
        }
      });
    }
    return prev;
  }, {});

  return (
    <div className={clsx('flex gap-4 flex-wrap')}>
      {Object.entries(tags).map(([tag, count]) => (
        <div
          key={tag}
          className={clsx(
            'px-4 py-2 bg-gray-200',
            'rounded-lg flex items-center',
            'gap-2 cursor-pointer',
            'dark:bg-rua-gray-800',
          )}
        >
          <div>{tag}</div>
          <div>{count}</div>
        </div>
      ))}
    </div>
  );
};

export default Page;
