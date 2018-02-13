import { h, render } from 'preact';

import App from '../components/App';

const init = () => {
  console.log('external');
  renderApp();
};

const renderApp = () => {
  const container = document.querySelector('#root');
  const existing = document.querySelector('app');
  render(<App />, container, existing);
};

// if (module.hot) {
//   module.hot.dispose(renderApp);
//   module.hot.accept(renderApp);
// }

init();
