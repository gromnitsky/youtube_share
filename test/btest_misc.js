/* globals chai, youtube_share */
'use strict';

let assert = chai.assert
let up = youtube_share.url_parse

suite('url_parse', function() {
    test('invalid', function() {
	assert.equal(up(), null)
	assert.equal(up('bwaa!!!'), null)
	assert.equal(up('http://youtu.invalid/tTv5ckMe_2M'), null)
	assert.equal(up('http://youtu.be/tTv5ckMe_2M@@@'), null)
	assert.equal(up('https://www.youtube.com/watch?huh=1'), null)
    })

    test('valid', function() {
	assert.equal(up('http://youtu.be/tTv5ckMe_2M///'), 'tTv5ckMe_2M')
	assert.equal(up('https://www.youtube.com/watch?huh=1&v=tTv5ckMe_2M'), 'tTv5ckMe_2M')
	assert.equal(up('https://www.youtube.com/embed/tTv5ckMe_2M'), 'tTv5ckMe_2M')
	assert.equal(up('https://m.youtube.com/watch?v=tTv5ckMe_2M'), 'tTv5ckMe_2M')
    })
})
