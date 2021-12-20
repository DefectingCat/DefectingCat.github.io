import { FC, MouseEvent, useEffect } from 'react';
import { setFromPath } from 'features/router/routerSlice';
import useGetColors from 'lib/hooks/useGetColors';
import { useRouter } from 'next/router';
import { useAppDispatch } from 'app/hooks';
import { Box, Heading, Link } from '@chakra-ui/react';
import type { PostHits } from 'components/search/CustomHits';
import dynamic from 'next/dynamic';
import useIntersection from 'lib/hooks/useIntersection';

const CustomHighlight = dynamic(() => import('./CustomHighlight'));

interface Props {
  hit: PostHits;
}

const HitCard: FC<Props> = ({ hit }) => {
  const { url } = hit;
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { boxBg, headingColor } = useGetColors();

  const { targetRef, inView } = useIntersection();

  const goToPost = (
    e: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>,
    url: string
  ) => {
    e.preventDefault();
    dispatch(setFromPath(location.pathname));
    router.push(`/p/${url}`);
  };

  useEffect(() => {
    inView && router.prefetch(`/p/${url}`);
  }, [url, inView, router]);

  return (
    <>
      <Box
        as="article"
        borderRadius="10px"
        bg={boxBg}
        overflow="hidden"
        boxShadow="card"
        mt="1rem"
        p="1rem"
        ref={targetRef}
      >
        <Link
          href={`/p/${url}`}
          onClick={(e) => goToPost(e, url)}
          _focus={{ boxShadow: 'unset' }}
        >
          <Heading color={headingColor} mb="0.6rem" size="md">
            <CustomHighlight attribute="title" hit={hit} />
          </Heading>

          <Box>
            <CustomHighlight attribute="desc" hit={hit} />
          </Box>
        </Link>
      </Box>
    </>
  );
};

export default HitCard;
