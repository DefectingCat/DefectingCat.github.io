import { render, screen } from '@testing-library/react';
import NavBar from 'components/nav-bar';
import '@testing-library/jest-dom';

describe('NavBar', () => {
  it('renders a title', async () => {
    render(<NavBar />);

    const heading = await screen.findByText(/RUA!/i);

    expect(heading).toBeInTheDocument();
  });
  it('renders menu items', async () => {
    render(<NavBar />);

    const home = await screen.findByText(/Home/i);
    const blog = await screen.findByText(/Blog/i);

    expect(home).toBeInTheDocument();
    expect(blog).toBeInTheDocument();

    expect(home).toHaveAttribute('href', '/');
    expect(blog).toHaveAttribute('href', '/blog');
  });
});
