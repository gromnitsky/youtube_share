/* global youtube_share */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
    let img = new Image()
    img.onload = function() {
	let ims = new youtube_share.ImgSealer(this)
	ims.inject_to('body')

	let node = document.createElement("img")
	node.src = ims.toBase64()
	document.body.appendChild(node)
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
