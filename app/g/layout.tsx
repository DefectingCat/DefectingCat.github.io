import { ReactNode } from 'react';

export const revalidate = 600;

export default async function PageLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
