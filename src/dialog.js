'use strict';

let dialog = {};

(function(exports) {

    let alert = function(text) {
	let node = document.createElement('dialog')
	node.innerHTML = text
	document.body.appendChild(node)
	node.onclick = (evt) => evt.target.close()
	node.onclose = (evt) => document.body.removeChild(evt.target)
	node.showModal()
    }

    exports.alert = alert

})(typeof exports === 'object' ? exports : dialog)
