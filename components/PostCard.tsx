import { FC } from 'react';
import Link from 'next/link';
import Date from './DateFormater';
import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { AllPostsData } from '../lib/posts';
import { Icon, Image } from '@chakra-ui/react';
import { FiCalendar } from 'react-icons/fi';

interface Props {
  post: AllPostsData;
}

const PostCard: FC<Props> = ({ post }) => {
  return (
    <>
      <Box
        as="article"
        maxW={'48rem'}
        borderRadius={'10px'}
        bg={'white'}
        overflow="hidden"
        boxShadow="card"
        mb={'2.5rem'}
      >
        <Link href={`/posts/${post.url}`}>
          <a>
            <Image
              src={post.index_img}
              maxH="18rem"
              w="100%"
              fallback={<></>}
              fit="cover"
              alt="Post image"
            />
          </a>
        </Link>

        <Box p={'28px'} key={post.url}>
          <Link href={`/posts/${post.url}`}>
            <a>
              <Heading mb="0.6rem" fontSize="22">
                {post.title}
              </Heading>
            </a>
          </Link>

          <Text mb="0.6rem" color="gray.600">
            {post.desc}
          </Text>

          <Flex alignItems="center" fontSize="13" color="gray.500">
            <Flex alignItems="center" mr="1rem">
              <Icon as={FiCalendar} mr="0.5rem" />
              <Date dateString={post.date} />
            </Flex>
          </Flex>
        </Box>
      </Box>
    </>
  );
};

export default PostCard;
