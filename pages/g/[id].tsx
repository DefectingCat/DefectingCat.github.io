import LinkAnchor from 'components/mdx/LinkAnchor';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import MainLayout from 'layouts/MainLayout';
import { getGists, getSignalGist, SingalGist } from 'lib/fetcher';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import avatar from 'public/images/img/avatar.svg';
import { ParsedUrlQuery } from 'querystring';
import { Fragment, ReactElement, Suspense } from 'react';

const GistsCode = dynamic(() => import('components/gists/GistsCode'), {
  suspense: true,
});

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
              <Link href="/gists">
                <LinkAnchor external={false}>{gist.login}</LinkAnchor>
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
              <Fragment key={gist.files[f].raw_url}>
                <Suspense fallback>
                  <GistsCode file={gist.files[f]} showFileName />
                </Suspense>
              </Fragment>
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const result = await getGists();
  const last = Number(result?.pageSize.last);
  const paths: (
    | string
    | {
        params: ParsedUrlQuery;
        locale?: string | undefined;
      }
  )[] = [];
  for (let i = 1; i <= last; i++) {
    const result = await getGists(i);
    paths.push(...(result?.gists.map((g) => ({ params: { id: g.id } })) ?? []));
  }

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<{
  id: string | undefined;
  gist: SingalGist;
}> = async ({ params }) => {
  if (typeof params?.id !== 'string')
    return {
      notFound: true,
    };

  try {
    const gist = await getSignalGist(params.id);
    if (!gist || !gist.files)
      return {
        notFound: true,
      };
    return {
      props: {
        id: params?.id?.toString(),
        gist,
      },
      revalidate: 600,
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};

Gist.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Gist;