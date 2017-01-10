/* globals chrome, youtube_share, ihs */

let conf = {}

let clipboard_write = function(str) {
    let node = document.querySelector('textarea')
    node.value = str
    node.select()
    document.execCommand("copy", false, null)
}

let link_create = function(vid) {
    let url_thumbnail = conf.youtube_frame.replace('%s', vid)
    let ihs_provider = conf.ihs.imgur

    let img = new Image()
    img.onload = function() {
	let imgsealer = new youtube_share.ImgSealer(this)

	imgsealer.toBlob().then( blob => {
	    return ihs.blob_upload(blob,
				   ihs_provider.url, ihs_provider.client_id)
	}).then( link => {
	    let r = `<a href='https://www.youtube.com/watch?v=${vid}' target='_blank'><img src='${link}' alt='Opens a Youtube page'></a>`

	    clipboard_write(r)
	    alert(`A text for a Youtube share is copied into the clipboard`)
	}).catch( err => {
	    alert(err)
	})

    }
    fetch(url_thumbnail)
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

let main = function(info) {
    let config = info.installType === 'development' ? 'conf.debug.json' : 'conf.json'
    console.log(`youtube_share: wake up; config=${config}`)

    fetch(config).then( res => res.json()).then( json => {
	conf = json
	chrome.contextMenus.onClicked.addListener(click)
	// a stage area for clipboard
	document.body.appendChild(document.createElement("textarea"))

    }).catch( err => {
	console.log(err)
    })
}


chrome.management.getSelf(main)

// the callback shouldn't run each time chrome wakes up the extension
chrome.runtime.onInstalled.addListener(() => {
    console.log('youtube_share: creating a menu item')
    chrome.contextMenus.create({
	"id": "0",
	"title": "youtube_share",
	"contexts": ["link", 'selection']
    })
})
