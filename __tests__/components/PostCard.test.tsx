import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PostCard from 'components/PostCard';

const post = {
  slug: 'first-post',
  title: 'First post test',
  date: '2022-03-22',
  tags: ['functions', 'javascript'],
};

describe('NavBar', () => {
  it('render posts', () => {
    render(<PostCard post={post} />);

    expect(screen.getByText(/First post test/i)).toBeInTheDocument();
  });
  it('render tags', () => {
    render(<PostCard post={post} />);

    expect(screen.getByText(/JavaScript/i)).toBeInTheDocument();
  });
  it('renders links', () => {
    render(<PostCard post={post} />);

    const link = screen.getByRole('link', { name: /First post test/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/p/first-post');
  });
});
