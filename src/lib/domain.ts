const FALLBACKS = [
  "https://otakudesu.blog",
  "https://otakudesu.cloud",
  "https://otakudesu.lol",
];

const ENV_BASE = process.env.BASEURL;

export const BASE_URLS = ENV_BASE
  ? [ENV_BASE, ...FALLBACKS.filter((b) => b !== ENV_BASE)]
  : FALLBACKS;

let cachedBase: string | null = null;
let lastChecked = 0;
const CACHE_TTL = 1000 * 60 * 5;

const isAlive = async (url: string) => {
  try {
    const res = await fetch(url, {
      method: "HEAD",
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
      cache: "no-store",
    });

    return res.ok;
  } catch {
    return false;
  }
};

export const getActiveBaseURL = async (): Promise<string> => {
  const now = Date.now();

  if (cachedBase && now - lastChecked < CACHE_TTL) {
    return cachedBase;
  }

  for (const base of BASE_URLS) {
    const alive = await isAlive(base);
    if (alive) {
      cachedBase = base;
      lastChecked = now;
      return base;
    }
  }

  cachedBase = BASE_URLS[0];
  lastChecked = now;

  return cachedBase;
};
