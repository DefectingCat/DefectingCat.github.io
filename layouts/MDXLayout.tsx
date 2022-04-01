import { FC } from 'react';
import dynamic from 'next/dynamic';
import { MyMatters } from 'types';
import { renderToString } from 'react-dom/server';
import { getHeadings } from 'lib/utils';
import PostTOC from 'components/post/PostTOC';

const Footer = dynamic(() => import('components/Footer'));
const HeadBar = dynamic(() => import('components/NavBar'));

interface Props extends MyMatters {}

const MainLayout: FC<Props> = ({ title, date, children }) => {
  const contentString = renderToString(children as any);
  const headings = getHeadings(contentString);

  return (
    <>
      <HeadBar />

      <main id="article" className="max-w-5xl px-8 mx-auto my-10">
        <article>
          <h1>{title}</h1>

          <time>{date}</time>

          <PostTOC headings={headings} />

          {children}
        </article>
      </main>

      <Footer />
    </>
  );
};

export default MainLayout;
