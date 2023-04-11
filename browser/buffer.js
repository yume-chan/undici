export const atob = globalThis.atob;

export const btoa = globalThis.btoa;

export const Blob = globalThis.Blob;

export const File = globalThis.File;

export function resolveObjectURL() {
  throw new Error("Not implemented");
}

export { Buffer, kMaxLength } from 'node-buffer';
