import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { getGists, getUser } from 'lib/fetcher';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import dynamic from 'next/dynamic';
import { ReactElement } from 'react';
import { Gist, GithubUser } from 'types';

const MainLayout = dynamic(() => import('layouts/MainLayout'));
const UserInfo = dynamic(() => import('components/gists/UserInfo'));
const FileContent = dynamic(() => import('components/gists/FileContent'));

dayjs.extend(relativeTime);

const Gists = ({
  gists,
  user,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <main className="max-w-5xl px-4 mx-auto lg:px-0">
        <div className="md:flex">
          <UserInfo user={user} />

          <FileContent gists={gists} />
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
  gists: Gist[];
  user: GithubUser;
}> = async ({ params }) => {
  if (typeof params?.p !== 'string') {
    return {
      notFound: true,
    };
  }

  const gists = await getGists(Number(params?.p));
  const user = await getUser();

  await Promise.all(
    gists.map(async (g) => {
      await Promise.all(
        Object.keys(g.files).map(async (f) => {
          g.files[f].content = await fetch(g.files[f].raw_url).then((res) =>
            res.text()
          );
        })
      );
    })
  );

  return {
    props: {
      gists,
      user,
    },
    revalidate: 600,
  };
};

Gists.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Gists;
