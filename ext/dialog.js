'use strict';

let dialog = {};

(function(exports) {

    let uuid = function(a) {
	return a ? (a^Math.random()*16>>a/4).toString(16) : ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,uuid)
    }

    let dlg_id = `dialog-${uuid()}`

    let alert = function(text) {
	let dlg = document.getElementById(dlg_id)
	dlg.innerHTML = text
	dlg.onclick = (evt) => evt.target.close()
	dlg.showModal()
    }

    let init = function() {
	let node = document.createElement('dialog')
	node.id = dlg_id
	document.body.appendChild(node)
    }

    exports.alert = alert
    exports.init = init

})(typeof exports === 'object' ? exports : dialog)
