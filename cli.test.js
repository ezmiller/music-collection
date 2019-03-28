const cli = require("./cli");

const { rl, parseInput, nextInput } = cli;

jest.mock("readline");

describe("testing cli", () => {
  describe("testing parseInput", () => {
    it("should extract valid cmd", () => {
      validCommands = ["add"];
      expect(parseInput("add", validCommands)).toEqual({
        cmd: "add",
        args: undefined
      });
    });

    it("should *not* extract invalid cmd", () => {
      validCommands = ["add"];
      expect(parseInput("help", validCommands)).toEqual({
        cmd: undefined,
        args: undefined
      });
    });
  });

  describe("testing nextInput", () => {
    afterAll(() => jest.restAlMocks());

    it("should return a promise", () => {
      expect(nextInput(["add"]).then).toBeDefined();
    });

    it("errors if not provided list of valid commands", async () => {
      expect.assertions(1);
      try {
        await nextInput("add");
      } catch (e) {
        expect(e.message).toBe(
          "nextInput(): `commands` argument must be an array of valid command strings."
        );
      }
    });

    it("outputs warning message if no valid commands provided", async () => {
      const spy = jest.spyOn(console, "warn");
      await nextInput([]);
      expect(spy).toHaveBeenCalledWith(
        "nextInput(): `commands` list of valid commands is empty."
      );
    });

    it("calls readline.question with correct prompt", async () => {
      await nextInput(["add"]);
      expect(rl.question).toHaveBeenLastCalledWith("> ", expect.any(Function));
    });

    it("correctly parses user input", async () => {
      expect(await nextInput(["play"])).toEqual({
        cmd: "play",
        args: "'This is the Best' by The Dudes"
      });
    });
  });
});
