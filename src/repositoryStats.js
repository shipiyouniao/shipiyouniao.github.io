const cache = new Map();
const pending = new Map();
const ttl = 5 * 60 * 1000;

export async function fetchRepositoryStats(repo, force = false) {
  const previous = cache.get(repo);
  if (!force && previous && Date.now() - previous.checkedAt < ttl)
    return previous;
  if (pending.has(repo)) return pending.get(repo);
  const request = (async () => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch("https://api.github.com/repos/" + repo, {
        headers: { Accept: "application/vnd.github+json" },
        signal: controller.signal,
      });
      if (!response.ok) throw new Error("Repository data unavailable");
      const data = await response.json();
      if (
        !Number.isInteger(data.stargazers_count) ||
        !Number.isInteger(data.forks_count)
      ) {
        throw new Error("Invalid repository counters");
      }
      const result = {
        stars: data.stargazers_count,
        forks: data.forks_count,
        checkedAt: Date.now(),
      };
      cache.set(repo, result);
      return result;
    } finally {
      clearTimeout(timer);
    }
  })();
  pending.set(repo, request);
  try {
    return await request;
  } finally {
    pending.delete(repo);
  }
}
