import * as types from './util_types'

export { types }

function inspect () {}

inspect.custom = {
  custom: Symbol('nodejs.util.inspect.custom')
}

export { inspect }

export function debuglog () {
  const log = () => {}
  log.enabled = false
  return log
}
