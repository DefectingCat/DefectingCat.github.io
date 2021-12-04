import { FC, MouseEvent, useEffect } from 'react';
import { setFromPath } from 'features/router/routerSlice';
import useGetColors from 'lib/hooks/useGetColors';
import { useRouter } from 'next/router';
import { useAppDispatch } from 'app/hooks';
import { Box, Heading, Link } from '@chakra-ui/react';
import type { PostHits } from 'components/search/CustomHits';
import dynamic from 'next/dynamic';

const CustomHighlight = dynamic(() => import('./CustomHighlight'));

interface Props {
  hit: PostHits;
}

const HitCard: FC<Props> = ({ hit }) => {
  const { url } = hit;
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { boxBg, headingColor } = useGetColors();

  const goToPost = (
    e: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>,
    url: string
  ) => {
    e.preventDefault();
    dispatch(setFromPath(location.pathname));
    router.push(`/p/${url}`);
  };

  useEffect(() => {
    router.prefetch(`/p/${url}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return (
    <>
      <Box
        as="article"
        borderRadius="10px"
        bg={boxBg}
        overflow="hidden"
        boxShadow="card"
        mb="1rem"
        p="1rem"
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
