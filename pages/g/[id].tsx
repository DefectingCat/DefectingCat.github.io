import { GetStaticProps, InferGetStaticPropsType, GetStaticPaths } from 'next';
import dynamic from 'next/dynamic';
import { ReactElement } from 'react';
import { SignalGist } from 'types';
import avatar from 'public/images/img/avatar.svg';
import Image from 'next/image';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

const MainLayout = dynamic(() => import('layouts/MainLayout'));
const GistsCode = dynamic(() => import('components/gists/GistsCode'));

dayjs.extend(relativeTime);

const Gist = ({ gist }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <main className="max-w-5xl px-4 mx-auto lg:px-0">
        <div className={'pb-4 text-sm'}>
          <div className="flex items-center py-1 ">
            <Image
              src={avatar}
              alt="Avatar"
              priority
              width={32}
              height={32}
              className="rounded-full "
            />
            <h1 className="ml-2 text-xl">
              {gist.owner.login} /{Object.keys(gist.files)[0]}
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
  const gist = (await fetch(`https://api.github.com/gists/${params?.id}`).then(
    (res) => res.json()
  )) as SignalGist;

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
