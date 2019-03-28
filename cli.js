const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const close = () => rl.close();

const parseInput = (input, validCommands) =>
  [input.trim()]
    .map(input => input.match(/(?<cmd>[a-z]+)\s*(?<args>.*)/))
    .map(result => (result !== null ? result : { groups: [] }))
    .map(({ groups }) => ({
      cmd: validCommands.filter(cmd => cmd === groups.cmd)[0],
      args: groups.args ? groups.args : undefined
    }))[0];

const nextInput = async (validCommands = []) => {
  const asyncQuestion = question =>
    new Promise(resolve => {
      rl.question(question, answer => {
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

module.exports = { parseInput, nextInput, close, rl };
