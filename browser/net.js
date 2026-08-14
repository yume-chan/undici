const IPV4Regex = /^(?:\d{1,3}\.){3}\d{1,3}$/;
export const isIPv4 = (host) =>
  IPV4Regex.test(host);

const IPV6Regex = /^([\dA-Fa-f]{1,4}:){7}[\dA-Fa-f]{1,4}$/;
export const isIPv6 = (host) =>
  IPV6Regex.test(host);

export const isIP = (host) => {
  if (isIPv4(host)) {
    return 4;
  }
  if (isIPv6(host)) {
    return 6;
  }
  return 0;
};
