import { FC } from 'react';
import dynamic from 'next/dynamic';
import { MyMatters } from 'types';
import { renderToString } from 'react-dom/server';
import { getHeadings } from 'lib/utils';
import PostTOC from 'components/post/PostTOC';

const Footer = dynamic(() => import('components/Footer'));
const HeadBar = dynamic(() => import('components/NavBar'));
const PostComment = dynamic(() => import('components/post/PostComment'));

interface Props extends MyMatters {
  showTOC?: boolean;
}

const MainLayout: FC<Props> = ({ title, date, showTOC = true, children }) => {
  const contentString = renderToString(children as any);
  const headings = getHeadings(contentString);

  return (
    <>
      <HeadBar />

      <main id="article" className="max-w-5xl px-4 mx-auto my-10">
        <article>
          <h1>{title}</h1>

          <time>{date}</time>

          {showTOC && <PostTOC headings={headings} />}

          {children}

          <PostComment />
        </article>
      </main>

      <Footer />
    </>
  );
};

export default MainLayout;
