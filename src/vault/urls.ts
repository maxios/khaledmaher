/** True for anything that doesn't point into the vault: `https:`, `mailto:`, `#x`, `/x`. */
export function isExternalUrl(url: string): boolean {
  return /^[a-z][a-z0-9+.-]*:/i.test(url) || url.startsWith('#') || url.startsWith('/');
}

export function safeDecode(url: string): string {
  try {
    return decodeURI(url);
  } catch {
    return url;
  }
}

export function withBase(url: string, base: string): string {
  return `${base.replace(/\/$/, '')}${url}`;
}
