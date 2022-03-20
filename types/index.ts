import { NextPage } from 'next';
import { ReactElement } from 'react';

export type NextPageWithLayout = {
  getLayout(page: ReactElement): JSX.Element;
} & NextPage;
