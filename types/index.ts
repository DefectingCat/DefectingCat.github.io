import { NextPage } from 'next';
import { AppProps } from 'next/app';
import { ReactElement } from 'react';

export type NextPageWithLayout = {
  getLayout(page: ReactElement): JSX.Element;
} & NextPage;

export type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export interface MyMatters {
  title: string;
  date: string;
  tags: string;
}

export interface Post extends MyMatters {
  slug: string;
}
