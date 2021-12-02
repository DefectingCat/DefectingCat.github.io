import { ReactElement } from 'react';
import Head from 'next/head';
import { Box, Heading } from '@chakra-ui/react';
import useGetColors from 'lib/hooks/useGetColors';
import HomeLayout from 'layouts/HomeLayout';
import style from './message.module.css';

const message = () => {
  const { boxBg } = useGetColors();

  return (
    <>
      <Head>
        <title>RUA - Message</title>
      </Head>

      <Box
        as="article"
        w={['full', 'full', '55rem']}
        borderRadius="10px"
        shadow="lg"
        overflow="hidden"
        bg={boxBg}
        p={['1rem', '1rem', '1.5rem']}
        className={style.wrapper}
      >
        <Heading my="0.5rem">Hi, there 👋</Heading>
      </Box>
    </>
  );
};

message.getLayout = function getLayout(page: ReactElement) {
  return <HomeLayout>{page}</HomeLayout>;
};

export default message;
