// Figure out the automatic startup as a script.  (Here document?)

// printtrack prints useful track information to the console with an optional prefix.
// When executed in a forEach loop, the prefix will be the index of the track.
function printtrack(track /* Track object */, prefix /* optional string */) {
	const x = track;
		let artist = x.artist();
		let album = x.album();
		let name = x.name();

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

		if (!!prefix || prefix === 0) {
			console.log("%s '%s'/'%s'/'%s' status:%s path:%s", prefix, artist, album, name, x.cloudStatus(), x.location());
		} else {
			console.log("'%s'/'%s'/'%s' status:%s path:%s", artist, album, name, x.cloudStatus(), x.location());
		}
}

function run(argv) {
	console.log("hello from main");
	console.log(argv);

	if (!Application('Music').running()) {
		console.log("Music is not running, run Music first");
		return "sad";
		// TODO(rjk): rational exit status.
	}

	const musicapp = Application("Music");
	musicapp.includeStandardAdditions = true;
	const playlists = musicapp.playlists();

	// NB: the unbound variable (x) needs to be in brackets.
	// Get the Library special playlist.
	const library = playlists.filter((x) => x.specialKind() == "Library")[0];
	console.log(library.name(), library.specialKind());

	// Candidates for kicking are
	// a. filetracks
	// b. have a location that is not empty.

	// How can I get iTunes to "drop" a local copy? (To save space...) There
	// is no obvious way to do this. I believe that the way is to have two
	// Music libraries. One is the "upload source". That can be deleted.
	// See [[Managing-Apple-Music.md]]

	// TODO(rjk): Extract the picker function into a helper function.
	// TODO(rjk): There's probably a better way to do this where I could get Music to do the
	// filtering.
	const targetracks = library.fileTracks().filter((x) => !!x.location()).filter((x) => {
		const cs = x.cloudStatus()
		return cs == "unknown" || cs =="error" || cs == "not uploaded" || cs == "waiting" || cs == "removed";
	});
	// targetracks.forEach(printtrack);

	// This might be too many at once. Try doing in tranches of 15?
	console.log("length", targetracks.length);

	let s = targetracks.slice(0, 15);
	const sometracks = s.reverse();
	// sometracks.forEach(printtrack);

	// Need the current application to have permission to run doShellScript.
	// Hypothesis: I expect that Apple Music runs *in a sandbox* and hence
	// can't execute the shell script.
	const app = Application.currentApplication();
	app.includeStandardAdditions = true;

	// TODO(rjk): Make the backup location configurable.
	// Backup the tracks.
	console.log("started file preserving");
	app.doShellScript("mkdir -p ~/Music/backupmusics");
	sometracks.forEach((x) => app.doShellScript(`cp -cR $'${escapeshellpath(x.location())}' ~/Music/backupmusics`))
	console.log("finished file preserving");
	
	console.log("started music deleting");
	// Deletes the listed tracks.
	let rmfiles = [];
	sometracks.forEach((x) => {
		printtrack(x, "	>>> deleting");
		rmfiles.push(x.location());
		musicapp.delete(x);
		// After here, x (the track) doesn't exist. Obviously. But I got that
		// wrong at first. The scripting bridge has a bit of a distributed
		// garbage issue. No wonder it seems a bit fragile.
	});
	console.log("finished music deleting?");

	// Remove the tracks from Music's file hierarchy
	console.log("started file deleting");
	rmfiles.forEach((x) => app.doShellScript(`rm -rf $'${escapeshellpath(x)}' `))
	console.log("finished file deleting");

	// Import the tracks
	app.doShellScript("open -a '/System/Applications/Music.app' ~/Music/backupmusics/*");

	// TODO(rjk): the import action of `open` doesn't always actually import the file.
	// I need to verify that the import succeeded. And then delete the backup tree.

	// open will start a track playing. This doesn't work maybe because the play action happens
	// at Music _after_ this runs.
	musicapp.pause();
}

function escapeshellpath(s /* string path */) {
	const regex = /'/g;
	// Coerce s to be an actual string.
	let inputstring = "" + s;
	const res = inputstring.replace(regex, "\\'", );
	console.log("escapeshell", inputstring,  "->", res);
	return res;
}
