import React from 'react';
import shared from './shared'

function App() {

  // The script returned
  // is published to the ../extension/content.js
  // by the webpack.
  // See "build": "webpack --config webpack.config.js" in package.json

  return (
    <>
      {
        (() => {return <></>})()
      }
    </>
  );
}

export default App;
