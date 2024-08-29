import EventEmitter from "events";

class Zlib extends EventEmitter {
  #format;
  #stream;
  #writer;
  #writing = 0;
  /** @type {(()=>void)|undefined} */
  #flush;

  /**
   * @param {CompressionFormat} format
   */
  constructor(format) {
    super();

    this.#stream = new DecompressionStream(format);
    this.#writer = this.#stream.writable.getWriter();
    this.#stream.readable
      .pipeTo(
        new WritableStream({
          write: async (chunk) => {
            this.emit("data", chunk);
          },
        }),
      )
      .catch((e) => {
        this.emit("error", e);
      });
  }

  async write(chunk) {
    this.#writing += 1;
    await this.#writer.write(chunk);
    this.#writing -= 1;
    if (this.#writing === 0) {
      this.#flush?.();
    }
  }

  async flush(callback) {
    if (this.#writing === 0) {
      callback();
    } else {
      this.#flush = callback;
    }
  }
}

export function createGunzip() {
  return new Zlib("gzip");
}

export const constants = {
  Z_SYNC_FLUSH: 0,
};

export function createInflate() {
  return new Zlib("deflate");
}

export function createBrotliDecompress() {
  throw new Error("Brotli is not supported in the browser");
}

export function createInflateRaw() {
  return new Zlib("deflate-raw");
}

export const Z_DEFAULT_WINDOWBITS = 0;
