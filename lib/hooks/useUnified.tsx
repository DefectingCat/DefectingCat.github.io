import React, { createElement, Fragment, useEffect, useMemo } from 'react';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import rehypeReact from 'rehype-react';
import 'highlight.js/styles/atom-one-light.css';
import xml from 'highlight.js/lib/languages/xml';
import bash from 'highlight.js/lib/languages/bash';
import dynamic from 'next/dynamic';

const RUALink = dynamic(() => import('components/RUA/RUALink'));
const PostImage = dynamic(() => import('components/post/PostImage'));
const PostIframe = dynamic(() => import('components/post/PostIframe'));

const processedContent = unified()
  .use(remarkParse)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeHighlight, {
    languages: { vue: xml, bash },
    aliases: { bash: ['npm'] },
    ignoreMissing: true,
  })
  .use(rehypeSlug)
  .use(remarkGfm, { tableCellPadding: true })
  .use(rehypeReact, {
    createElement,
    components: {
      a: (props: any) => (
        <RUALink href={props.href} isExternal>
          {props.children}
        </RUALink>
      ),
      img: (props: any) => <PostImage src={props.src} />,
      iframe: (props: any) => <PostIframe src={props.src} />,
    },
    Fragment,
  });

const useUnified = (content: string) => {
  const processer = useMemo(processedContent, [processedContent]);
  return processer.processSync(content).result;
};

export default useUnified;
