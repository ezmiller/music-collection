const { add, quit, flush, show, play } = require("./actions");

describe("testing actions", () => {
  test("`quit` action returns the correct state", () => {
    state = { shouldQuit: false };
    expect(quit(state, { type: "quit" })).toEqual({
      shouldQuit: true
    });
  });

  test("`flush` action returns the correct state", () => {
    state = { nextOutput: "This is a message." };
    expect(flush(state, { type: "flush" })).toEqual({
      nextOutput: false
    });
  });

  describe("testing show action", () => {
    let albums = [
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
      state = { albums };

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

    test("returns correct state for `all` filter w/ artist specified", () => {
      state = { albums, nextOutput: false };

      const { nextOutput } = show(state, {
        type: "show",
        payload: 'all by "The Dudes"'
      });

      const regexes = [
        /"This is the Best" by The Dudes \(unplayed\)/,
        /"Where's my Car\?" by The Dudes \(unplayed\)/,
        /(?!"Ladies and gentleman we are floating in space" by Spiritualized \(unplayed\))/,
        /(?!"For the Whole World to See" by Death \(played\))/
      ];

      regexes.forEach(re => expect(nextOutput).toMatch(re));
    });

    test("returns correct state for `unplayed` filter", async () => {
      state = { albums, nextOutput: false };

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
      state = { albums, nextOutput: false };

      const { nextOutput } = show(state, {
        type: "show",
        payload: 'unplayed by "The Dudes"'
      });

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

    test("returns usage message when needed", () => {
      state = { albums: [], nextOutput: false };

      const { nextOutput } = show(state, { type: "show", payload: "" });

      expect(nextOutput).toMatch(
        'Usage: show <all "$artist"| unplayed "$artist">'
      );
    });
  });

  describe("testing `add` action", () => {
    test("returns the correct state for valid args", async () => {
      const argsToTest = [
        '"Licensed to Ill" by The Beastie Boys',
        '"Licensed to Ill" "The Beastie Boys"',
        '"Licensed to Ill" by "The Beastie Boys'
      ];

      argsToTest.forEach(args => {
        const state = { albums: [] };
        expect(add(state, { type: "add", payload: args })).toMatchObject({
          albums: [
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

    test("returns usage message when needed", () => {
      state = { albums: [], nextOutput: false };

      const argsToTest = [
        "Licensed to Ill", // only title
        "Licensed to Ill by" // title, no artist
      ];

      argsToTest.forEach(args => {
        state = { albums: [], nextOutput: false };
        const { nextOutput } = add(state, { type: "add", payload: args });
        expect(nextOutput).toBe(
          'Usage: add "$album" "$artist"\nExample: add "Ride the Lightning" "Metallica"'
        );
      });
    });
  });

  test("`play` action returns the correct state", () => {
    let state;
    const album = {
      title: "This is the Best",
      artist: "The Dudes",
      played: false
    };

    state = { albums: [album] };
    expect(
      play(state, { type: "play", payload: '"Nonexistant album"' })
    ).toMatchObject({
      nextOutput: "Sorry, that album isn't in your library. Please try again."
    });

    state = { albums: [album] };
    expect(
      play(state, { type: "play", payload: `"${album.title}"` })
    ).toMatchObject({
      albums: [{ ...album, played: true }],
      nextOutput: `You're listening to "${album.title}"`
    });
  });
});
