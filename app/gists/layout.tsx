import { Metadata } from 'next';
import { ReactNode, Suspense } from 'react';
import UserInfo from './user-info';
import UserInfoLoading from './user-info-skeleton';

export const revalidate = 600;
export const metadata: Metadata = {
  title: 'RUA - Gists',
};

export default async function PageLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <main className="max-w-5xl px-4 mx-auto lg:px-0">
        <div className="md:flex">
          <Suspense fallback={<UserInfoLoading />}>
            {/* @ts-expect-error Async Server Component */}
            <UserInfo />
          </Suspense>

          <div className="flex-1 px-1 py-4 overflow-hidden md:pl-8">
            {children}
          </div>
        </div>
      </main>
    </>
  );
}