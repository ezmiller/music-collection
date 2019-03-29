const { add, quit, flush, show } = require("./actions");

describe("testing actions", () => {
  test("`add` returns the correct state", () => {
    state = { songs: [] };
    args = '"This is the Best" by The Dudes';
    song = {
      title: "This is the Best",
      artist: "The Dudes",
      played: false
    };

    expect(add(state, { type: "add", payload: args })).toEqual({
      songs: [song]
    });
  });

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
});
