/* global youtube_share */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
    let img = new Image()
    img.onload = function() {
	let ims = new youtube_share.ImgSealer(this)
	ims.inject_to('#app')

	ims.toBlob().then( blob => {
	    return youtube_share
		.upload(blob, {
		    url: 'http://localhost:3000/3/image.json',
		    "post_file": "image",
		    "headers": {
			"Authorization" : "Client-ID omglol"
		    },
		    "result": "data.link"
		})
	}).then( link => {
	    let node = document.createElement("img")
	    node.src = link
	    document.querySelector('#app').appendChild(node)
	}).catch( err => {
	    console.log(err)
	})

    }
    fetch('data/rowan-atkinson-parrot.jpg')
	.then( r => {
	    if (r.ok) return r.blob()
	    throw new Error('failed to fetch a thumbnail')
	})
	.then( blob => {
	    img.src = URL.createObjectURL(blob)
	})
	.catch( err => {
	    console.log(`omglol: ${err.message}`)
	})
})
