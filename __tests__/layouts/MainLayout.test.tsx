/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react';
import MainLayout from 'layouts/MainLayout';

describe('Home', () => {
  it('render grid layout', () => {
    const { container } = render(<MainLayout />);

    const styles = getComputedStyle(container.firstChild as HTMLElement);

    expect(styles.display).toBe('grid');
  });
  it('render on mbile', () => {
    window.matchMedia = jest.fn().mockImplementation((query) => {
      return {
        matches:
          query === '(min-width: 240px) and (max-width: 767px)' ? false : true,
        media: '',
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
      };
    });

    const { container } = render(<MainLayout />);
    const element = document.querySelector('.container');
    const styles = getComputedStyle(element!);
    expect(element).toBeInTheDocument();
    expect(styles.display).toBe('grid');
  });
});
