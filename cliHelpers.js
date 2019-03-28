const parseInput = (input, validCommands) =>
  [input.trim()]
    .map(input => input.match(/(?<cmd>[a-z]+)\s*(?<args>.*)/))
    .map(result => (result !== null ? result : { groups: [] }))
    .map(({ groups }) => ({
      cmd: validCommands.filter(cmd => cmd === groups.cmd)[0],
      args: groups.args ? groups.args : undefined
    }))[0];

const nextInput = async (validCommands = [], rlInterface) => {
  if (!rlInterface || !rlInterface.question) {
    throw Error("Readline interface not provided.");
  }

  const asyncQuestion = question =>
    new Promise(resolve => {
      rlInterface.question(question, answer => {
        resolve(answer.toString().trim());
      });
    });

  if (!Array.isArray(validCommands)) {
    throw Error(
      "nextInput(): `commands` argument must be an array of valid command strings."
    );
  }

  if (validCommands.length === 0) {
    console.warn("nextInput(): `commands` list of valid commands is empty.");
  }

  const input = await asyncQuestion("> ");
  return parseInput(input, validCommands);
};

module.exports = { parseInput, nextInput };
