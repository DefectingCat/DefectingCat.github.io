import { useRouter } from 'next/router';
import { FC, useEffect } from 'react';
import { Button, Flex, Text } from '@chakra-ui/react';
import useGetColors from 'lib/hooks/useGetColors';

interface Props {
  allPages: number;
  num?: string;
}

const paging: FC<Props> = ({ allPages, num }) => {
  const router = useRouter();
  const startIndex = Number(num);

  const { textColor } = useGetColors();

  const goPrev = () => {
    startIndex == 2 ? router.push('/') : router.push(`/page/${startIndex - 1}`);
  };
  const goNext = () => {
    router.push(`/page/${startIndex + 1}`);
  };

  useEffect(() => {
    startIndex > 2
      ? router.prefetch(`/page/${startIndex - 1}`)
      : router.prefetch('/');
    startIndex != allPages
      ? router.prefetch(`/page/${startIndex + 1}`)
      : router.prefetch('/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startIndex]);

  return (
    <>
      <Flex alignItems="center">
        {startIndex > 1 && (
          <Button onClick={goPrev} mr={'auto'} size="lg">
            上一页
          </Button>
        )}

        <Text fontSize="xl" fontWeight="bold" color={textColor}>
          {num} / {allPages}
        </Text>

        {startIndex != allPages && (
          <Button onClick={goNext} ml={'auto'} size="lg">
            下一页
          </Button>
        )}
      </Flex>
    </>
  );
};

export default paging;
