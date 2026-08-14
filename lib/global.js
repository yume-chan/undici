'use strict'

// We include a version number for the Dispatcher API. In case of breaking changes,
// this version number must be increased to avoid conflicts.
const globalDispatcher = Symbol.for('undici.globalDispatcher.2')
const legacyGlobalDispatcher = Symbol.for('undici.globalDispatcher.1')
const { InvalidArgumentError } = require('./core/errors')
const Agent = require('./dispatcher/agent')
const Dispatcher1Wrapper = require('./dispatcher/dispatcher1-wrapper')

// Fallback storage for when globalThis is not extensible (e.g. frozen)
let fallbackDispatcher

function setGlobalDispatcher (agent) {
  if (!agent || typeof agent.dispatch !== 'function') {
    throw new InvalidArgumentError('Argument agent must implement Agent')
  }

  fallbackDispatcher = agent
}

function getGlobalDispatcher () {
  return fallbackDispatcher
}

module.exports = {
  setGlobalDispatcher,
  getGlobalDispatcher,
}
