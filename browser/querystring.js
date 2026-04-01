export function stringify(object) {
  return new URLSearchParams(object).toString();
}

export function unescape(string) {
  return decodeURIComponent(string);
}
