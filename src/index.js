import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App.js';
import ApolloProviderWrapper from './components/ApolloProviderWrapper.jsx';

const root = document.getElementById('root');

const element = (
  <ApolloProviderWrapper>
    <App />
  </ApolloProviderWrapper>
);

ReactDOM.render(element, root);
