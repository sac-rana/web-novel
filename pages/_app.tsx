import '../styles/globals.css';
import 'react-tabs/style/react-tabs.scss';

import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
export default MyApp;
