import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import './globals.css'
import Head from 'next/head';
const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Home | Kovai Guppies',
  description: 'Welcome to Kovai Guppies – best guppies and mollies online.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
        <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className={roboto.className}>{children}</body>
    </html>
  )
}
