import React, { Component, cloneElement, Children } from 'react'

function cloneElementWithStoreProps(child, store) {
  const state = store.getState()
  const childExpectedProps = Object.keys(child.type.propTypes)

  let props = Object.assign({}, {
    dispatch : store.dispatch,
    store    : state
  }, child.props)

  childExpectedProps.forEach(prop => {
    if (state[prop]) props[prop] = state[prop]
  })

  return cloneElement(child, props)
}

export class NarwhalBinder extends Component {
  constructor (props) {
    if (!props.store) throw new Error (
      "Flux Binder expects a store property. If this isn't meant to be bound a store you may be looking for `React.Component`"
    )

    super(props)

    this.store = props.store
    this.dispatch = props.dispatch

    // curried unsubscribe method
    this.unsubscribe = this.store.subscribe(newState => this.handleUpdate(newState))
  }

  handleUpdate(newState) {
    this.forceUpdate()
  }

  componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe()
  }

  renderChildren () {
    return Children.map(this.props.children, child => {
      return cloneElementWithStoreProps(child, this.store)
    })
  }

  render () {
    return <span>{this.renderChildren()}</span>
  }
}