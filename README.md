# Music Collection Challenge

## Implementation Overview

This is a mock music collection CLI. It uses the core package `readline` to prompt the user for information, and to write out to the console. 

In implementing this program, I used functinal instead of OO patterns. The program state is managed in a single object `state`; that state is updated by a `stateReducer` that matches action objects to updater functions that know how to change the state based on a given action. 

The `stateReducer` function is created by a factory function `getStateReducer` that takes a map whose keys are action names and whose values are updater functions.

A simple example of follows: 

```javascript
let _state = {
  albums: [],
  shouldQuit: false,
};

const quit = (state, action) => ({
  ...state,
  shouldQuit: true,
});

const reducer = getStateReducer({ quit });

_state = reducer({ type: quit })

// At this point the state would be:
// { albums: [], shouldQuit: true }
```

All the logic of the program is therefore located in the updater or action functions. They are in `actions.js`. The main script `music` then just holds the state, instantiates the reducer, and contains a function `run` that directs the process of getting user input, updating the state, and flushing out any output.

This implementation is obviously inspired by the way Redux manages actions. I took this approach because I think it is easy to think about and test. All you need to do to test the state changes is write tests on the data that each action function returns.

## Installation

To setup you need to be using Node v11.6.0. Then you can just running

```
npm install
```

To run the program you do: `./music`.

To run the tests you do `npm run test`.
