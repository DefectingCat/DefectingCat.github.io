import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Blog from 'pages/blog';

const posts = [
  {
    slug: 'first-post',
    title: 'First post test',
    date: '2022-03-22',
    tags: ['functions', 'javascript'],
  },
];

describe('NavBar', () => {
  it('renders blog title', async () => {
    render(<Blog posts={[]} />);

    const heading = await screen.findByText(/Blog posts/i);

    expect(heading).toBeInTheDocument();
  });
});
