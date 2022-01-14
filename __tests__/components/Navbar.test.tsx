/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react';
import NavBar from 'components/NavBar';

describe('Home', () => {
  it('render to screen', () => {
    const { container } = render(<NavBar />);

    expect(container).toBeInTheDocument();
  });
});
