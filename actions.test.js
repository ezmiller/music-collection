const { add, quit, flush, show, play } = require("./actions");

describe("testing actions", () => {
  test("`quit` returns the correct state", () => {
    state = { shouldQuit: false };
    expect(quit(state, { type: "quit" })).toEqual({
      shouldQuit: true
    });
  });

  test("`flush` returns the correct state", () => {
    state = { nextOutput: "This is a message." };
    expect(flush(state, { type: "flush" })).toEqual({
      nextOutput: false
    });
  });

  test("`show` returns the correct state", () => {
    songs = [
      { title: "This is the Best", artist: "The Dudes", played: false },
      { title: "Where do we go from here?", artist: "Death", played: true }
    ];

    state = { songs };

    expect(show(state, { type: "show", payload: "all" })).toMatchObject({
      nextOutput:
        '"This is the Best" by The Dudes (unplayed)\n' +
        '"Where do we go from here?" by Death (played)\n'
    });

    expect(show(state, { type: "show", payload: "played" })).toMatchObject({
      nextOutput: '"Where do we go from here?" by Death (played)\n'
    });

    expect(show(state, { type: "show", payload: "unplayed" })).toMatchObject({
      nextOutput: '"This is the Best" by The Dudes (unplayed)\n'
    });
  });

  test("`add` returns the correct state", async () => {
    const argsToTest = [
      '"Licensed to Ill" by The Beastie Boys',
      '"Licensed to Ill" "The Beastie Boys"',
      '"Licensed to Ill" by "The Beastie Boys'
    ];

    argsToTest.forEach(args => {
      const state = { songs: [] };
      expect(add(state, { type: "add", payload: args })).toMatchObject({
        songs: [
          {
            title: "Licensed to Ill",
            artist: "The Beastie Boys",
            played: false
          }
        ],
        nextOutput: 'Added "Licensed to Ill" by The Beastie Boys'
      });
    });
  });

  test("`play` returns the correct state", () => {
    let state;
    const song = {
      title: "This is the Best",
      artist: "The Dudes",
      played: false
    };

    state = { songs: [song] };
    expect(
      play(state, { type: "play", payload: "Nonexistant song" })
    ).toMatchObject({
      nextOutput: "Sorry, that song isn't in your library. Please try again."
    });

    state = { songs: [song] };
    expect(play(state, { type: "play", payload: song.title })).toMatchObject({
      songs: [{ ...song, played: true }],
      nextOutput: `You're listening to ${song.title}`
    });
  });
});
