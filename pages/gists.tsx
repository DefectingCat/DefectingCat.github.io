import MainLayout from 'layouts/MainLayout';
import { InferGetStaticPropsType } from 'next';
import { ReactElement } from 'react';
import { Gist, GithubUser } from 'types';
import Image from 'next/image';
import classNames from 'classnames';

const Gists = ({
  gists,
  user,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <main className="max-w-5xl px-4 mx-auto lg:px-0">
        <div className="md:flex">
          <div className="flex items-center md:block">
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

          <div className="py-4 md:pl-8">
            {gists.map((g) => (
              <div key={g.id}>
                {Object.keys(g.files).map((f) => {
                  const file = g.files;
                  return (
                    <div key={file[f].raw_url} className="py-4 text-sm">
                      <h1 className="md:text-lg">
                        {g.owner.login} / {file[f].filename}
                      </h1>
                      <p className="text-gray-400">Update at: {g.updated_at}</p>
                      <p className="text-gray-500">{g.description}</p>
                    </div>
                  );
                })}
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
