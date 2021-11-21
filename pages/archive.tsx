import { Box, Text } from '@chakra-ui/react';
import { InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import { ReactElement } from 'react';
import HomeLayout from '../layouts/HomeLayout';
import { getArchiveData, getSortedPostsData } from '../lib/posts';
import ArchiveCard from '../components/ArchiveCard';
import useGetColors from '../lib/hooks/useGetColors';
import style from './archive.module.css';

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

      <Box maxW="55rem">
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
      </Box>
    </>
  );
};

archive.getLayout = function getLayout(page: ReactElement) {
  return <HomeLayout>{page}</HomeLayout>;
};

export default archive;
