import { createElement, Fragment } from 'react';
import { Box, Image, Heading, Flex, Icon, Button, Tag } from '@chakra-ui/react';
import { getAllPostSlugs, getPostData } from 'lib/posts';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { unified } from 'unified';
import remarkToc from 'remark-toc';
import rehypeSlug from 'rehype-slug';
import rehypeReact from 'rehype-react';
import remarkRehype from 'remark-rehype';
import remarkParse from 'remark-parse';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';
// import 'highlight.js/styles/github-dark.css';
import xml from 'highlight.js/lib/languages/xml';
import bash from 'highlight.js/lib/languages/bash';
import { FiCalendar } from 'react-icons/fi';
import { RootState } from 'app/store';
import { cleanFromPath } from 'features/router/routerSlice';
import useGetColors from 'lib/hooks/useGetColors';
import { useAppSelector, useAppDispatch } from 'app/hooks';

const CopyButton = dynamic(() => import('components/post/CopyButton'));
const Footer = dynamic(() => import('components/Footer'));
const Date = dynamic(() => import('components/DateFormater'));
const PostIframe = dynamic(() => import('components/post/PostIframe'));
const PostAnchor = dynamic(() => import('components/post/PostAnchor'));
const PostImage = dynamic(() => import('components/post/PostImage'));
const PostComment = dynamic(() => import('components/post/PostComment'));

export async function getStaticPaths() {
  const paths = await getAllPostSlugs();
  return {
    paths,
    fallback: false,
  };
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const postData = await getPostData(params?.slug?.toString() ?? '');
  return {
    props: {
      postData,
    },
  };
};

const processedContent = unified()
  .use(remarkParse)
  .use(remarkToc, {
    maxDepth: 3,
  })
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
      img: (props: any) => (
        <PostImage src={props.src}>{props.children}</PostImage>
      ),
      a: (props: any) => (
        <PostAnchor href={props.href}>{props.children}</PostAnchor>
      ),
      pre: CopyButton,
      iframe: (props: any) => (
        <PostIframe src={props.src}>{props.children}</PostIframe>
      ),
    },
    Fragment,
  });

const Post = ({ postData }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const fromPath = useAppSelector((state: RootState) => state.router.fromPath);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const goBack = () => {
    dispatch(cleanFromPath());
    router.push(fromPath || '/');
  };

  const { boxBg, headingColor } = useGetColors();

  // Content cloud be undefined.
  const postContent = processedContent.processSync(
    `\n## Table of contents\n${postData?.content}`
  ).result;

  // Process the table of content
  const tocHead = (postContent.props as any).children.shift();
  (postContent.props as any).children.shift(); // '\n'
  let toc;
  // Table of content is ul element
  if ((postContent.props as any).children[0].type === 'ul') {
    toc = (postContent.props as any).children.shift();
  }

  return (
    <>
      <Head>
        <title>RUA - {postData.title}</title>
      </Head>

      {/* Child will not be 100% height, so need alignItems="flex-start" */}
      <Flex
        h={['unset', 'unset', '100vh']}
        justifyContent="center"
        overflow="auto"
        alignItems="flex-start"
        flexFlow={['column', 'column', 'row']}
        px="0.5rem"
      >
        {/* Back button */}
        <Button
          size="lg"
          mt={['1rem', '1rem', '3rem']}
          position={['unset', 'unset', 'sticky']}
          top="3rem"
          onClick={goBack}
        >
          BACK
        </Button>

        {/* Main article area */}
        <Flex
          w={['full', 'full', '55rem', '55rem', '55rem', '68rem']}
          flexFlow="column"
          px={['unset', 'unset', '1.5rem']}
        >
          <Box
            borderRadius="10px"
            mt={['1rem', '1rem', '3rem']}
            shadow="lg"
            bg={boxBg}
            overflow="hidden"
            flex="1"
          >
            {/* Post image */}
            {postData.index_img && (
              <Image
                src={postData.index_img}
                w="100%"
                fallback={<></>}
                fit="cover"
                alt="Head image"
              />
            )}

            {/* Post heading */}
            <Box as="article" p={['1rem', '1rem', '2rem']}>
              <Box as="header">
                <Heading as="h1" mb="1rem" color={headingColor}>
                  {postData.title}
                </Heading>

                {/* Post tags */}
                <Box mb="1rem">
                  {Array.isArray(postData.tags)
                    ? // Mutil tags
                      (postData.tags as string[]).map((item) => (
                        <Tag key={item} mr="0.5rem">
                          {item}
                        </Tag>
                      ))
                    : // Signal tags
                      postData.tags && <Tag>{postData.tags}</Tag>}
                </Box>

                {/* Date */}
                <Flex alignItems="center" color="gray.600">
                  <Icon as={FiCalendar} mr="0.5rem" />
                  <Date dateString={postData.date} />
                </Flex>
              </Box>

              {/* Post content */}
              <Box as="section" id="write" mt="2rem">
                {postContent}
              </Box>
            </Box>
          </Box>

          {/* Comment */}
          <PostComment />

          <Footer />
        </Flex>

        {/* Table of content */}
        {toc && (
          <Box
            display={['none', 'none', 'none', 'block']}
            position="sticky"
            top="3rem"
            mt="3rem"
          >
            {tocHead}
            {toc}
          </Box>
        )}
      </Flex>
    </>
  );
};

export default Post;
