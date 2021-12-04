import {
  Box,
  Flex,
  Heading,
  Image,
  LinkOverlay,
  LinkBox,
} from '@chakra-ui/react';
import { FC, MouseEventHandler, useEffect } from 'react';
import { AllPostsData } from 'lib/posts';
import { useDispatch } from 'react-redux';
import { setFromPath } from 'features/router/routerSlice';
import { useRouter } from 'next/router';
import useGetColors from 'lib/hooks/useGetColors';
import useLazyLoad from 'lib/hooks/useLazyload';
import dynamic from 'next/dynamic';
import useIntersection from 'lib/hooks/useIntersection';

const Date = dynamic(() => import('./DateFormater'));

interface Props {
  post: AllPostsData;
}

const ArchiveCard: FC<Props> = ({ post }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { initSrc, blur, targetRef } = useLazyLoad(post.index_img);
  const { targetRef: cardRef, intersect } = useIntersection();

  const { borderColor, headingColor } = useGetColors();

  const goToPost: MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.preventDefault();
    dispatch(setFromPath(location.pathname));
    router.push(`/p/${post.url}`);
  };

  useEffect(() => {
    intersect && router.prefetch(`/p/${post.url}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post.url, intersect]);

  return (
    <>
      <LinkBox as="article" borderBottom="1px" borderColor={borderColor}>
        <Flex
          p="1.25rem"
          key={post.url}
          cursor="pointer"
          justifyContent="space-between"
          ref={cardRef}
        >
          <Box>
            <LinkOverlay
              href={`/p/${post.url}`}
              onClick={goToPost}
              _focus={{ boxShadow: 'unset' }}
            >
              <Heading mb="0.6rem" fontSize="lg" color={headingColor}>
                {post.title}
              </Heading>
            </LinkOverlay>

            <Date dateString={post.date} />
          </Box>

          {post.index_img && (
            <Image
              ref={targetRef}
              transitionDuration="slower"
              filter={blur}
              src={initSrc}
              alt="Post image"
              w="50px"
              h="50px"
              objectFit="cover"
              rounded="lg"
            />
          )}
        </Flex>
      </LinkBox>
    </>
  );
};

export default ArchiveCard;
