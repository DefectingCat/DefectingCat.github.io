import { Box } from '@chakra-ui/react';
import { FC } from 'react';
import dynamic from 'next/dynamic';
import { createElement, Fragment } from 'react';
import rehypeRaw from 'rehype-raw';
import rehypeReact from 'rehype-react';
import rehypeSlug from 'rehype-slug';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import remarkToc from 'remark-toc';
import { unified } from 'unified';

const PostAnchor = dynamic(() => import('components/post/PostAnchor'));

interface Props {
  content: string;
}

const tocPartten = /(?:^|\n)#{2,3}[ ](.*)/g;

const PostTOC: FC<Props> = ({ content }) => {
  const matchedToc = content.match(tocPartten);

  let toc: string | null = null;
  if (matchedToc) {
    toc = matchedToc.join(' ');
  }

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
        a: (props: any) => (
          <PostAnchor href={props.href}>{props.children}</PostAnchor>
        ),
      },
      Fragment,
    });

  const result = processedTOC.processSync(
    `\n## Table of contents\n${toc}`
  ).result;
  const TOC = [
    (result.props as any).children[0],
    (result.props as any).children[1],
    (result.props as any).children[2],
  ];

  return (
    <>
      <Box
        display={['none', 'none', 'none', 'block']}
        position="sticky"
        top="3rem"
        mt="3rem"
      >
        {TOC}
      </Box>
    </>
  );
};

export default PostTOC;
