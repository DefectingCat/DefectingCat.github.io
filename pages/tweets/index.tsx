import { ReactElement } from 'react';
import dynamic from 'next/dynamic';
import { PrismaClient, Tweets } from '@prisma/client';
import { InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import 'highlight.js/styles/atom-one-light.css';

const MainLayout = dynamic(() => import('layouts/MainLayout'));
const TweetCard = dynamic(() => import('components/tweets/TweetCard'));

const TweetsPage = ({
  tweets,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <Head>
        <title>RUA - Tweets</title>
      </Head>

      {tweets.length ? (
        <div id={'tweet'} className="">
          {tweets.map((tweet) => (
            <TweetCard key={tweet.id} tweet={tweet} />
          ))}
        </div>
      ) : (
        <div className="text-xl text-gray-500">Nothing here.</div>
      )}
    </>
  );
};

TweetsPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default TweetsPage;

export type TweetsWithUser = {
  createAt: string;
  Users: {
    username: string;
  };
} & Tweets;

export const getStaticProps = async () => {
  const prisma = new PrismaClient();

  const tweets = await prisma.tweets.findMany({
    select: {
      usersId: true,
      Users: { select: { username: true } },
      content: true,
      createAt: true,
      id: true,
      updateAt: true,
    },
  });

  return {
    props: {
      tweets: JSON.parse(JSON.stringify(tweets)) as TweetsWithUser[],
    },
    revalidate: 10,
  };
};
