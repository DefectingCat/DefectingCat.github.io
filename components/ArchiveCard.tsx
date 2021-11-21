import { Box, Flex, Heading, Image, Link } from '@chakra-ui/react';
import { FC, MouseEventHandler } from 'react';
import { AllPostsData } from '../lib/posts';
import Date from './DateFormater';
import { useDispatch } from 'react-redux';
import { setFromPath } from '../features/router/routerSlice';
import { useRouter } from 'next/router';
import useGetColors from '../lib/hooks/useGetColors';

interface Props {
  post: AllPostsData;
}

const ArchiveCard: FC<Props> = ({ post }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { borderColor, headingColor } = useGetColors();

  const goToPost: MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.preventDefault();
    dispatch(setFromPath(location.pathname));
    router.push(`/posts/${post.url}`);
  };

  return (
    <>
      <Box
        as="article"
        w={['full', 'full', '55rem']}
        borderBottom="1px"
        borderColor={borderColor}
      >
        <Link
          href={`/posts/${post.url}`}
          onClick={goToPost}
          _focus={{ boxShadow: 'unset' }}
        >
          <Flex
            p="1.25rem"
            key={post.url}
            cursor="pointer"
            justifyContent="space-between"
          >
            <Box>
              <Heading mb="0.6rem" fontSize="lg" color={headingColor}>
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
