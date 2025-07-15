'use client';

import { AuthProvider } from './context/AuthContext';
import { UnreadProvider } from './context/UnreadContext';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="h-full">
      <body >
        <AuthProvider>
          <UnreadProvider>
            {children}
          </UnreadProvider>
        </AuthProvider>

      </body>
    </html>
  );
}