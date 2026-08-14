export function stringify(object) {
  return new URLSearchParams(object).toString();
}
