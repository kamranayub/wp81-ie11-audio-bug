Windows Phone IE Audio Issue
============================

## The Test

The page loads 5 HTML Audio elements into an array. 

When you press `Load`, an XHR request loads an MP3 file into each element.

When you press `Play`, the current "track" is played and then the track is changed to the next one in line. This allows a 
semi-multi-track experience in browsers that don't yet support Web Audio API (like IE10/IE11).

## The Issue

On Windows Phone 8.1 (and 8?), IE will not play the HTML5 audio tags through Javascript correctly when they're set to the same source.

On IE11 for desktop, there are no problems and the audio plays fine. The audio tags also play in Chrome and FF without issues.

On Windows Phone, you'll see console messages with times that tell you the audio playback is delayed (`loadeddata` vs. `play` events). There are 
also audio duration issues, where the sound is "choppy" or doesn't sound like the exact same sound.

The appropriate order of events is:

* play
* loadstart
* loadedmetadata
* loadeddata
* playing
* ended

The issue seems to be that IE loads each track when it is played, so the sound is delayed until the `loadeddata` event is done which can sometimes be up to a 
second or two initially. Once all tracks have been played **at least once**, the issue seems to go away or at least be greatly reduced.

## Reproduce

To reproduce the issue, visit the [GitHub project page](http://kamranicus.com/wp81-ie11-audio-bug/) on your Windows Phone.

You can also pull down the `master` branch and run the Windows Phone 8.1 application in VS2013 emulator to step through/debug the code and see the issue in the emulator.

## Workaround

I haven't yet found a workaround but I've only just put together the test case. I will update this test case when or if I find a suitable workaround. My running
theory is that the CPU load is big enough on a phone to raise an issue that would also appear on a slower PC. The fix in that case is to figure out how to
do a proper multi-track-like setup so that the audio is only loaded once and then paused/reset/resumed.

## Theories

It may be the case this isn't a "bug" per se. The issue might have just arisen because the mobile CPU take longer to decode the audio than desktop PCs we've tested. I think to fix this, we just need to figure out how to *not* 
trigger a load every time you want to play the sound, or at least to "preload" it properly (as setting `preload='auto';` does not seem to fix it).
