export class AsyncResource {
  runInAsyncScope(fn, thisArg, ...args) {
    return fn.apply(thisArg, args);
  }
}
