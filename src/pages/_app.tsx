import '@/styles/globals.css';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/carousel/styles.css';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';

import { MantineProvider, createTheme } from '@mantine/core';

import type { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';

import { api } from '@/utils/api';

interface CustomAppProps extends AppProps {
  pageProps: {
    session?: Session;
  } & AppProps['pageProps'];
}

const theme = createTheme({
  fontFamily: "'Poppins', sans-serif",
  colors: {
    primary: [
      '#EAFAFC',
      '#DEF0F1',
      '#BDDEE0',
      '#99CDD0',
      '#7CBEC1',
      '#68B4B8',
      '#5CAFB4',
      '#4A999E',
      '#3C898D',
      '#26777B',
    ],
    secondary: [
      '#fff5e3',
      '#fdebd0',
      '#f7d5a4',
      '#f1be73',
      '#ecaa4a',
      '#e99e30',
      '#e89720',
      '#ce8312',
      '#b8730a',
      '#a06300',
    ],
    neutral: [
      '#D1D5DB',
      '#D1D5DB',
      '#D1D5DB',
      '#D1D5DB',
      '#101827',
      '#1F2937',
      '#374151',
      '#4B5563',
      '#6B7280',
      '#9CA3AF',
    ],
  },
});

const CustomApp = ({ Component, pageProps }: CustomAppProps) => {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <Notifications />
      <SessionProvider session={pageProps.session}>
        <Component {...pageProps} />
      </SessionProvider>
    </MantineProvider>
  );
};

export default api.withTRPC(CustomApp);
