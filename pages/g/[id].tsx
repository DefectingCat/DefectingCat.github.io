import { GetStaticProps, InferGetStaticPropsType, GetStaticPaths } from 'next';
import dynamic from 'next/dynamic';
import { ReactElement } from 'react';
import { SignalGist } from 'types';
import avatar from 'public/images/img/avatar.svg';
import Image from 'next/image';
import styles from './styles.module.css';
import classNames from 'classnames';

const MainLayout = dynamic(() => import('layouts/MainLayout'));
const GistsCode = dynamic(() => import('components/gists/GistsCode'));

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
          <p className="pl-10 text-gray-400 ">Last active: {gist.updated_at}</p>

          <div className="py-4">
            <p className="pb-2 text-lg text-gray-500">{gist.description}</p>

            {Object.keys(gist.files).map((f) => (
              <div key={gist.files[f].raw_url} className={styles.wrapper}>
                <div className="h-[30px] bg-[#f6f8fa] dark:bg-[hsl(220,13%,18%)] flex">
                  <div className="flex items-center h-full mx-3">
                    <div
                      className={classNames(
                        'box-border inline-block',
                        'w-[13px] h-[13px] mr-2',
                        'rounded-full bg-[#ce5347]'
                      )}
                    ></div>
                    <div
                      className={classNames(
                        'box-border inline-block',
                        'w-[13px] h-[13px] mr-2',
                        'rounded-full bg-[#d6a243]'
                      )}
                    ></div>
                    <div
                      className={classNames(
                        'box-border inline-block',
                        'w-[13px] h-[13px]',
                        'rounded-full bg-[#58a942]'
                      )}
                    ></div>
                  </div>

                  <div
                    className={classNames(
                      'px-4 bg-white',
                      'leading-[30px]',
                      'dark:bg-[hsl(220,13%,18%)] dark:border-b dark:border-b-[rgb(128,203,196)]'
                    )}
                  >
                    {gist.files[f].filename}
                  </div>
                </div>

                <GistsCode file={gist.files[f]} />
              </div>
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
