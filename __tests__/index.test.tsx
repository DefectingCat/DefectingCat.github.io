/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import Index from 'pages/index';

const postData = {
  totalNum: 10,
  pagingSize: 10,
  allPages: 10,
  postDatas: [
    {
      id: 'test',
      desc: 'test',
      title: 'test',
      date: '2021-12-15T13:27:35.555Z',
      tags: 'test',
      categories: 'test',
      url: 'test',
      index_img: 'test',
    },
  ],
};

describe('Home', () => {
  it('renders a heading', () => {
    render(<Index {...postData} />);

    const heading = screen.getAllByRole('article', {
      name: /Hi, there 👋/i,
    });

    expect(heading).toBeInTheDocument();
  });
});
