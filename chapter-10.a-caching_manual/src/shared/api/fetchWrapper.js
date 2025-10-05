import { useState, useEffect } from "react";

// --- In-memory cache ---
const IN_MEMORY_CACHE = new Map();
const CACHE_EXPIRATION_TIME = 60 * 1000; // 1 minute

// Generate unique cache key
const cacheKeyGenerator = (url, options) => `${url}-${JSON.stringify(options)}`;

/**
 * Fetch wrapper with optional caching and cancellation
 */
export const fetchWrapper = async (
  url,
  options = {},
  { cache = false, signal, invalidateCache = false } = {}
) => {
  const now = Date.now();
  const cacheKey = cacheKeyGenerator(url, options);

  // 1️⃣ Check in-memory cache
  if (cache && IN_MEMORY_CACHE.has(cacheKey)) {
    const cached = IN_MEMORY_CACHE.get(cacheKey);
    if (now - cached.timestamp < CACHE_EXPIRATION_TIME) {
      return cached.data;
    }
    IN_MEMORY_CACHE.delete(cacheKey);
  }

  // 2️⃣ Check localStorage cache
  if (cache && localStorage.getItem(cacheKey)) {
    try {
      const cached = JSON.parse(localStorage.getItem(cacheKey));
      if (now - cached.timestamp < CACHE_EXPIRATION_TIME) {
        IN_MEMORY_CACHE.set(cacheKey, cached);
        return cached.data;
      }
      localStorage.removeItem(cacheKey);
    } catch {
      localStorage.removeItem(cacheKey);
    }
  }

  // 3️⃣ Actual fetch
  try {
    const response = await fetch(url, { ...options, signal });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP ${response.status}: ${text}`);
    }

    const data = await response.json();

    if (cache && !invalidateCache) {
      const entry = { data, timestamp: now };
      IN_MEMORY_CACHE.set(cacheKey, entry);
      try {
        localStorage.setItem(cacheKey, JSON.stringify(entry));
      } catch {
        console.warn("localStorage full, skipping cache");
      }
    }

    return data;
  } catch (err) {
    if (err.name === "AbortError") {
      console.log("Fetch aborted:", url);
      return;
    }
    throw err;
  }
};

/**
 * useQuery – handles GET (or cached) requests
 */
export const useQuery = (url, options = {}, config = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchWrapper(url, options, {
          cache: config.cache ?? true,
          signal: controller.signal,
        });
        if (result !== undefined) setData(result);
      } catch (err) {
        if (err.name !== "AbortError") setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // ✅ Abort ongoing request on unmount or re-run
    return () => controller.abort();
  }, [url, JSON.stringify(options)]);

  const refetch = () => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    fetchWrapper(url, options, {
      cache: false,
      signal: controller.signal,
      invalidateCache: true,
    })
      .then((r) => r && setData(r))
      .catch((err) => {
        if (err.name !== "AbortError") setError(err);
      })
      .finally(() => setLoading(false));
  };

  return { data, loading, error, refetch };
};

/**
 * useMutation – handles POST/PUT/DELETE requests
 */
export const useMutation = (url, options = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [controller, setController] = useState(null); // Track AbortController

  const mutate = async (body, { cache = false } = {}) => {
    const abortController = new AbortController();
    setController(abortController);
    setLoading(true);
    setError(null);

    try {
      const response = await fetchWrapper(
        url,
        {
          ...options,
          method: options.method || "POST",
          headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
          },
          body: JSON.stringify(body),
        },
        { cache, signal: abortController.signal }
      );

      return response;
    } catch (err) {
      if (err.name !== "AbortError") setError(err);
    } finally {
      setLoading(false);
      setController(null);
    }
  };

  const abort = () => {
    if (controller) {
      controller.abort();
      setController(null);
      setLoading(false);
    }
  };

  return { mutate, loading, error, abort };
};
