Chapter 10.a — Manual Caching Strategies

Goal: Understand and implement caching logic without any library.

You’ll implement:
	•	In-memory caching (JS object or Map)
	•	LocalStorage caching (with expiration)
	•	IndexedDB caching (for heavier data — optional)
	•	Manual invalidation and re-fetching logic

Core focus areas:
	•	When to store data
	•	How to expire cache
	•	Detect stale data
	•	Manually revalidate (e.g., via timestamp or version)

Tech stack:
React + Axios (no React Query or RTK)