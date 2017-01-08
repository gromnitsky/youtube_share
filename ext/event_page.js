/* globals chrome, youtube_share */

let clipboard_write = function(str) {
    let node = document.querySelector('textarea')
    node.value = str
    node.select()
    document.execCommand("copy", false, null)
}

let link_create = function(vid) {
    let img = new Image()
    img.onload = function() {
	let imgsealer = new youtube_share.ImgSealer(this)
	let data = imgsealer.toBase64()
	let link = `<a href='https://www.youtube.com/watch?v=${vid}' target='_blank'><img src='${data}' alt='Opens a Youtube page'></a>`

	clipboard_write(link)
	alert(`A text for a Youtube share is copied into the clipboard (${link.length} KB)`)
    }
    fetch(`https://i.ytimg.com/vi/${vid}/0.jpg`)
	.then( r => {
	    if (r.ok) return r.blob()
	    throw new Error('failed to fetch a thumbnail')
	})
	.then( blob => {
	    img.src = URL.createObjectURL(blob)
	})
	.catch( err => {
	    alert(err)
	})
}

let click = function(info) {
    let str = info.linkUrl || info.selectionText || null
    let vid = youtube_share.url_parse(str)
    if (!vid) {
	alert('Failed to extract a video id')
	return
    }
    link_create(vid)
}

console.log('youtube_share: wake up')
chrome.contextMenus.onClicked.addListener(click)

// a stage area for clipboard
document.body.appendChild(document.createElement("textarea"))

// the callback shouldn't run each time chrome wakes up the extension
chrome.runtime.onInstalled.addListener(() => {
    console.log('youtube_share: creating a menu item')
    chrome.contextMenus.create({
	"id": "0",
	"title": "youtube_share",
	"contexts": ["link", 'selection']
    })
})
