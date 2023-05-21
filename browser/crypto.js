import JsSha from 'jssha';

export function randomBytes(length) {
  const buffer = Buffer.alloc(length);
  globalThis.crypto.getRandomValues(buffer);
  return buffer;
}

export function createHash(algorithm) {
  return new Hash(algorithm);
}

class Hash {
  #sha

  constructor(algorithm) {
    this.#sha = new JsSha(algorithm, "UINT8ARRAY");
  }

  update(data) {
    this.#sha.update(data);
  }

  digest() {
    return Buffer.from(this.#sha.getHash("ARRAYBUFFER"));
  }
}

export function getHashes() {
  return ["sha256", "sha384", "sha512"];
}
