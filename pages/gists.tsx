import MainLayout from 'layouts/MainLayout';
import { InferGetStaticPropsType } from 'next';
import { ReactElement } from 'react';
import { Gist, GithubUser } from 'types';
import Image from 'next/image';
import classNames from 'classnames';
import dynamic from 'next/dynamic';

const GistsCode = dynamic(() => import('components/gists/GistsCode'));

const Gists = ({
  gists,
  user,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <main className="max-w-5xl px-4 mx-auto lg:px-0">
        <div className="md:flex">
          <div className="flex items-center flex-1 max-w-[280px] md:block">
            <div
              className={classNames(
                'w-16 h-16 mr-4 overflow-hidden',
                'md:w-auto h-auto'
              )}
            >
              <Image
                src={user.avatar_url}
                alt="User Avatar"
                width={280}
                height={280}
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
                  <GistsCode key={g.files[f].raw_url} gist={g} f={f} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export const getStaticProps = async () => {
  return {
    props: {
      gists: (await fetch(
        'https://api.github.com/users/DefectingCat/gists'
      ).then((res) => res.json())) as Gist[],
      user: (await fetch('https://api.github.com/users/DefectingCat').then(
        (res) => res.json()
      )) as GithubUser,
    },
    revalidate: 60,
  };
};

Gists.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Gists;
