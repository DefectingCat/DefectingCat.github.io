/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import BackToTop from 'components/BackToTop';

describe('Back to top', () => {
  it('should render', () => {
    const { container, rerender } = render(
      <BackToTop showBacktop={false} backToTop={() => {}} />
    );

    expect(container).toBeInTheDocument();
  });
});
