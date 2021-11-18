import { Box, Flex, Heading, Image } from '@chakra-ui/react';
import Link from 'next/link';
import { FC } from 'react';
import { AllPostsData } from '../lib/posts';
import Date from './DateFormater';

interface Props {
  post: AllPostsData;
}

const ArchiveCard: FC<Props> = ({ post }) => {
  return (
    <>
      <Box as="article" w={['full', 'full', '55rem']}>
        <Link href={`/posts/${post.url}`} passHref>
          <Flex
            p="1.25rem"
            key={post.url}
            cursor="pointer"
            borderBottom="1px"
            borderColor="gray.300"
            justifyContent="space-between"
          >
            <Box>
              <Heading mb="0.6rem" fontSize="lg">
                {post.title}
              </Heading>
              <Date dateString={post.date} />
            </Box>
            {post.index_img ? (
              <Image
                src={post.index_img}
                alt="Post image"
                w="50px"
                h="50px"
                objectFit="cover"
                rounded="lg"
              />
            ) : (
              void 0
            )}
          </Flex>
        </Link>
      </Box>
    </>
  );
};

export default ArchiveCard;
