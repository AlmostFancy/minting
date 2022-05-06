export function shortenAddress(str?: string) {
    if (!str) {
      return 'n/a';
    }
    return str.substring(0, 6) + '...' + str.substring(str.length - 4)
};