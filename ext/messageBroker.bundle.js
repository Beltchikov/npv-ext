(()=>{"use strict";chrome.runtime.onMessage.addListener((function(e,n,o){return t=this,r=void 0,c=function*(){if("broker"===e.target){console.log("message with target broker received:"),console.log(e),console.log("sender:"),console.log(n);var t=Object.assign(Object.assign({},e),{target:"background",sender:"broker"});console.log("sending message of type hostname to service worker:"),console.log(t),yield chrome.runtime.sendMessage(t),o(!0)}},new((s=void 0)||(s=Promise))((function(e,n){function o(e){try{a(c.next(e))}catch(e){n(e)}}function i(e){try{a(c.throw(e))}catch(e){n(e)}}function a(n){var t;n.done?e(n.value):(t=n.value,t instanceof s?t:new s((function(e){e(t)}))).then(o,i)}a((c=c.apply(t,r||[])).next())}));var t,r,s,c}))})();