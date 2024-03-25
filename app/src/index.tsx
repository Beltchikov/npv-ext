import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const idCollector = 'collector';
if (!document.getElementById(idCollector)) {
  const rootElement = document.createElement("div");
  rootElement.id = idCollector;
  document.body.appendChild(rootElement);
}

export const collector = ReactDOM.createRoot(
  document.getElementById(idCollector) as HTMLElement
);

collector.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
