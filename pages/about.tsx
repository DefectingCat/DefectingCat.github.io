import { Box, Heading, Text, Link } from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import Head from 'next/head';
import { ReactElement } from 'react';
import HomeLayout from 'layouts/HomeLayout';
import useGetColors from 'lib/hooks/useGetColors';
import style from './about.module.css';

const about = () => {
  const { boxBg } = useGetColors();

  return (
    <>
      <Head>
        <title>RUA - About</title>
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
        <Text>
          这里是某条咸鱼利用业余时间构建的 Blog。🐟
          它称不上完美，但也还算凑合，起码能显示文字。
        </Text>
        <Heading my="0.5rem">还有什么吗？</Heading>
        <Text>
          对了，它是使用我最爱的 React Framework：
          <Link href="https://nextjs.org/" color="teal.500" isExternal>
            Next.js
            <ExternalLinkIcon mx="2px" />
          </Link>
          构建的。未来，这里会添加更多内容的。
        </Text>
      </Box>
    </>
  );
};

about.getLayout = function getLayout(page: ReactElement) {
  return <HomeLayout>{page}</HomeLayout>;
};

export default about;
