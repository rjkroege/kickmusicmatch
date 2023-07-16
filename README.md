Apple Music has this cool feature where it will upload tracks from one's personal Apple
Music library to iCloud. My understanding of this feature (observation, web searches) is
that it works something like this:

* add an audio track to Music
* Music puts the "Cloud Status" of the Music to "Waiting"
* after a while (minutes? hours? days?), Music will update the "Cloud Status" to one of the following:
	* "Error"
	* "Uploaded"
	* "Matched"
* Error means what it sounds like. The uploading/matching process didn't work. The track won't
be available on other devices (or Music libraries)
* Uploaded is good: the track will be available in other dvices (or Music libraries.) I'm unclear if
it gets munged / recompressed. Apple (in somewhat typical fashion) does not specify the details.
Regardless: it at least sounds the same in casual listening tests.
* Matched is good: the track is audio-equivalent to a track from the Apple Music catalog. In this
case, playback on other devices will substitute the version from the Music store. I assume that
downloading a matched track will get me a version with some kind of rights annotation.

By observation on Monterey: the uploading process is fragile. It easily goes wrong
and leaves the track in the "Error" state. There does not appear to be
*any way to force Music to try again.* By experiment: the only way to
get Apple Music to try the upload process again is to:

* delete the "Error" tracks from the Music library
* import the tracks over again into the Music library

The `kickmusicmatch.js` script does these steps in small tranches of tracks.

# Status
Barely useful. Read the code before using. Run like this:

```shell
osascript -l JavaScript kickmusicmatch.js
```

where `kickmusicmatch.js` is in the current directory.
