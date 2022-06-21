import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { GetGists, getGists, GetUser, getUser } from 'lib/fetcher';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import dynamic from 'next/dynamic';
import { ParsedUrlQuery } from 'querystring';
import { ReactElement } from 'react';

const MainLayout = dynamic(() => import('layouts/MainLayout'));
const UserInfo = dynamic(() => import('components/gists/UserInfo'));
const FileContent = dynamic(() => import('components/gists/FileContent'));
const Pagination = dynamic(() => import('components/gists/Pagination'));

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

          <div className="flex-1 py-4 overflow-hidden md:pl-8">
            <FileContent gists={gists.gists} />
            <Pagination pageSize={gists.pageSize} />
          </div>
        </div>
      </main>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const result = await getGists();
  const next = Number(result?.pageSize.next);
  const last = Number(result?.pageSize.last);
  const paths: (
    | string
    | {
        params: ParsedUrlQuery;
        locale?: string | undefined;
      }
  )[] = [];
  for (let i = next; i <= last; i++) {
    paths.push({
      params: {
        p: i.toString(),
      },
    });
  }

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<{
  gists: GetGists;
  user: GetUser;
}> = async ({ params }) => {
  if (typeof params?.p !== 'string')
    return {
      notFound: true,
    };

  const result = await getGists(Number(params?.p));
  if (!result)
    return {
      notFound: true,
    };

  const user = await getUser();

  return {
    props: {
      gists: result,
      user,
    },
    revalidate: 600,
  };
};

Gists.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Gists;
