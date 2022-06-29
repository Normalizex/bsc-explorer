import React from 'react';
import { Notify } from 'notiflix';
import { Provider } from 'react-redux';
import { createRoot } from 'react-dom/client';

import App from './App';

import { store } from './store';
import reportWebVitals from './reportWebVitals';

import './styles/grid.scss';
import './styles/theme.scss';
import './styles/index.scss';

const container = document.getElementById('root')!;
const root = createRoot(container);
Notify.init({ position: 'right-bottom' });

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

reportWebVitals();