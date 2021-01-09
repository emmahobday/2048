# 2048

A recreation of the modern classic '2048', made in vanilla JS.

I built this in a day, and it was a great exercise in manipulating arrays and objects.

I'd like to fine-tune some of logic - at the moment, you lose when the board is filled with tiles, but after checking the original I noticed that you should only lose when the board is full AND there are no possible moves left. Also, at the moment, if you swipe but no changes are made to the board, a new tile is still generated, whereas in the original, a new tile is only generated if something is moved. Adding this in will make the game considerably more challenging to win!

The confetti on win is courtesy of confetti.js.
