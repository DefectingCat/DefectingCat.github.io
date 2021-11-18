import { FC } from 'react';
import Link from 'next/link';
import Date from './DateFormater';
import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { AllPostsData } from '../lib/posts';
import { Icon, Image } from '@chakra-ui/react';
import { FiCalendar, FiTag } from 'react-icons/fi';

interface Props {
  post: AllPostsData;
}

const PostCard: FC<Props> = ({ post }) => {
  return (
    <>
      <Box
        as="article"
        maxW={['full', 'full', '55rem']}
        borderRadius="10px"
        bg="white"
        overflow="hidden"
        boxShadow="card"
        mb="2.5rem"
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

        <Box p="1.75rem" key={post.url}>
          {/* Title */}
          <Link href={`/posts/${post.url}`}>
            <a>
              <Heading mb="0.6rem" fontSize="22">
                {post.title}
              </Heading>
            </a>
          </Link>

          {/* Description */}
          <Text mb="0.6rem" color="gray.600">
            {post.desc}
          </Text>

          <Flex alignItems="center" fontSize="13" color="gray.500">
            {/* Date */}
            <Flex alignItems="center" mr="1rem">
              <Icon as={FiCalendar} mr="0.5rem" />
              <Date dateString={post.date} />
            </Flex>

            {/* Tags */}
            <Flex alignItems="center" mr="1rem">
              {Array.isArray(post.tags) ? (
                // Mutil tags
                <Flex alignItems="center" mr="1rem">
                  <Icon as={FiTag} mr="0.5rem" />
                  {post.tags.map((item) => {
                    return (
                      <Text key={item} mr="0.5rem">
                        {item}
                      </Text>
                    );
                  })}
                </Flex>
              ) : (
                // Signal tags
                <Flex alignItems="center" mr="1rem">
                  <Icon as={FiTag} mr="0.5rem" />
                  <Text>{post.tags}</Text>
                </Flex>
              )}
            </Flex>
          </Flex>
        </Box>
      </Box>
    </>
  );
};

export default PostCard;
