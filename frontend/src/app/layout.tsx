
import { ChakraProvider } from '@chakra-ui/react';

export const metadata = {
  title: ' Portfolio  |  Mai Shimizu',
  description: 'My awesome portfolio',
  icons: { icon: '/FaviconLogo.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <ChakraProvider>
          {/* 画面端の貼り付き防止（スマホで効く） */}
          <div style={{ minHeight: '100dvh' }}>{children}</div>
        </ChakraProvider>
      </body>
    </html>
  );
}
