/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react';
import NavMenuItem from 'components/nav/NavMenuItem';
import { menus } from 'components/NavBar';

describe('Home', () => {
  it('render to screen', () => {
    const { container } = render(
      <>
        {menus.map((menu) => (
          <NavMenuItem key={menu.id} menuItem={menu} onClick={() => {}} />
        ))}
      </>
    );

    menus.map((menu) => {
      const signalMenu = screen.getByText(menu.name);
      expect(signalMenu).toBeInTheDocument();
    });

    expect(container).toBeInTheDocument();
  });
});
