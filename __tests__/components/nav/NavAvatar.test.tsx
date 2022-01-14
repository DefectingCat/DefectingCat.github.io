/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react';
import NavAvatar from 'components/nav/NavAvatar';

describe('Home', () => {
  it('render to screen', () => {
    const { container } = render(<NavAvatar />);

    const name = screen.getByText(/肥羊/i);

    expect(container).toBeInTheDocument();
    expect(name).toBeInTheDocument();
  });
});
