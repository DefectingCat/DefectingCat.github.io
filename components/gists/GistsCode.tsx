import { FC } from 'react';
import { Gist } from 'types';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypePrism from '@mapbox/rehype-prism';
import remarkGfm from 'remark-gfm';
import rehypeStringify from 'rehype-stringify';

interface Props {
  gist: Gist;
  f: string;
}

const GistsCode: FC<Props> = ({ gist, f }) => {
  const file = gist.files;

  const test = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(remarkGfm)
    .use(rehypePrism)
    .use(rehypeStringify).processSync(`\`\`\` js
console.log();
\`\`\``);

  return (
    <>
      <div key={file[f].raw_url} className="py-4 text-sm">
        <h1 className="md:text-lg">
          {gist.owner.login} / {file[f].filename}
        </h1>
        <p className="text-gray-400">Update at: {gist.updated_at}</p>
        <p className="text-gray-500">{gist.description}</p>

        <div dangerouslySetInnerHTML={{ __html: test.toString() }}></div>
      </div>
    </>
  );
};

export default GistsCode;
