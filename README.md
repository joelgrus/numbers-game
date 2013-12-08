numbers-game
============

I built this game for two reasons:

1. I wanted to learn AngularJS
2. I thought my toddler would find it fun.

I sort of succeeded on both counts.

You can see the game up and running here:

http://numbers-game.s3-website-us-east-1.amazonaws.com/

although the sound is a little bit laggy, since it's getting served out of S3.


Caveat
------

the code here won't work, because I didn't include any of the .mp3 files that provide the sound.
you'll need to record (or source) your own and stick them in subdirectories of audio and then 
modify the game model to know which voice options there are.
