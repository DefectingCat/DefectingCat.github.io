import { FC } from 'react';
import dynamic from 'next/dynamic';
import { renderToString } from 'react-dom/server';

const Footer = dynamic(() => import('components/Footer'));
const HeadBar = dynamic(() => import('components/NavBar'));

const MainLayout: FC = ({ children }) => {
  // const contentString = renderToString(children as any);

  // const getHeadings = (source: string) => {
  //   const regex = /<h2>(.*?)<\/h2>/g;

  //   if (source.match(regex)) {
  //     return source.match(regex)?.map((heading) => {
  //       const headingText = heading.replace('<h2>', '').replace('</h2>', '');

  //       const link = '#' + headingText.replace(/ /g, '_').toLowerCase();

  //       return {
  //         text: headingText,
  //         link,
  //       };
  //     });
  //   }

  //   return [];
  // };

  // const headings = getHeadings(contentString);
  // console.log(headings);

  return (
    <>
      <HeadBar />

      <main id="article" className="max-w-5xl px-8 mx-auto my-10">
        {children}
      </main>

      <Footer />
    </>
  );
};

export default MainLayout;
