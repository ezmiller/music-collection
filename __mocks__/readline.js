const readline = jest.genMockFromModule("readline");

readline.createInterface = jest.fn().mockReturnValue({
  question: jest
    .fn()
    .mockImplementationOnce((question, cb) => cb(""))
    .mockImplementationOnce((question, cb) => cb(""))
    .mockImplementationOnce((question, cb) => cb(""))
    .mockImplementationOnce((quesiton, cb) =>
      cb("play 'This is the Best' by The Dudes")
    )
});

module.exports = readline;
