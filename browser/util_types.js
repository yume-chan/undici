export function isArrayBuffer (value) {
  return value instanceof ArrayBuffer
}

export function isSharedArrayBuffer (value) {
  return typeof SharedArrayBuffer !== 'undefined' && value instanceof SharedArrayBuffer
}

export function isAnyArrayBuffer (value) {
  return isArrayBuffer(value) || isSharedArrayBuffer(value)
}

export function isDataView (value) {
  return value instanceof DataView
}

export function isTypedArray (value) {
  return value instanceof Int8Array ||
    value instanceof Uint8Array ||
    value instanceof Uint8ClampedArray ||
    value instanceof Int16Array ||
    value instanceof Uint16Array ||
    value instanceof Int32Array ||
    value instanceof Uint32Array ||
    value instanceof Float32Array ||
    value instanceof Float64Array ||
    value instanceof BigInt64Array ||
    value instanceof BigUint64Array
}

export function isUint8Array (value) {
  return value instanceof Uint8Array
}

export function isProxy (value) {
  return false
}
