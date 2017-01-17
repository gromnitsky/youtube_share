'use strict';

let youtube_share = {};

(function(exports) {
    let rads = function(deg) {
	return Math.PI * deg / 180
    }

    class ImgSealer {
	constructor(img) {
	    this.node = document.createElement("canvas")
	    if (img.width < 480 || img.height < 360)
		throw new Error('min image is 480x360 px')

	    this.node.width = img.width
	    this.node.height = img.height
	    this.ctx = this.node.getContext('2d')

	    this.ctx.drawImage(img, 0, 0)

	    this.ctx.font = '42px Sans-serif'
	    let msg = 'Tap to play'
	    let tw = this.ctx.measureText(msg).width
	    let tx = (this.node.width - tw) / 2
	    let ty = this.node.height / 2
	    this.draw_text(msg, tx, ty - 60)

	    this.draw_play_symbol(this.node.width / 2, this.node.height / 2)
	}

	draw_play_symbol(x, y, r = 40) {
	    this.ctx.save()

	    this.ctx.strokeStyle = 'black'
	    this.ctx.fillStyle = 'rgba(255, 255, 255, .7)'

	    this.ctx.beginPath()
	    this.ctx.arc(x, y, r+10, rads(0), rads(360), false)
	    this.ctx.moveTo(x+r, y)
	    this.ctx.arc(x, y, r,    rads(0), rads(360), true) // counterclockwise

	    // A |\
	    //   | \
	    //   | / C
	    // B |/
	    let A = {
		x: x - 0.5*r,
		y: y - (r*Math.sqrt(3))/2
	    }
	    let B = {
		x: A.x,
		y: y + (r*Math.sqrt(3))/2
	    }
	    let C = {
		x: x + r,
		y: y
	    }
	    this.ctx.moveTo(A.x, A.y)
	    this.ctx.lineTo(B.x, B.y)
	    this.ctx.lineTo(C.x, C.y)
	    this.ctx.closePath()	// draws a line to A

	    this.ctx.fill()
	    this.ctx.stroke()
	    this.ctx.restore()
	}

	draw_text(text, x, y) {
	    this.ctx.save()

	    this.ctx.strokeStyle = 'black'
	    this.ctx.lineWidth = 2
	    this.ctx.strokeText(text, x, y)
	    this.ctx.fillStyle = 'ghostwhite'
	    this.ctx.fillText(text, x, y)

	    this.ctx.restore()
	}

	toBase64(q = 0.76) {
	    return this.node.toDataURL("image/jpeg", q)
	}

	toBlob(q = 0.76) {
	    return new Promise( (resolve, _reject) => {
		this.node.toBlob( blob => {
		    resolve(blob)
		}, "image/jpeg", q)
	    })
	}

	inject_to(query) {
	    let cont = document.querySelector(query)
	    cont.innerHTML = ''
	    cont.appendChild(this.node)
	}
    }

    // https://www.youtube.com/watch?v=tTv5ckMe_2M
    // https://youtu.be/tTv5ckMe_2M
    // https://www.youtube.com/embed/tTv5ckMe_2M
    //
    // return a video id or null
    let url_parse = function(str) {
	let r
	let url
	try {
	    url = new URL(str)
	} catch (e) {
	    return null
	}
	if (!url.host.match(/(youtube\.com|youtu\.be)/)) return null

	if (url.pathname === '/watch') r = url.searchParams.get('v')
	else if ( (r = url.pathname.match(/^\/embed\/([^\/]+)/))) r = r[1]
	else r = url.pathname.slice(1)

	if (!r) return null
	r = r.replace(/\/+$/, '') // right trim '/'
	if (r.match(/^[a-zA-Z0-9_-]+$/)) return r
	return null
    }

    class UploadError extends Error {
	constructor(msg) {
	    super(msg)
	    this.message = `upload: ${msg}`
	    this.name = 'UploadError'
	}
    }

    let upload = function(blob, ihs) {
	let fd = new FormData()
	fd.append('type', 'file')
	fd.append(ihs.post_file, blob, "file.jpg")
	if (ihs.params) {
	    for (let key in ihs.params) fd.append(key, ihs.params[key])
	}
	let headers = {}
	if (ihs.headers) {
	    for (let key in ihs.headers) headers[key] = ihs.headers[key]
	}

	let resolve = function(obj, path) {
	    return path.split('.').reduce( (prev, curr) => {
		return prev ? prev[curr] : undefined
	    }, obj)
	}

	return fetch(ihs.url, {
	    method: 'POST',
	    headers,
	    body: fd
	}).then( res => {
	    if (res.status !== 200)
		throw new UploadError(`HTTP status: ${res.status}`)
	    return res.json()
	}).then( json => {
	    let r = resolve(json, ihs.result)
	    if (!r) throw new UploadError('invalid json')
	    return r
	})
    }

    exports.ImgSealer = ImgSealer
    exports.url_parse = url_parse
    exports.UploadError = UploadError
    exports.upload = upload

})(typeof exports === 'object' ? exports : youtube_share)
