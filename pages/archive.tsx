import { ReactElement } from 'react';
import { InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { Box, Text, Flex } from '@chakra-ui/react';
import { getArchiveData, getSortedPostsData } from 'lib/posts';
import useGetColors from 'lib/hooks/useGetColors';
import style from './archive.module.css';
import HomeLayout from 'layouts/HomeLayout';

const ArchiveCard = dynamic(() => import('components/ArchiveCard'));

export const getStaticProps = async () => {
  const allPostsData = await getSortedPostsData();

  return {
    props: {
      ...getArchiveData(allPostsData),
    },
  };
};

const archive = ({
  archiveData,
  archiveKeys,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { boxBg } = useGetColors();

  return (
    <>
      <Head>
        <title>RUA - Archive</title>
      </Head>

      <Flex flexFlow="column">
        {archiveKeys.map((year) => (
          <Box mb="2rem" key={year}>
            <Text fontSize="2xl" color="gray.400" fontWeight="bold">
              {year}
            </Text>
            <Box
              borderRadius="10px"
              bg={boxBg}
              overflow="hidden"
              boxShadow="card"
              mt="0.5rem"
              className={style['archive-wrapper']}
            >
              {archiveData[year].map((post) => (
                <ArchiveCard post={post} key={post.id} />
              ))}
            </Box>
          </Box>
        ))}
      </Flex>
    </>
  );
};

archive.getLayout = function getLayout(page: ReactElement) {
  return <HomeLayout>{page}</HomeLayout>;
};

export default archive;
