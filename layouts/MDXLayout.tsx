import { FC } from 'react';
import Head from 'next/head';
import HomeLayout from 'layouts/HomeLayout';
import useGetColors from 'lib/hooks/useGetColors';
import { Box } from '@chakra-ui/react';

interface Props {
  title: string;
}

const MDXLayout: FC<Props> = ({ title, children }) => {
  const { boxBg } = useGetColors();

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <HomeLayout>
        <Box
          as="article"
          w={['full', 'full', '55rem']}
          borderRadius="10px"
          shadow="lg"
          overflow="hidden"
          bg={boxBg}
          p={['1rem', '1rem', '1.5rem']}
        >
          {children}
        </Box>
      </HomeLayout>
    </>
  );
};

export default MDXLayout;
