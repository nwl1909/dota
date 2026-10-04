// Кэш ответов API: повторные заходы на страницу игрока открываются мгновенно,
// а одинаковые запросы, отправленные одновременно, объединяются в один.

const TTL = 10 * 60 * 1000; // 10 минут
const MAX_STORED_BYTES = 400_000; // большие ответы храним только в памяти
const PREFIX = "odc:";

type Entry = { ts: number; json: any };

const memory = new Map<string, Entry>();
const inflight = new Map<string, Promise<any>>();

export class HttpError extends Error {
  status: number;
  constructor(status: number) {
    super(`HTTP ${status}`);
    this.status = status;
  }
}

const normalize = (url: string) => url.replace(/\?$/, "");

// Кэшируем только данные игроков (они не зависят от того, кто вошёл в аккаунт)
const isCacheable = (url: string) => /\/api\/players\//.test(url);

const readStored = (key: string): Entry | null => {
  try {
    const raw = window.sessionStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as Entry) : null;
  } catch (e) {
    return null;
  }
};

const writeStored = (key: string, entry: Entry) => {
  try {
    const raw = JSON.stringify(entry);
    if (raw.length <= MAX_STORED_BYTES) {
      window.sessionStorage.setItem(PREFIX + key, raw);
    }
  } catch (e) {
    // хранилище заполнено или недоступно — не критично
  }
};

export const fetchJson = async (url: string, init: RequestInit = {}) => {
  if (!isCacheable(url)) {
    const res = await fetch(url, init);
    if (!res.ok || !res.status) throw new HttpError(res.status);
    return res.json();
  }

  const key = normalize(url);
  const now = Date.now();
  const hit = memory.get(key) || readStored(key);
  if (hit && now - hit.ts < TTL) {
    memory.set(key, hit);
    return hit.json;
  }
  const pending = inflight.get(key);
  if (pending) return pending;

  const run = (async () => {
    const res = await fetch(url, init);
    if (!res.ok || !res.status) throw new HttpError(res.status);
    const json = await res.json();
    const entry = { ts: Date.now(), json };
    memory.set(key, entry);
    writeStored(key, entry);
    return json;
  })();
  const clear = () => {
    inflight.delete(key);
  };
  inflight.set(key, run);
  run.then(clear, clear);
  return run;
};
