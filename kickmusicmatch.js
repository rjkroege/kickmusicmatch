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
	const playlists = musicapp.playlists();

	// NB: the unbound variable (x) needs to be in brackets.
	// Get the Library special playlist.
	const library = playlists.filter((x) => x.specialKind() == "Library")[0];
	console.log(library.name(), library.specialKind());


/*
	// Lists all of the tracks displaying aritst, album, trackname.
	// This takes a while to spit out because I have many tracks and
	// Edwood is not blindlingly fast.
	library.fileTracks().forEach((x) => {
		console.log(x.artist(), x.album(), x.name(), x.cloudStatus(), x.location());
	});

*/

	// Candidates for kicking are
	// a. filetracks
	// b. have a location that is not empty.

	// TODO(rjk): I need to make the forEach closure into a separate function.
//	library.fileTracks().filter((x) => !!x.location()).forEach((x) => {
	library.fileTracks().filter((x) => !!x.location()).filter((x) => {
		const cs = x.cloudStatus()
		return cs == "unknown" || cs =="error" || cs == "not uploaded";
	}).forEach((x) => {
		artist = x.artist();
		album = x.album();
		name = x.name();

		// NB: Missing metadata is a problem.
		if (!artist) {
			artist = "?";
		}
		if (!album) {
			album = "?";
		}
		if (!name) {
			name = "?";
		}

		console.log("%s/%s/%s status:%s path:%s", artist, album, name, x.cloudStatus(), x.location());
	});
	

	// I can also find the other musics.
	// how can I get iTunes to "drop" a local copy? (To save space...)

	

	// console.log(JSON.stringify(playlists, null, 2)); // The null, 2 enables pretty-printing.
}

