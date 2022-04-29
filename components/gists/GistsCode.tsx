import { GistsFile } from 'types';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypePrism from '@mapbox/rehype-prism';
import remarkGfm from 'remark-gfm';
import { createElement, Fragment } from 'react';
import rehypeReact from 'rehype-react';

interface Props {
  file: GistsFile;
}

const GistsCode = ({ file }: Props) => {
  const code = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(remarkGfm)
    .use(rehypePrism, { ignoreMissing: true })
    .use(rehypeReact, {
      createElement,
      Fragment,
    })
    .processSync(`\`\`\`${file.language ?? ''}\n${file.content}`).result;

  return (
    <>
      <div>{code}</div>
    </>
  );
};

export default GistsCode;
