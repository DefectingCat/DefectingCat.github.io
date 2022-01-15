import { AllPostsWithContent, getAllPostSlugs, getPostData } from 'lib/posts';
import { GetStaticProps } from 'next';
import { FC } from 'react';

const Post: FC = () => {
  return <></>;
};

export default Post;

export function getStaticPaths() {
  return {
    paths: getAllPostSlugs(),
    fallback: false,
  };
}

export const getStaticProps: GetStaticProps<{
  postData: AllPostsWithContent;
}> = ({ params }) => {
  return {
    props: {
      postData: getPostData(params?.slug?.toString() ?? ''),
    },
  };
};
