'use strict';

let ihs = {};

(function(exports) {

    // for an Imgur-like service
    let blob_upload = function(blob, url_post, auth_id) {
	let fd = new FormData()
	fd.append('type', 'file')
	fd.append('image', blob, "file.jpg")

	return fetch(url_post, {
	    method: 'POST',
	    headers: { Authorization: `Client-ID ${auth_id}` },
	    body: fd
	}).then( res => {
	    if (res.status !== 200) throw new Error(`status code: ${res.status}`)
	    return res.json()
	}).then( json => {
	    if (!json.data || !json.data.link) {
		console.log(json)
		throw new Error('unknown json data in the response')
	    }
	    return json.data.link
	})
    }

    exports.blob_upload = blob_upload

})(typeof exports === 'object' ? exports : ihs)
