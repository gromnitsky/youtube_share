# youtube_share

(Download the .crx file
[here](http://gromnitsky.users.sourceforge.net/js/chrome/).)

Usually you "share" a youtube vid via copying an iframe tag that
Youtube provides for you.

Some forums or social networks (like Dreamwidth Studios) don't allow us to
inject iframes into user comments.

Here is how we can put something on the screen that gives a visual
clue that a picture in the comments isn't a plain picture but a link
to a youtube page:

<a href='https://www.youtube.com/watch?v=tTv5ckMe_2M' target='_blank'>
<img src='http://i.imgur.com/H7HzKEO.jpg'>
</a>

The example above is rendered from an obvious:

~~~
<a href='https://www.youtube.com/watch?v=tTv5ckMe_2M' target='_blank'>
<img src='http://i.imgur.com/H7HzKEO.jpg'>
</a>
~~~


## How it works

0. Finds a vid id.
1. Fetches the 1st video frame.
2. Creates an in-memory canvas, puts the image onto it, draws the text
   w/ a play "button" next to it.
3. Exports the canvas to jpeg.
4. Uploads the jpeg to ~~imgur~~ ultraimg.
5. Constructs &lt;a&gt;+&lt;img&gt;
6. Copies the result into clipboard.

N.B. Don't try to run the extension in developer mode as an "unpacked
extension"--you'll get an ill version that requires additional staff
running on your machine (like `test/imgur-server-stub`).


## Compilation

~~~
$ npm i
$ make crx
~~~

The result should be in `_out` dir.


## License

MIT.
