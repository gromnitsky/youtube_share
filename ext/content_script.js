/* globals chrome, NProgress */
'use strict';

// listen to a message from event_page.js
chrome.extension.onMessage.addListener( req => {
    if (req.name !== 'progress') return
    NProgress[req.op]()
})
