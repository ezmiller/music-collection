const argsRe = new RegExp(
  /"(?<title>[a-zA-Z\s']+)"(\s+(by)?\s*"?(?<artist>[a-zA-Z\s']+)"?)?/
);

const songToStr = (song, playedState = false) => {
  let s = `"${song.title}" by ${song.artist}`;
  if (playedState) {
    s += ` (${song.played ? "played" : "unplayed"})`;
  }
  return s;
};

const parsePlayArgs = args =>
  [args]
    .map(str => str.match(/"(?<title>[a-zA-Z\s']+)"/))
    .map(result => (result !== null ? result : { groups: [] }))
    .map(({ groups }) => ({
      title: groups.title
    }))[0];

const play = (state, action) => {
  const { type, payload } = action;

  if (!payload) {
    return {
      ...state,
      nextOutput: 'Usage: play "<Song Title>"'
    };
  }

  const songTitle = parsePlayArgs(action.payload.trim()).title;

  const foundSongTitle = state.songs.some(s => s.title === songTitle);

  if (!foundSongTitle) {
    return {
      ...state,
      nextOutput: "Sorry, that song isn't in your library. Please try again."
    };
  }

  return {
    ...state,
    songs: state.songs.map(s =>
      s.title === songTitle ? { ...s, played: true } : s
    ),
    nextOutput: `You're listening to "${songTitle}"`
  };
};

const parseAddArgs = args =>
  [args]
    .map(str => str.match(argsRe))
    .map(result => (result !== null ? result : { groups: [] }))
    .map(({ groups }) => ({
      title: groups.title,
      artist: groups.artist
    }))[0];

const add = (state, action) => {
  const { type, payload } = action;
  const args = payload;

  if (!args) {
    return state;
  }

  const { artist, title } = parseAddArgs(args);

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

const parseShowArgs = args =>
  [args]
    .map(str =>
      str.match(/(?<filter>[a-z]+)(\s+by\s+"(?<artist>[a-zA-Z\s']+)")?/)
    )
    .map(result => (result !== null ? result : { groups: {} }))
    .map(({ groups }) => ({
      filter: groups.filter,
      artist: groups.artist
    }))[0];

const show = (state, action) => {
  const { type, payload } = action;

  if (!payload) {
    return {
      ...state,
      nextOutput: "Usage: show <all | played | unplayed>"
    };
  }

  const args = payload.trim();
  const { filter, artist } = parseShowArgs(args);

  switch (filter) {
    case "all":
      return {
        ...state,
        nextOutput: state.songs.reduce(
          (acc, song) => (acc += `${songToStr(song, true)}\n`),
          ""
        )
      };
    case "unplayed":
      return {
        ...state,
        nextOutput: state.songs
          .filter(s =>
            artist
              ? s.played === false && s.artist === artist
              : s.played === false
          )
          .reduce((acc, s) => (acc += `${songToStr(s, true)}\n`), "")
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
  flush,
  play
};
