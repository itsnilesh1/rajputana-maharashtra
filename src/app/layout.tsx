import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: {
    template: '%s | Rajputana Maharashtra',
    default: 'Rajputana Maharashtra – The Pride of Rajput Community',
  },
  description:
    'Rajputana Maharashtra is the official digital home of the Rajput community across Maharashtra, India. Connecting heritage, culture, and community.',
  keywords: ['Rajput', 'Maharashtra', 'Rajputana', 'community', 'heritage', 'culture'],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://rajputana-maharashtra.org',
    siteName: 'Rajputana Maharashtra',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Fonts loaded via link tag — works on all networks including restricted ISPs */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;800;900&family=Crimson+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-royal-black text-white font-sans antialiased">
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1A1A1F',
                color: '#F5D98A',
                border: '1px solid rgba(201, 168, 76, 0.3)',
              },
              success: { iconTheme: { primary: '#C9A84C', secondary: '#1A1A1F' } },
              error: { iconTheme: { primary: '#C41E3A', secondary: '#1A1A1F' } },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
