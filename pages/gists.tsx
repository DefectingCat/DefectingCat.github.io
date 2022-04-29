import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { ReactElement } from 'react';
import { Gist, GithubUser } from 'types';
import Image from 'next/image';
import classNames from 'classnames';
import dynamic from 'next/dynamic';
import avatar from 'public/images/img/avatar.svg';
import Link from 'next/link';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

const Loading = dynamic(() => import('components/RUA/loading/RUALoading'));
const MainLayout = dynamic(() => import('layouts/MainLayout'));
const GistsCode = dynamic(() => import('components/gists/GistsCode'), {
  loading: () => <Loading />,
});
const Anchor = dynamic(() => import('components/mdx/Anchor'));

dayjs.extend(relativeTime);

const Gists = ({
  gists,
  user,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <main className="max-w-5xl px-4 mx-auto lg:px-0">
        <div className="md:flex">
          <div
            className={classNames(
              'flex items-center flex-1',
              'max-w-[280px] md:block',
              'mb-4'
            )}
          >
            <div
              className={classNames(
                'w-16 h-16 mr-4 overflow-hidden',
                'md:w-auto h-auto'
              )}
            >
              <Image
                src={avatar}
                alt="Avatar"
                priority
                className="rounded-full"
              />
            </div>

            <div>
              <h1 className="text-xl font-bold font-Barlow md:text-2xl">
                {user.name}
              </h1>

              <h2 className="text-xl text-gray-400 font-Barlow md:text-2xl">
                {user.login}
              </h2>
            </div>
          </div>

          <div className="flex-1 py-4 overflow-hidden md:pl-8">
            {gists.map((g) => (
              <div key={g.id}>
                {Object.keys(g.files).map((f) => (
                  <div key={g.files[f].raw_url} className="pb-4 ">
                    <h1 className="md:text-lg">
                      {g.owner.login} /
                      <Link href={`/g/${g.id}`} passHref>
                        <Anchor external={false}>{g.files[f].filename}</Anchor>
                      </Link>
                    </h1>
                    <p className="text-gray-400">
                      Last active: {dayjs(g.updated_at).fromNow()}
                    </p>
                    <p className="text-gray-500">{g.description}</p>

                    <GistsCode file={g.files[f]} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps<{
  gists: Gist[];
  user: GithubUser;
}> = async () => {
  const gists = (await fetch(
    'https://api.github.com/users/DefectingCat/gists'
  ).then((res) => res.json())) as Gist[];
  const user = await fetch('https://api.github.com/users/DefectingCat').then(
    (res) => res.json()
  );

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
