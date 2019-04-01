const cli = require("./cliHelpers");

const { parseInput, nextInput } = cli;

describe("testing cliHelpers", () => {
  describe("testing parseInput", () => {
    test("should extract valid cmd", () => {
      validCommands = ["add"];
      expect(parseInput("add", validCommands)).toEqual({
        cmd: "add",
        args: undefined
      });
    });

    test("should *not* extract invalid cmd", () => {
      validCommands = ["add"];
      expect(parseInput("help", validCommands)).toEqual({
        cmd: undefined,
        args: undefined
      });
    });
  });

  describe("testing nextInput", () => {
    let rlInterfaceMock;

    beforeAll(() => {
      rlInterfaceMock = { question: () => {} };
    });

    test("should return a promise", () => {
      expect(nextInput(["add"], rlInterfaceMock).then).toBeDefined();
    });

    test("errors if not provided an readline interface", async () => {
      expect.assertions(1);
      try {
        await nextInput([]);
      } catch (e) {
        expect(e.message).toBe("Readline interface not provided.");
      }
    });

    test("errors if not provided list of valid commands", async () => {
      expect.assertions(1);
      try {
        await nextInput("add", rlInterfaceMock);
      } catch (e) {
        expect(e.message).toBe(
          "nextInput(): `commands` argument must be an array of valid command strings."
        );
      }
    });

    test("outputs warning message if no valid commands provided", async () => {
      const spy = jest.spyOn(console, "warn").mockImplementation(() => {});
      jest
        .spyOn(rlInterfaceMock, "question")
        .mockImplementation((question, cb) => cb(""));

      await nextInput([], rlInterfaceMock);

      expect(spy).toHaveBeenCalledWith(
        "nextInput(): `commands` list of valid commands is empty."
      );

      spy.mockRestore();
    });

    test("calls rlInterfaceMock.question with correct prompt", async () => {
      const spy = jest
        .spyOn(rlInterfaceMock, "question")
        .mockImplementation((question, cb) => cb(""));

      await nextInput(["add"], rlInterfaceMock);

      expect(spy).toHaveBeenLastCalledWith("\n> ", expect.any(Function));

      spy.mockRestore();
    });

    test("correctly parses user input", async () => {
      rlInterfaceMock.question = jest
        .fn()
        .mockImplementation((question, cb) =>
          cb("play 'This is the Best' by The Dudes")
        );
      expect(await nextInput(["play"], rlInterfaceMock)).toEqual({
        cmd: "play",
        args: "'This is the Best' by The Dudes"
      });
    });
  });
});
