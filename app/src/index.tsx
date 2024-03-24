import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.createElement("div");
rootElement.id = "collector";
document.body.appendChild(rootElement);

export const collector = ReactDOM.createRoot(
  document.getElementById('collector') as HTMLElement
);
collector.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
