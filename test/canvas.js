/* global youtube_share, ihs */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
    let img = new Image()
    img.onload = function() {
	let ims = new youtube_share.ImgSealer(this)
	ims.inject_to('#app')

//	let node = document.createElement("img")
//	node.src = ims.toBase64()
//	document.querySelector('#app').appendChild(node)

	ims.toBlob().then( blob => {
	    return ihs.blob_upload(blob, 'http://localhost:3000/3/image.json',
				   'dc708f3823b7756')
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
