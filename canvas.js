'use strict';

let rads = function(deg) {
    return Math.PI * deg / 180
}

class MyCanvas {
    constructor(img) {
	this.node = document.createElement("canvas")
	if (!img || !img.width) throw new Error('invalid Image object')
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

    inject_to(query) {
	let cont = document.querySelector(query)
	cont.innerHTML = ''
	cont.appendChild(this.node)
    }
}


document.addEventListener('DOMContentLoaded', () => {
    let img = new Image()
    img.onload = function() {
	let canvas = new MyCanvas(this)
	canvas.inject_to('body')

	this.node = document.createElement("img")
//	console.log(canvas.node.toDataURL("image/jpeg", 0.76).length)
	this.node.src = canvas.node.toDataURL("image/jpeg", 0.76)
	document.body.appendChild(this.node)
    }
    fetch('test/data/rowan-atkinson-parrot.jpg')
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
