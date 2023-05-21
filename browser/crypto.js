import JsSha from "jssha";

export function randomBytes(length) {
  const buffer = Buffer.alloc(length);
  globalThis.crypto.getRandomValues(buffer);
  return buffer;
}

export function createHash(algorithm) {
  return new Hash(algorithm);
}

class Hash {
  #sha;

  constructor(algorithm) {
    switch (algorithm) {
      case "sha1":
        algorithm = "SHA-1";
        break;
      case "sha256":
        algorithm = "SHA-256";
        break;
      case "sha384":
        algorithm = "SHA-384";
        break;
      case "sha512":
        algorithm = "SHA-512";
        break;
    }
    this.#sha = new JsSha(algorithm, "UINT8ARRAY");
  }

  update(data) {
    this.#sha.update(Buffer.from(data));
    return this;
  }

  digest(encoding) {
    const buffer = Buffer.from(this.#sha.getHash("ARRAYBUFFER"));
    if (encoding) {
      return buffer.toString(encoding);
    } else {
      return buffer;
    }
  }
}

export function getHashes() {
  return ["sha1", "sha256", "sha384", "sha512"];
}
