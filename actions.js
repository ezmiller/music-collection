const argsRe = new RegExp(
  /"(?<title>[a-zA-Z\s']+)"(\s+(by)?\s*"?(?<artist>[a-zA-Z\s']+)"?)?/
);

const parseArgs = args =>
  [args]
    .map(str => str.match(argsRe))
    .map(result => (result !== null ? result : { groups: [] }))
    .map(({ groups }) => ({
      title: groups.title,
      artist: groups.artist
    }))[0];

const songToStr = (song, playedState = false) => {
  let s = `"${song.title}" by ${song.artist}`;
  if (playedState) {
    s += ` (${song.played ? "played" : "unplayed"})`;
  }
  return s;
};

const add = (state, action) => {
  const { type, payload } = action;
  const args = payload;

  if (!args) {
    return state;
  }

  const { artist, title } = parseArgs(args);

  if (!artist || !title) {
    return {
      ...state,
      nextOutput:
        'Usage: add "<Song Title>" "<Artist>"\nExample: add "Ride the Lightning" "Metallica"'
    };
  }

  const newSong = { artist, title, played: false };

  return {
    ...state,
    songs: state.songs.concat(newSong),
    nextOutput: `Added ${songToStr(newSong)}`
  };
};

const show = (state, action) => {
  const { type, payload } = action;

  if (!payload) {
    return {
      ...state,
      nextOutput: "Usage: show <all | played | unplayed>"
    };
  }

  const args = payload.trim();

  switch (args) {
    case "all":
      return {
        ...state,
        nextOutput: state.songs.reduce(
          (acc, song) => (acc += `${songToStr(song, true)}\n`),
          ""
        )
      };
    case "played":
      return {
        ...state,
        nextOutput: state.songs
          .filter(x => x.played === true)
          .reduce((acc, song) => acc + `${songToStr(song, true)}\n`, "")
      };
    case "unplayed":
      return {
        ...state,
        nextOutput: state.songs
          .filter(s => s.played === false)
          .reduce((acc, s) => `${songToStr(s, true)}\n`, "")
      };
    default:
      return state;
  }
};

const flush = (state, action) => ({
  ...state,
  nextOutput: false
});

const quit = (state, action) => ({
  ...state,
  shouldQuit: true
});

module.exports = {
  add,
  quit,
  show,
  flush
};
