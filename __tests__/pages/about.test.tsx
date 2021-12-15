/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import About from 'pages/about';

describe('Home', () => {
  it('renders a heading', () => {
    render(<About />);

    const heading = screen.getByRole('heading', {
      name: /Hi, there 👋/i,
    });

    expect(heading).toBeInTheDocument();
  });
});
