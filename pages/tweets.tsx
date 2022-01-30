import { ReactElement, useState } from 'react';
import dynamic from 'next/dynamic';
import { PrismaClient } from '@prisma/client';
import { InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import cn from 'classnames';

const MainLayout = dynamic(() => import('layouts/MainLayout'));
const Button = dynamic(() => import('components/RUA/RUAButton'));
const Input = dynamic(() => import('components/RUA/RUAInput'));

const Tweets = ({ tweets }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [showInput, setShowInput] = useState(false);
  const [showOverFlow, setShowOverFlow] = useState(true);
  const handleLoginClick = () => {
    if (!showInput) {
      setShowInput(true);
      setTimeout(() => {
        setShowOverFlow(false);
      }, 299);
    } else {
      // handle login
    }
  };

  return (
    <>
      <Head>
        <title>RUA - Tweets</title>
      </Head>

      <div>
        <div className={cn('')}>
          <div
            className={cn(
              'flex flex-col mb-4',
              'text-sm md:w-1/2 transition-all',
              'max-h-0 duration-300',
              { 'overflow-hidden': showOverFlow },
              { 'max-h-32': showInput }
            )}
          >
            <Input placeholder="Username" className="py-3 mb-4" />
            <Input placeholder="Password" className="py-3" type="password" />
          </div>
          <Button className="px-5 py-2" onClick={handleLoginClick}>
            Login{showInput ? '🚀' : '🤔'}
          </Button>
        </div>
      </div>
    </>
  );
};

Tweets.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Tweets;

export const getStaticProps = async () => {
  const prisma = new PrismaClient();

  const tweets = await prisma.tweets.findMany();

  return {
    props: {
      tweets,
    },
    revalidate: 10,
  };
};
