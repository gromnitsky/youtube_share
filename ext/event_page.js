/* globals chrome, youtube_share */

let log =  console.log.bind(console, 'youtube_share:')

let clipboard_write = function(str) {
    let node = document.querySelector('textarea')
    node.value = str
    node.select()
    document.execCommand("copy", false, null)
}

let progress_update = function(tab_id, op) {
    chrome.tabs.sendMessage(tab_id, {
	name: 'progress',
	op
    })
}

let msg = function(text) {
    setTimeout( () => alert(text), 1)
}

let link_create = function(cfg, tab_id, vid) {
    let img = new Image()
    progress_update(tab_id, 'inc')

    img.onload = function() {
	let imgsealer = new youtube_share.ImgSealer(this)

	imgsealer.toBlob().then( blob => {
	    return youtube_share.upload(blob, cfg.ihs.imgur)
	}).then( link => {
	    let r = `<a href='https://www.youtube.com/watch?v=${vid}' target='_blank'><img src='${link}' alt='Opens a Youtube page'></a>`

	    clipboard_write(r)
	    progress_update(tab_id, 'done')

	    msg('A text for a Youtube share is copied into the clipboard')

	}).catch( err => {
	    progress_update(tab_id, 'done')
	    msg(err)
	})

    }

    let url_thumbnail = cfg.youtube_frame.replace('%s', vid)
    progress_update(tab_id, 'inc')
    fetch(url_thumbnail)
	.then( r => {
	    if (r.ok) return r.blob()
	    throw new Error('failed to fetch a thumbnail')
	})
	.then( blob => {
	    img.src = URL.createObjectURL(blob)
	    progress_update(tab_id, 'inc')

	}).catch( err => {
	    progress_update(tab_id, 'done')
	    msg(err)
	})
}

let click = function(info, tab) {
    conf().then( cfg => {
        let str = info.linkUrl || info.selectionText || null
	let vid = youtube_share.url_parse(str)
	if (!vid) {
	    alert('Failed to extract a video id')
	    return
	}
	link_create(cfg, tab.id, vid)
    })
}

let extinfo = function() {
    return new Promise( (resolve, _reject) => {
	chrome.management.getSelf( data => {
	    resolve(data)
	})
    })
}

let conf = function() {
    return extinfo().then( data => {
	return data.installType === 'development' ? 'conf.debug.json' : 'conf.json'
    }).then( file => {
	return fetch(file).then( res => res.json())
    })
}

chrome.contextMenus.onClicked.addListener(click)
// a stage area for clipboard
document.body.appendChild(document.createElement("textarea"))

// the callback shouldn't run each time chrome wakes up the extension
chrome.runtime.onInstalled.addListener(() => {
    log('creating a menu item')
    chrome.contextMenus.create({
	"id": "0",
	"title": "youtube_share",
	"contexts": ["link", 'selection']
    })
})
