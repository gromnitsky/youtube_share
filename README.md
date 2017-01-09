# youtube_share

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

The example above is rendered from:

~~~
<a href='https://www.youtube.com/watch?v=tTv5ckMe_2M' target='_blank'>
<img src='data:image/jpeg;base64,/...'>
</a>
~~~

(In reality it's a one-liner, 33,772 KB long)


## How it works

In `ext` dir there is a Chrome extension that hooks into the
context menu for links & selections.

It

0. Finds a vid id.
1. Fetches the 1st video frame.
2. Creates an in-memory canvas, puts the image onto it, draws the text
   w/ a play "button" next to it.
3. Exports the canvas to jpeg in base64.
4. Constructs &lt;a&gt;+&lt;img&gt;
5. Copies the result into clipboard.


## License

MIT.
