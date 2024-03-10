import React from 'react';
import SeekingAlpha from './SeekingAlpha';
import shared from './shared'

function App() {

  // The script returned
  // is published to the ../extension/content.js
  // by the webpack.
  // See "build": "webpack --config webpack.config.js" in package.json

  return (
    <>
      {
        (() => {
          if (shared.localHostOrSeekingAlpha()) {
            return <SeekingAlpha></SeekingAlpha>
          } else {
            return <>
              {console.log(`Not implemented for ${window.location.href}`)}
            </>
          }
        })()
      }
    </>
  );
}

export default App;
