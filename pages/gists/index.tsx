import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { GetGists, getGists, GetUser, getUser } from 'lib/fetcher';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import dynamic from 'next/dynamic';
import { ReactElement } from 'react';

const MainLayout = dynamic(() => import('layouts/MainLayout'));
const UserInfo = dynamic(() => import('components/gists/UserInfo'));
const FileContent = dynamic(() => import('components/gists/FileContent'));
const Pagination = dynamic(() => import('components/RUA/RUAPagination'));

dayjs.extend(relativeTime);

const Gists = ({
  gists,
  user,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const prev = Number(gists.pageSize.prev);
  const next = Number(gists.pageSize.next);
  const total = Number(gists.pageSize.last);

  return (
    <>
      <main className="max-w-5xl px-4 mx-auto lg:px-0">
        <div className="md:flex">
          <UserInfo user={user} />

          <div className="flex-1 py-4 overflow-hidden md:pl-8">
            <FileContent gists={gists.gists} />
            <Pagination
              hasPrev={!!prev}
              hasNext={!!next}
              prevLink={prev === 1 ? `/gists/` : `/gists/${prev}`}
              nextLink={`/gists/${next}`}
              current={prev == null ? next - 1 : prev + 1}
              total={total}
            />
          </div>
        </div>
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps<{
  gists: GetGists;
  user: GetUser;
}> = async () => {
  const result = await getGists();
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
