import { getActiveBaseURL } from "./domain";

const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/119.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/17.0 Safari/605.1.15",
];

const PROXIES = [
  (url) =>
    `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url) =>
    `https://corsproxy.io/?${encodeURIComponent(url)}`,
];

const getRandom = (arr) =>
  arr[Math.floor(Math.random() * arr.length)];

const delay = (ms) =>
  new Promise((res) => setTimeout(res, ms));

export const fetchHTML = async (path, retries = 3) => {
  let lastError;

  for (let i = 0; i < retries; i++) {
    const base = await getActiveBaseURL();
    const url = `${base}${path}`;

    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": getRandom(USER_AGENTS),
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
          Referer: base,
        },
        cache: "no-store",
      });

      if (!res.ok) throw new Error(`Status ${res.status}`);

      return await res.text();
    } catch (err) {
      lastError = err;

      try {
        const proxyUrl = getRandom(PROXIES)(url);

        const res = await fetch(proxyUrl, {
          headers: {
            "User-Agent": getRandom(USER_AGENTS),
          },
        });

        if (!res.ok) throw new Error(`Proxy ${res.status}`);

        return await res.text();
      } catch (proxyErr) {
        lastError = proxyErr;
      }
    }

    await delay(500 + Math.random() * 1000);
  }

  throw lastError;
};
