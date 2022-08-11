import dynamic from 'next/dynamic';
import { MyMatters } from 'types';

const Footer = dynamic(() => import('components/Footer'));
const HeadBar = dynamic(() => import('components/NavBar'));
const PostComment = dynamic(() => import('components/post/PostComment'));
const SlideToc = dynamic(() => import('components/post/SlideToc'));

interface Props extends MyMatters {
  showTOC?: boolean;
  children: React.ReactElement;
}

const MDXLayout = ({ title, date, showTOC = true, children }: Props) => {
  return (
    <>
      <HeadBar />

      <main id="article" className="relative max-w-4xl px-4 mx-auto my-10">
        <h1>{title}</h1>
        <time>{date}</time>
        {showTOC && <SlideToc />}

        <article id="post-content">
          {children}
          <PostComment />
        </article>
      </main>

      <Footer />
    </>
  );
};

export default MDXLayout;
