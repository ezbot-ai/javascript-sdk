/**
 * Checks if a link is a cross-domain link that should be tracked.
 * 
 * @param linkElement - The anchor element to check
 * @param allowedDomains - List of allowed domains for cross-domain tracking
 * @returns boolean indicating if this is a cross-domain link to an allowed domain
 */
export function isCrossDomainLink(
  linkElement: Readonly<HTMLAnchorElement | HTMLAreaElement>,
  allowedDomains: readonly string[]
): boolean {
  // Get the current location's hostname and port
  const currentHostname = window.location.hostname;
  const currentPort = window.location.port;

  // Create a URL object from the link's href
  try {
    const linkUrl = new URL(linkElement.href);

    // 1. Check if hostname and port on linkElement and location are a match
    const isSameDomain =
      linkUrl.hostname === currentHostname && linkUrl.port === currentPort;

    if (isSameDomain) {
      // 2. If they are a match, return false (no cross-domain linking needed)
      return false;
    }

    // 3. Check if the linkElement hostname is in the allowed list
    // 4 & 5. Check if the link's hostname is in the allowed domains list
    return allowedDomains.some((domain) => {
      // Remove protocol if present in the domain
      const cleanDomain = domain.replace(/^https?:\/\//, '');

      // Create a combined hostname:port string from the link URL for comparison
      const linkHostWithPort = linkUrl.port
        ? linkUrl.hostname + ':' + linkUrl.port
        : linkUrl.hostname;

      // Check if the link matches domain in various ways
      const exactMatch = linkHostWithPort === cleanDomain;
      const hostnameOnlyMatch = linkUrl.hostname === cleanDomain;
      const subdomainMatch =
        linkUrl.hostname.endsWith('.' + cleanDomain) ||
        (cleanDomain.includes(':') &&
          linkHostWithPort.endsWith(
            '.' + cleanDomain.split(':')[0] + ':' + cleanDomain.split(':')[1]
          ));

      return exactMatch || hostnameOnlyMatch || subdomainMatch;
    });
  } catch (e) {
    // If the href is invalid, return false
    return false;
  }
}

/**
 * Creates a cross-domain link checker function that only requires the linkElement parameter.
 * The allowed domains are captured in the closure.
 * 
 * @param allowedDomains - List of allowed domains for cross-domain tracking
 * @returns A function that takes only a linkElement and checks if it's a cross-domain link
 */
export function createCrossDomainLinkChecker(
  allowedDomains: readonly string[]
): (linkElement: Readonly<HTMLAnchorElement | HTMLAreaElement>) => boolean {
  return (linkElement: Readonly<HTMLAnchorElement | HTMLAreaElement>): boolean => {
    return isCrossDomainLink(linkElement, allowedDomains);
  };
}
