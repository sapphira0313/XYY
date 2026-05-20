const ENGINE_ALIASES: Record<string, string> = {
  b: 'baidu',
  baidu: 'baidu',
  g: 'google',
  google: 'google',
  bing: 'bing',
  ddg: 'duckduckgo',
  duck: 'duckduckgo',
  duckduckgo: 'duckduckgo',
};

export function looksLikeUrl(input: string): boolean {
  const value = input.trim();
  if (!value || /\s/.test(value)) return false;
  if (/^(mailto:|file:)/i.test(value)) return true;
  if (/^https?:\/\//i.test(value)) return true;
  if (/^localhost(:\d+)?(\/.*)?$/i.test(value)) return true;
  
  const ipWithOptionalPort = /^(?:\d{1,3}\.){3}\d{1,3}(?::\d+)?(?:\/.*)?$/;
  if (ipWithOptionalPort.test(value)) return true;
  
  const domainLike = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+(?::\d+)?(?:\/.*)?$/i;
  return domainLike.test(value);
}

export function toUrl(input: string): string {
  const value = input.trim();
  if (/^(mailto:|file:)/i.test(value)) return value;
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value}`;
}

export function parseEngineOverride(input: string): { engineKey?: string; query: string } {
  const value = input.trim();
  if (!value) return { query: '' };

  const patterns = [
    /^([a-z]+)\s*:\s*(.+)$/i,
    /^([a-z]+)\s+(.+)$/i,
  ];

  for (const pattern of patterns) {
    const match = value.match(pattern);
    if (match) {
      const alias = match[1].toLowerCase();
      const engineKey = ENGINE_ALIASES[alias];
      if (engineKey) {
        return { engineKey, query: match[2].trim() };
      }
    }
  }

  return { query: value };
}
