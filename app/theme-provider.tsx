'use client';

import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';

export default function RUAThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      storageKey="rua-theme"
      themes={['light', 'dark']}
      enableSystem
      defaultTheme="system"
    >
      {children}
    </ThemeProvider>
  );
}