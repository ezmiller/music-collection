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

  describe("testing show action", () => {
    let songs = [
      { title: "This is the Best", artist: "The Dudes", played: false },
      { title: "Where's my Car?", artist: "The Dudes", played: false },
      {
        title: "Ladies and gentleman we are floating in space",
        artist: "Spiritualized",
        played: false
      },
      { title: "For the Whole World to See", artist: "Death", played: true }
    ];

    test("returns correct state for `all` filter", () => {
      state = { songs };

      const { nextOutput } = show(state, { type: "show", payload: "all" });

      const regexes = [
        /"This is the Best" by The Dudes \(unplayed\)/,
        /"Where's my Car\?" by The Dudes \(unplayed\)/,
        /"Ladies and gentleman we are floating in space" by Spiritualized \(unplayed\)/,
        /"For the Whole World to See" by Death \(played\)/
      ];

      regexes.forEach(re => {
        expect(nextOutput).toMatch(re);
      });
    });

    test("returns correct state for `unplayed` filter", async () => {
      state = { songs, nextOutput: false };

      const { nextOutput } = show(state, { type: "show", payload: "unplayed" });

      const regexes = [
        /"This is the Best" by The Dudes \(unplayed\)/,
        /"Where's my Car\?" by The Dudes \(unplayed\)/,
        /"Ladies and gentleman we are floating in space" by Spiritualized \(unplayed\)/
      ];

      regexes.forEach(re => {
        expect(nextOutput).toMatch(re);
      });
    });

    test("returns correct state for `unplayed` filter w/ artist specified", () => {
      state = { songs, nextOutput: false };

      const { nextOutput } = show(state, {
        type: "show",
        payload: 'unplayed by "The Dudes"'
      });

      console.log({ nextOutput });
      const regexes = [
        /"This is the Best" by The Dudes \(unplayed\)/,
        /"Where's my Car\?" by The Dudes \(unplayed\)/
      ];

      expect(nextOutput).not.toMatch(
        /"Ladies and gentleman we are floating in space" by Spiritualized \(unplayed\)/
      );

      regexes.forEach(re => {
        expect(nextOutput).toMatch(re);
      });
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
      play(state, { type: "play", payload: '"Nonexistant song"' })
    ).toMatchObject({
      nextOutput: "Sorry, that song isn't in your library. Please try again."
    });

    state = { songs: [song] };
    expect(
      play(state, { type: "play", payload: `"${song.title}"` })
    ).toMatchObject({
      songs: [{ ...song, played: true }],
      nextOutput: `You're listening to "${song.title}"`
    });
  });
});
