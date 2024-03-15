// service worker

chrome.action.onClicked.addListener(async (currentTab) => {


  function getCurrentTab(callback) {
    let queryOptions = { active: true, lastFocusedWindow: true };
    chrome.tabs.query(queryOptions, ([tab]) => {
      if (chrome.runtime.lastError)
        console.error("ERR: " + chrome.runtime.lastError);
      // `tab` will either be a `tabs.Tab` instance or `undefined`.
      callback(tab);
    });
  }

  // function poc() {
  //   alert('tab');
  // };

  // chrome.scripting
  //   .executeScript({
  //     target: { tabId: currentTab.id },
  //     func: poc,
  //   })
  //   .then(() => console.log("injected a function"));


  chrome.scripting.executeScript({
    target: { tabId: currentTab.id },
    files: ['content.js']
  });
});

//Example of a simple user data object
const user = {
  username: 'demo-user'
};



chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === 'get-user-data') {

    //var tabs = [];
    // var tabArray = new Array();
    chrome.tabs.query({ active: false, lastFocusedWindow: true })
      .then((r)=>sendResponse({ok: r}))
      .catch(e => sendResponse({err: e.message}));
    
      // for (const tab of tabs) {
    //   tabArray.push(tab.url);
    // };

    return true;
    //sendResponse(['HHH', 'GGG']);
    //sendResponse(tabs);

    // sendResponse((async() => {

    //   var tabs = [];
    //   var tabArray = new Array();
    //   tabs = await chrome.tabs.query({ active: false, lastFocusedWindow: true });
    //   for (const tab of tabs) {
    //     tabArray.push(tab.url);
    //   };

    //   return tabArray;

    //   //return { data: ['HHH', 'GGG'] };
    //   //return 'H1';


    // })());

  }
});

