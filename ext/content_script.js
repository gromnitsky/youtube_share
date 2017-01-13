/* globals chrome, NProgress, dialog */
'use strict';

// listen to a message from event_page.js
chrome.extension.onMessage.addListener( req => {
    switch (req.name) {
    case 'progress':
	NProgress[req.op]()
	break
    case 'alert':
	dialog.alert(req.text)
	break
    default:
	throw new Error(`unknown message: ${req.name}`)
    }
})


// Main (DOM should be loaded by now)
dialog.init()
