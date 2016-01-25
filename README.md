# Narwhal
## A unicorn of the ocean. Also a tiny Redux inspired framework.

A slightly different take on the single state tree. I'd like to emphasize it's a work in progress.

### Why use Narwhal?

- Less wiring up for React components.
- It's tiny. Really small. Really.
- Simple implementation.

### Getting it working

1. Actions
  `actions.js`
  ```
  export const increment = () => ({type: 'INCREMENT'});
  export const decrement = () => ({type: 'DECREMENT'});
  ```

1. Action handler
  `action-handler.js`
  ```
  export default function (state, action) { // declare the application action handler
    switch(action.type) {
      case('INCREMENT'):
        return ++state;

      case('DECREMENT'):
        return --state;

      default:
        return state;
    }
  }
  ```

3. Main file
  `index.js`
  ```
  import { createStore } from 'narwhal'; // import narwhal
  import handler from './action-handler.js'; // import actions

  let count = 0;

  const store = createStore(count, handler); // create the application store
  ```

4. Do stuff!
  You now have your action methods at your disposal.
  ```
  import { increment, decrement } from 'actions';
  store.dispatch(increment())
  store.subscribe(data => console.log(data))
  ```

  Narwhal comes packed with a ReactJS binder.
  `component.js`
  ```
  import React, { Component } from 'react';
  import { increment, decrement } from './actions';


  export default class MyComponent extends Component {
    render() {
      return (
        <div>
          {this.props.store.getState()}

          <button onClick={() => this.props.dispatch(increment())}>+1</button>
          <button onClick={() => this.props.dispatch(decrement())}>-1</button>
        </div>
      );
    }
  }
  ```

  `index.js`
  ```
  import ReactDOM, { render } from 'react-dom';
  import { NarwhalBinder } from 'narwhal/react';
  import MyComponent from './component';
  ...
  // store defined earlier
  render((
    <NarwhalBinder store={store}>
      <MyComponent />
    </NarwhalBinder>
  ), targetDomNode);
  ```

### Store API
- `narwhal.createStore(initialData, actionHandler)`

  Returns a store instance

  | Property      | Description                                   | Required |
  |---------------|-----------------------------------------------|----------|
  | initialData   | Starting point for your store                 |          |
  | actionHandler | The handler function to modify your app state | yes      |

- `storeInstance.getState()`

  Get the current state of the store. Remember - the store should be treated as immutable, and any mutations made to data returned by `getState` will be lost when the next action is applied.

- `storeInstance.dispatch(action)`

  Finds the corresponding action in your `action handler` and runs it against the store. Make sure to add a `action.type` and any required data inside the `action` payload.

- `storeInstance.subscribe(callback)`

  Subscribe to store changes.

### @todo
- Schmick logo
- Add compose function to join action handlers.
- Write proper documentation
- Better demos
- God damned unit tests
- Allow composition of action handler functions
- ~~Todo MVC (halfway there)~~ https://github.com/nigel-sirisomphone/narwhal-todo-mvc
- Experiment with non React views
- Improve binder re-rendering to only trigger when store state is different (need deep dif)
- performance testing
