export const API_BASE = 'https://www.rijksmuseum.nl/api/en';
export const API_KEY_ENV = 'RIJKS_API_KEY';

export function buildUrl(path: string, params: Record<string, string | number> = {}) {
  const apiKey = process.env[API_KEY_ENV];
  const url = new URL(path.startsWith('http') ? path : `${API_BASE}/${path.replace(/^\//, '')}`);
  if (apiKey) url.searchParams.set('key', apiKey as string);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, String(v));
  }
  return url.toString();
}

export function hasApiKey(): boolean {
  return Boolean(process.env[API_KEY_ENV]);
}
