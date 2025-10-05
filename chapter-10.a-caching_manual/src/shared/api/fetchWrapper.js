// src/utils/fetchWrapper.js
import { useState, useEffect, useRef } from "react";

/* -------------------------------------------------------------------------- */
/*                             Cache Configuration                            */
/* -------------------------------------------------------------------------- */

const IN_MEMORY_CACHE = new Map();
const IN_FLIGHT_REQUESTS = new Map();
const CACHE_EXPIRATION_TIME = 60 * 1000; // 1 minute
const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 mins

/* -------------------------------------------------------------------------- */
/*                               Event Emitter                                */
/* -------------------------------------------------------------------------- */
const QueryEventBus = {
  listeners: new Map(),

  subscribe(key, callback) {
    if (!this.listeners.has(key)) this.listeners.set(key, new Set());
    this.listeners.get(key).add(callback);
    return () => this.listeners.get(key)?.delete(callback);
  },

  emit(key) {
    if (this.listeners.has(key)) {
      for (const cb of this.listeners.get(key)) cb();
    }
  },
};

/* -------------------------------------------------------------------------- */
/*                              Cache Management                              */
/* -------------------------------------------------------------------------- */
const cacheKeyGenerator = (url, options) => `${url}-${JSON.stringify(options)}`;

const CacheManager = {
  get(cacheKey) {
    const now = Date.now();
    const entry = IN_MEMORY_CACHE.get(cacheKey);
    if (entry && now - entry.timestamp < entry.ttl) {
      return entry.data;
    }
    this.invalidate(cacheKey);
    return null;
  },

  set(cacheKey, data, ttl = CACHE_EXPIRATION_TIME) {
    const now = Date.now();
    IN_MEMORY_CACHE.set(cacheKey, { data, timestamp: now, ttl });
    localStorage.setItem(
      cacheKey,
      JSON.stringify({ data, timestamp: now, ttl })
    );
  },

  invalidate(cacheKey) {
    IN_MEMORY_CACHE.delete(cacheKey);
    localStorage.removeItem(cacheKey);
  },

  cleanup() {
    const now = Date.now();
    for (const [key, value] of IN_MEMORY_CACHE.entries()) {
      if (now - value.timestamp > value.ttl) {
        IN_MEMORY_CACHE.delete(key);
        localStorage.removeItem(key);
      }
    }
  },
};

// run cleanup every few minutes
setInterval(() => CacheManager.cleanup(), CLEANUP_INTERVAL);

/* -------------------------------------------------------------------------- */
/*                                Fetch Wrapper                               */
/* -------------------------------------------------------------------------- */
export const fetchWrapper = async (
  url,
  options = {},
  { cache = true, ttl = CACHE_EXPIRATION_TIME, forceRefresh = false } = {}
) => {
  const cacheKey = cacheKeyGenerator(url, options);
  const now = Date.now();

  // 1️⃣ Return from cache if valid and not forced
  if (cache && !forceRefresh) {
    const cached = CacheManager.get(cacheKey);
    if (cached) return cached;

    const local = localStorage.getItem(cacheKey);
    if (local) {
      const parsed = JSON.parse(local);
      if (now - parsed.timestamp < parsed.ttl) {
        CacheManager.set(cacheKey, parsed.data, parsed.ttl);
        return parsed.data;
      }
    }
  }

  // 2️⃣ Deduplication — share ongoing promise
  if (IN_FLIGHT_REQUESTS.has(cacheKey)) {
    return IN_FLIGHT_REQUESTS.get(cacheKey);
  }

  // 3️⃣ Perform network call
  const controller = new AbortController();
  const fetchPromise = fetch(url, { ...options, signal: controller.signal })
    .then(async (res) => {
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      if (cache) CacheManager.set(cacheKey, data, ttl);
      return data;
    })
    .finally(() => IN_FLIGHT_REQUESTS.delete(cacheKey));

  IN_FLIGHT_REQUESTS.set(cacheKey, fetchPromise);
  return fetchPromise;
};

/* -------------------------------------------------------------------------- */
/*                                useQuery Hook                               */
/* -------------------------------------------------------------------------- */
export const useQuery = (
  url,
  options = {},
  {
    cache = true,
    ttl,
    forceRefresh = false,
    staleTime = 30000,
    backgroundRefetch = "once", // "once" | "interval"
  } = {}
) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  const cacheKey = cacheKeyGenerator(url, options);

  const fetchData = async (manualRefresh = false) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchWrapper(url, options, {
        cache,
        ttl,
        forceRefresh: manualRefresh,
      });
      if (mountedRef.current) setData(result);

      // 4️⃣ Background Refetch
      if (cache && staleTime) {
        if (backgroundRefetch === "once") {
          setTimeout(() => {
            fetchWrapper(url, options, {
              cache: true,
              forceRefresh: true,
            }).then((updated) => {
              if (
                mountedRef.current &&
                JSON.stringify(updated) !== JSON.stringify(result)
              ) {
                setData(updated);
              }
            });
          }, staleTime);
        } else if (backgroundRefetch === "interval") {
          const interval = setInterval(async () => {
            const updated = await fetchWrapper(url, options, {
              cache: true,
              forceRefresh: true,
            });
            if (
              mountedRef.current &&
              JSON.stringify(updated) !== JSON.stringify(data)
            ) {
              setData(updated);
            }
          }, staleTime);
          return () => clearInterval(interval);
        }
      }
    } catch (err) {
      if (mountedRef.current) setError(err);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    fetchData();

    // Subscribe for invalidation events
    const unsubscribe = QueryEventBus.subscribe(cacheKey, () => {
      fetchData(true);
    });

    return () => {
      mountedRef.current = false;
      unsubscribe();
    };
  }, [url, JSON.stringify(options), forceRefresh]);

  return {
    data,
    loading,
    error,
    refetch: () => fetchData(true),
  };
};

/* -------------------------------------------------------------------------- */
/*                               useMutation Hook                             */
/* -------------------------------------------------------------------------- */
export const useMutation = (url, options = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const controllerRef = useRef(null);

  const mutate = async (body, { cache = false } = {}) => {
    const controller = new AbortController();
    controllerRef.current = controller;
    setLoading(true);
    setError(null);

    try {
      const result = await fetchWrapper(
        url,
        {
          ...options,
          method: options.method || "POST",
          headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
          },
          body: JSON.stringify(body),
          signal: controller.signal,
        },
        { cache, forceRefresh: true }
      );
      return result;
    } catch (err) {
      if (err.name !== "AbortError") setError(err);
    } finally {
      setLoading(false);
      controllerRef.current = null;
    }
  };

  const abort = () => {
    if (controllerRef.current) controllerRef.current.abort();
  };

  return { mutate, loading, error, abort };
};

/* -------------------------------------------------------------------------- */
/*                            Cache Invalidation API                          */
/* -------------------------------------------------------------------------- */
export const invalidateCache = (url, options = {}) => {
  const cacheKey = cacheKeyGenerator(url, options);
  CacheManager.invalidate(cacheKey);
  QueryEventBus.emit(cacheKey); // Notify subscribers to refetch
};
