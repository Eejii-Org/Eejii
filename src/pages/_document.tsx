import { Counter } from '@/components/render';
import { ColorSchemeScript } from '@mantine/core';
import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <ColorSchemeScript defaultColorScheme="auto" />
      </Head>
      <body className="gip">
        <Main />
        <Counter />
        <NextScript />
      </body>
    </Html>
  );
}
