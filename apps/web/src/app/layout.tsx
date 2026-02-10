import { RootProvider } from 'fumadocs-ui/provider/next';
import type { Metadata } from 'next';
import { Providers } from '../providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Reserve - Ethical Booking Assistant',
  description: 'Help fight reservation bots by securing your own booking slots',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <RootProvider>
          <Providers>{children}</Providers>
        </RootProvider>
      </body>
    </html>
  );
}
