import { Box } from '@chakra-ui/react';
import Head from 'next/head';
import { ReactElement } from 'react';
import HomeLayout from '../layouts/HomeLayout';

const about = () => {
  return (
    <>
      <Head>
        <title>RUA - About</title>
      </Head>

      <Box
        w={['full', 'full', '55rem']}
        borderRadius="10px"
        shadow="lg"
        bg="white"
        overflow="hidden"
        p={['1rem', '1rem', '1.5rem']}
      >
        施工中...
      </Box>
    </>
  );
};

about.getLayout = function getLayout(page: ReactElement) {
  return <HomeLayout>{page}</HomeLayout>;
};

export default about;
