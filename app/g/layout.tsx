import { ReactNode } from 'react';

export const revalidate = 600;

export default async function PageLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <main className="max-w-5xl px-4 mx-auto lg:px-0">
        <div className="pb-4 text-sm">{children}</div>
      </main>
    </>
  );
}
