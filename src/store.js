/**
 * @param  {Function}
 * @param  {*}
 * @return {Object}
 */
export default function (initialState, actionHandler) {
  let state
  let listeners = []

  // halt if actionHandler isn't a function
  if (typeof actionHandler !== 'function') throw new Error(
    'Expected action handler to be a function'
  )

  // check this the long way, as some falsy values are still
  // technically a valid store
  state = (typeof initialState === 'undefined' || initialState === null)
    // @todo does actionHandler need to be called with an empty object?
    ? actionHandler({type: null})
    : initialState

  /**
   * @return {*} Returns the current state of the store
   */
  function getState() {
    // Always return a clone so the state cannot be mutated
    //
    // @todo research any effects of js object comparisons, and
    //       react comparing or merging props and not having
    //       reference to the same object
    return Object.assign({}, state)
  }

  /**
   * @param  {Object}
   */
  function dispatch(action) {
    // try to apply action handlers mutations
    state = actionHandler(getState(), action) || state

    processListenerQueue()
  }

  /**
   * @param  {Function} listener    A callback to run when store state updates
   * @return {Function}             Curried unsubscribe function
   */
  function subscribe(listener) {
    if (typeof listener !== 'function') throw new Error(
      'Expected subscribe callback to be a function'
    )

    // push callback to the queue
    listeners.push(listener)

    // return an unsubscribe function with the reference to the callback
    return () => unsubscribe(listener)
  }

  /**
   * @param  {Function}
   */
  function unsubscribe(listener) {
    // filter out functions which don't match the callback we want to remove
    // @todo test the shit out of this
    listeners.filter(item => item !== listener)
  }

  function processListenerQueue() {
    listeners.forEach(listener => listener(state))
  }

  return {getState, dispatch, subscribe}
}