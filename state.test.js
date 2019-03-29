const { getStateReducer } = require("./state");

describe("testing state", () => {
  describe("testing getStateReducer", () => {
    let reducerFn;

    beforeAll(() => {
      reducerFn = getStateReducer({
        addSong: (state, action) => ({
          ...state,
          songs: state.songs.concat(action.payload)
        })
      });
    });

    test("should return a function", () => {
      expect(typeof reducerFn).toBe("function");
    });

    test("can use reducer to update state", () => {
      state = { songs: [] };

      song = {
        title: "This is the Best",
        artist: "The Dudes",
        played: false
      };

      let nextState = reducerFn(state, { type: "addSong", payload: song });

      expect(nextState).toEqual({
        songs: [song]
      });
    });
  });
});
