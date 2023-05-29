# GrumpyPlayer

A simple web+HTTP home media player

This is born of the frustration of trying to keep some sort of Kindle
Fire plus media server going for my home audio,.

The goal is very simple HTTP + HTML + JavaScript.

"Grumpy" because I'm sick of keeping media servers running, or logins
for hybrid tools (looking at you, Plex), or breakage with upgrades....

I want to make it as simple to use and admin as as "put a CD in the
stereo". No JavaScript frameworks. No special server software. No
indexing id3 tags. No client side apps. Just drop this project in a
directory, put the music in a Music folder underneath that, serve the
whole thing in whatever HTTP server you were already using for your
home server, play the music.

Tab on a disclosure tab to dig deeper, tap on a name to add that to
the playlist, tap on an "x" in the playlist to remove something. Tap
on a thing in the playlist to start playing.

Known bugs:

1. Doesn't deal well with multiple copies of the same song added.

2. Kinda clumsy with playing stop and start vs the playlist.

## Installation

Clone into a directory on your HTTP server. Symlink ./Music to your
music folder.

For HTTP servers, I developed it with `python3 -m http.server` and
deployed it on Apache.

On Apache you might have to turn on FollowSymLinks and Indexes.

## Use

Click on a folder or file to add it to the playlist. Click on a file
in the playlist to play.


