import { FC, MouseEventHandler, useEffect } from 'react';
import { Box, Flex, Heading, Text, Link } from '@chakra-ui/react';
import { AllPostsWithDescription } from 'lib/posts';
import { Icon, Image } from '@chakra-ui/react';
import { FiCalendar, FiTag } from 'react-icons/fi';
import { useAppDispatch } from 'app/hooks';
import { setFromPath } from 'features/router/routerSlice';
import { useRouter } from 'next/router';
import useGetColors from 'lib/hooks/useGetColors';
import dynamic from 'next/dynamic';
import useIntersection from 'lib/hooks/useIntersection';

const Date = dynamic(() => import('./DateFormater'));
const ImageSpinner = dynamic(() => import('components/ImageSpinner'));

interface Props {
  post: AllPostsWithDescription;
}

const PostCard: FC<Props> = ({ post }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { targetRef: cardRef, inView } = useIntersection();

  const { boxBg, textColor, headingColor } = useGetColors();

  const goToPost: MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.preventDefault();
    dispatch(setFromPath(location.pathname));
    router.push(`/p/${post.url}`);
  };

  useEffect(() => {
    inView && router.prefetch(`/p/${post.url}`);
  }, [post.url, inView, router]);

  return (
    <>
      <Box
        as="article"
        borderRadius="10px"
        bg={boxBg}
        overflow="hidden"
        boxShadow="card"
        mb="2.5rem"
        ref={cardRef}
      >
        {post.index_img && (
          <Link
            href={`/p/${post.url}`}
            onClick={goToPost}
            _focus={{ boxShadow: 'unset' }}
          >
            <Image
              maxH="18rem"
              h={['unset', 'unset', '18rem']}
              src={post.index_img}
              w="100%"
              fit="cover"
              alt="Post image"
              loading="lazy"
              fallback={<ImageSpinner />}
            />
          </Link>
        )}

        <Box p="1.75rem" key={post.url}>
          {/* Title */}
          <Link
            href={`/p/${post.url}`}
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
