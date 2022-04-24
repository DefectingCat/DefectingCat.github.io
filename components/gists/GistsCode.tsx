import { Gist } from 'types';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypePrism from '@mapbox/rehype-prism';
import remarkGfm from 'remark-gfm';
import { createElement, Fragment, useEffect, useState } from 'react';
import rehypeReact from 'rehype-react';
import classNames from 'classnames';
import useInView from 'lib/hooks/useInView';
import loadingImage from 'public/images/img/mona-loading-default.gif';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
  gist: Gist;
  f: string;
}

const GistsCode = ({ gist, f }: Props) => {
  const file = gist.files;
  const url = file[f].raw_url;
  const format = file[f].language;

  const { ref, inView } = useInView();

  const [rawCode, setRawCode] = useState('');
  useEffect(() => {
    inView && getRawCode();

    async function getRawCode() {
      const res = await fetch(url);
      const raw = await res.text();
      setRawCode(`\`\`\`${format ?? ''}\n${raw}`);
    }
  }, [format, inView, url]);

  const code = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(remarkGfm)
    .use(rehypePrism, { ignoreMissing: true })
    .use(rehypeReact, {
      createElement,
      Fragment,
    })
    .processSync(rawCode).result;

  return (
    <>
      <div ref={ref} className={classNames('pb-4 text-sm')}>
        <h1 className="md:text-lg">
          {gist.owner.login} /
          <Link href={`/g/${gist.id}`}>{file[f].filename}</Link>
        </h1>
        <p className="text-gray-400">Update at: {gist.updated_at}</p>
        <p className="text-gray-500">{gist.description}</p>

        {rawCode ? (
          <div className={classNames(!rawCode && 'min-h-[300px]')}>{code}</div>
        ) : (
          <div
            className={classNames(
              'h-[300px] flex',
              'flex-col items-center justify-center'
            )}
          >
            <Image width={50} height={50} src={loadingImage} alt="Loading" />

            <span className="my-4">rua rua rua...</span>
          </div>
        )}
      </div>
    </>
  );
};

export default GistsCode;
