import { FC, MouseEventHandler } from 'react';
import Date from './DateFormater';
import { Box, Flex, Heading, Text, Link } from '@chakra-ui/react';
import { AllPostsData } from '../lib/posts';
import { Icon, Image } from '@chakra-ui/react';
import { FiCalendar, FiTag } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { setFromPath } from '../features/router/routerSlice';
import { useRouter } from 'next/router';
import useGetColors from '../lib/hooks/useGetColors';

interface Props {
  post: AllPostsData;
}

const PostCard: FC<Props> = ({ post }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const goToPost: MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.preventDefault();
    dispatch(setFromPath(location.pathname));
    router.push(`/posts/${post.url}`);
  };

  const { boxBg, textColor, headingColor } = useGetColors();

  return (
    <>
      <Box
        as="article"
        maxW={['full', 'full', '55rem']}
        borderRadius="10px"
        bg={boxBg}
        overflow="hidden"
        boxShadow="card"
        mb="2.5rem"
      >
        <Link
          href={`/posts/${post.url}`}
          onClick={goToPost}
          _focus={{ boxShadow: 'unset' }}
        >
          <Image
            src={post.index_img}
            maxH="18rem"
            w="100%"
            fallback={<></>}
            fit="cover"
            alt="Post image"
          />
        </Link>

        <Box p="1.75rem" key={post.url}>
          {/* Title */}
          <Link
            href={`/posts/${post.url}`}
            onClick={goToPost}
            _focus={{ boxShadow: 'unset' }}
          >
            <Heading color={headingColor} mb="0.6rem" fontSize="22">
              {post.title}
            </Heading>
          </Link>

          {/* Description */}
          <Text mb="0.6rem" color={textColor}>
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
                post.tags && (
                  <Flex alignItems="center" mr="1rem">
                    <Icon as={FiTag} mr="0.5rem" />
                    <Text>{post.tags}</Text>
                  </Flex>
                )
              )}
            </Flex>
          </Flex>
        </Box>
      </Box>
    </>
  );
};

export default PostCard;
