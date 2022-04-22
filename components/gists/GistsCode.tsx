import { Gist } from 'types';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypePrism from '@mapbox/rehype-prism';
import remarkGfm from 'remark-gfm';
import { createElement, Fragment, useEffect, useState } from 'react';
import rehypeReact from 'rehype-react';

interface Props {
  gist: Gist;
  f: string;
}

const GistsCode = ({ gist, f }: Props) => {
  const file = gist.files;
  const url = file[f].raw_url;
  const format = file[f].language;

  const [rawCode, setRawCode] = useState('');
  useEffect(() => {
    getRawCode();

    async function getRawCode() {
      const res = await fetch(url);
      const raw = await res.text();
      setRawCode(`\`\`\`${format ?? ''}\n${raw}`);
    }
  }, [format, url]);

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
      <div className="pb-4 text-sm">
        <h1 className="md:text-lg">
          {gist.owner.login} / {file[f].filename}
        </h1>
        <p className="text-gray-400">Update at: {gist.updated_at}</p>
        <p className="text-gray-500">{gist.description}</p>

        {code}
      </div>
    </>
  );
};

export default GistsCode;
