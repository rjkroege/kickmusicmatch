// Figure out the automatic startup as a script.  (Here document?)

function run(argv) {
	console.log("hello from main");
	console.log(argv);


	if (!Application('Music').running()) {
		console.log("Music is not running, run Music first");
		return "sad";
		// TODO(rjk): rational exit status.
	}

	const musicapp = Application("Music");

	// tracks is an array of track data. Properties are accessed with
	// function notation.
	const tracks = musicapp.tracks();

	// Lists all of the tracks displaying aritst, album, trackname.
	// This takes a while to spit out because I have many tracks and
	// Edwood is not blindlingly fast.
	tracks.forEach(x => {
		console.log(x.artist(), x.album(), x.name());
	});

	

	// console.log(JSON.stringify(playlists, null, 2)); // The null, 2 enables pretty-printing.

}

