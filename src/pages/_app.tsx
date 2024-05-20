import { createElement } from 'react';

function MyApp({ Component, pageProps }) {
  return createElement(Component, pageProps);
}

export default MyApp;
