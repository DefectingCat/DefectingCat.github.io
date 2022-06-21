import Anchor from 'components/mdx/Anchor';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { getSignalGist } from 'lib/fetcher';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import avatar from 'public/images/img/avatar.svg';
import { ReactElement } from 'react';
import { SignalGist } from 'types';

const MainLayout = dynamic(() => import('layouts/MainLayout'));
const GistsCode = dynamic(() => import('components/gists/GistsCode'));

dayjs.extend(relativeTime);

const Gist = ({ gist }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <main className="max-w-5xl px-4 mx-auto lg:px-0">
        <div className="pb-4 text-sm">
          <div className="flex items-center py-1 ">
            <Image
              src={avatar}
              alt="Avatar"
              priority
              width={32}
              height={32}
              className="rounded-full "
            />
            <h1 className="ml-2 overflow-hidden text-xl whitespace-nowrap overflow-ellipsis">
              <Link href="/gists" passHref>
                <Anchor external={false}>{gist.owner.login}</Anchor>
              </Link>
              /{Object.keys(gist.files)[0]}
            </h1>
          </div>

          <p className="pl-10 text-gray-400 ">
            Last active: {dayjs(gist.updated_at).fromNow()}
          </p>

          <div className="py-4">
            <p className="pb-2 text-lg text-gray-500">{gist.description}</p>

            {Object.keys(gist.files).map((f) => (
              <GistsCode
                key={gist.files[f].raw_url}
                file={gist.files[f]}
                showFileName
              />
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<{
  id: string | undefined;
  gist: SignalGist;
}> = async ({ params }) => {
  if (typeof params?.id !== 'string') {
    return {
      notFound: true,
    };
  }

  const gist = await getSignalGist(params?.id);

  await Promise.all(
    Object.keys(gist.files).map(async (f) => {
      gist.files[f].content = await fetch(gist.files[f].raw_url).then((res) =>
        res.text()
      );
    })
  );

  return {
    props: {
      id: params?.id?.toString(),
      gist,
    },
    revalidate: 600,
  };
};

Gist.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Gist;
