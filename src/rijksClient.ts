export const API_BASE = 'https://www.rijksmuseum.nl/api/en';
export const API_KEY_ENV = 'RIJKS_API_KEY';

export function buildUrl(path: string, params: Record<string, string | number> = {}, opts: { includeKey?: boolean } = {}) {
  const includeKey = opts.includeKey !== false;
  const apiKey = process.env[API_KEY_ENV];
  const url = new URL(path.startsWith('http') ? path : `${API_BASE}/${path.replace(/^\//, '')}`);
  if (includeKey && apiKey) url.searchParams.set('key', apiKey as string);
  if (!url.searchParams.has('format')) url.searchParams.set('format', 'json');
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, String(v));
  }
  return url.toString();
}

export function hasApiKey(): boolean {
  return Boolean(process.env[API_KEY_ENV]);
}
