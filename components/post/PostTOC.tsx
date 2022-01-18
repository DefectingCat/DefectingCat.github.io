import React, { createElement, FC, Fragment } from 'react';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkToc from 'remark-toc';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import rehypeReact from 'rehype-react';
import dynamic from 'next/dynamic';

const Link = dynamic(() => import('components/RUA/RUALink'));

interface Props {
  content: string;
}

const tocPartten = /(?:^|\n)#{2,3}[ ](.*)/g;

const processedTOC = unified()
  .use(remarkParse)
  .use(remarkToc, {
    maxDepth: 3,
  })
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeSlug)
  .use(rehypeReact, {
    createElement,
    components: {
      a: (props: any) => <Link href={props.href}>{props.children}</Link>,
    },
    Fragment,
  });

const PostToc: FC<Props> = ({ content }) => {
  const matchedToc = content.match(tocPartten);

  let toc: string | null = null;
  if (matchedToc) {
    toc = matchedToc.join(' ');
  }

  const result = processedTOC.processSync(
    `\n## Table of contents\n${toc}`
  ).result;
  const TOC = [
    (result.props as any).children[0],
    (result.props as any).children[1],
    (result.props as any).children[2],
  ];

  return <>{TOC}</>;
};

export default PostToc;
