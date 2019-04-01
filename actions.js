const argsRe = new RegExp(
  /"(?<title>[a-zA-Z\s']+)"(\s+(by)?\s*"?(?<artist>[a-zA-Z\s']+)"?)?/
);

const albumToStr = (album, playedState = false) => {
  let s = `"${album.title}" by ${album.artist}`;
  if (playedState) {
    s += ` (${album.played ? "played" : "unplayed"})`;
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
      nextOutput: 'Usage: play "$album"'
    };
  }

  const albumTitle = parsePlayArgs(action.payload.trim()).title;

  const foundAlbumTitle = state.albums.some(s => s.title === albumTitle);

  if (!foundAlbumTitle) {
    return {
      ...state,
      nextOutput: "Sorry, that album isn't in your library. Please try again."
    };
  }

  return {
    ...state,
    albums: state.albums.map(s =>
      s.title === albumTitle ? { ...s, played: true } : s
    ),
    nextOutput: `You're listening to "${albumTitle}"`
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
        'Usage: add "$album" "$artist"\nExample: add "Ride the Lightning" "Metallica"'
    };
  }

  const newAlbum = { artist, title, played: false };

  return {
    ...state,
    albums: state.albums.concat(newAlbum),
    nextOutput: `Added ${albumToStr(newAlbum)}`
  };
};

const parseShowArgs = args =>
  [args]
    .map(str =>
      str.match(/(?<filter>[a-z]+)(\s+by\s+"?(?<artist>[a-zA-Z\s']+)"?)?/)
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
      nextOutput: 'Usage: show <all | unplayed "$artist">'
    };
  }

  const args = payload.trim();
  const { filter, artist } = parseShowArgs(args);

  switch (filter) {
    case "all":
      return {
        ...state,
        nextOutput: state.albums.reduce(
          (acc, album) => (acc += `${albumToStr(album, true)}\n`),
          ""
        )
      };
    case "unplayed":
      return {
        ...state,
        nextOutput: state.albums
          .filter(s =>
            artist
              ? s.played === false && s.artist === artist
              : s.played === false
          )
          .reduce((acc, s) => (acc += `${albumToStr(s, true)}\n`), "")
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
