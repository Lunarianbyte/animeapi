import { getActiveBaseURL } from "./domain";

const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/119.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/17.0 Safari/605.1.15",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 Version/16.0 Mobile Safari/604.1",
];

const ACCEPT_LANGS = [
  "en-US,en;q=0.9",
  "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
  "en-GB,en;q=0.9",
];

const delay = (ms) =>
  new Promise((res) => setTimeout(res, ms));

const random = (arr) =>
  arr[Math.floor(Math.random() * arr.length)];

const randomDelay = () =>
  1000 + Math.random() * 2000;

const buildHeaders = (base) => ({
  "User-Agent": random(USER_AGENTS),
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  "Accept-Language": random(ACCEPT_LANGS),
  "Accept-Encoding": "gzip, deflate, br",
  Connection: "keep-alive",
  "Upgrade-Insecure-Requests": "1",
  Referer: base,
  DNT: "1",
  Cookie: `visited=1; session=${Math.random()
    .toString(36)
    .substring(2)}`,
});

const isBlocked = (html) => {
  if (!html) return true;
  const text = html.toLowerCase();

  return (
    text.includes("access denied") ||
    text.includes("forbidden") ||
    text.includes("cloudflare") ||
    text.includes("captcha") ||
    text.length < 500
  );
};

export const fetchHTML = async (path, retries = 5) => {
  let lastError;

  for (let i = 0; i < retries; i++) {
    const base = await getActiveBaseURL();
    const url = `${base}${path}`;

    try {
      const res = await fetch(url, {
        headers: buildHeaders(base),
        cache: "no-store",
      });

      const html = await res.text();

      if (!res.ok || isBlocked(html)) {
        throw new Error(`Blocked / Status ${res.status}`);
      }

      return html;
    } catch (err) {
      lastError = err;
    }

    await delay(randomDelay());
  }

  throw lastError;
};
