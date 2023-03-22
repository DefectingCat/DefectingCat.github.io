import { getGists } from 'lib/fetcher';
import { notFound } from 'next/navigation';
import UserInfo from './user-info';
import { Suspense } from 'react';
import Pagination from 'components/rua/rua-pagination';
import FileContent from './file-content';
import UserInfoLoading from './user-info-skeleton';
import { Metadata } from 'next';

export const revalidate = 600;
export const metadata: Metadata = {
  title: 'RUA - Gists',
};

export default async function Page() {
  const gists = await getGists();
  if (!gists) notFound();

  const prev = Number(gists.pageSize.prev);
  const next = Number(gists.pageSize.next);
  const total = Number(gists.pageSize.last);

  return (
    <>
      <main className="max-w-5xl px-4 mx-auto lg:px-0">
        <div className="md:flex">
          <Suspense fallback={<UserInfoLoading />}>
            {/* @ts-expect-error Async Server Component */}
            <UserInfo />
          </Suspense>

          <div className="flex-1 px-1 py-4 overflow-hidden md:pl-8">
            <FileContent gists={gists.gists} />
            <Pagination
              className="mt-4"
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
}
