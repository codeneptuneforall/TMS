import type { Metadata } from 'next';
import '../src/index.css';
import { AppStateProvider } from '@/contexts/AppStateContext';
import { Toaster } from 'sonner';

export const metadata: Metadata = { title: 'Premium Ticket Management System' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppStateProvider role="agent" density="comfortable" simulateErrors={false}>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 3200,
              className: 'font-sans',
              style: { borderRadius: 8, border: '1px solid rgb(var(--line))', fontSize: 13, boxShadow: '0 12px 32px -8px rgb(24 24 27 / 0.18)' }
            }} />
        </AppStateProvider>
      </body>
    </html>
  );
}

