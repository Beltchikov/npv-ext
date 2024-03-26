import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const idCollector = 'collector';
const idDialog = 'npvDialog';

console.log('INDX');

var rootElement:HTMLDivElement = Array.from(document.getElementsByTagName('div')).filter((e)=> e.id === idCollector)[0];
if (!rootElement) {
  // const dialog = document.createElement('dialog');
  // dialog.id = idDialog;

  rootElement = document.createElement("div");
  rootElement.id = idCollector;
  //rootElement.appendChild(dialog);
 
  document.body.appendChild(rootElement);
}
// else
// {
  // console.log('rootElement EXISTS');
  
  // var dialogElement:HTMLDialogElement = Array.from(document.getElementsByTagName('dialog')).filter((e)=> e.id === idDialog)[0];
  // if(!dialogElement)
  // {
  //   console.log('dialogElement DOES NOT EXIST');
    
  //   const dialog = document.createElement('dialog');
  //   dialog.id = idDialog;
  //   rootElement.appendChild(dialog);
  //}
//}

export const collector = ReactDOM.createRoot(
  document.getElementById(idCollector) as HTMLElement
);

collector.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
