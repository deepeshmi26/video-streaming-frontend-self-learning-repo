Chapter 10.b - Caching with library like rtk or tanstack
RTK Query vs TanStack Query

Both RTK Query and TanStack Query (React Query) help with API calls, caching, and keeping your UI in sync with the server.
They offer features like cache invalidation, background refetching, error handling, data transformation, and stale time — but they work differently under the hood.

The core technichal difference in rtk query and redux toolkit is:
a. RTK Query is built on top of Redux Toolkit, so all API data lives in the Redux store.
b. TanStack Query doesn’t depend on Redux. Each feature can manage its own cache and fetching logic.

As, Rtk Query is build on top of redux toolkit:
a. This makes it great for apps where different parts share data or need to stay in sync.
b. Its tag-based invalidation system also makes global updates easy.
c. However, since everything goes through one shared store, large apps or multiple teams touching the same store can run into conflicts.

As Tanstack Query dosent depend on Redux
a. This makes it ideal for apps that are modular, feature-based, or built by multiple teams working independently.
b. It also supports server-side rendering (SSR) out of the box.
c. The tradeoff is that different features can’t automatically invalidate or update each other’s data — you need to handle that manually.

In short:

Use RTK Query for shared, tightly connected apps.
Use TanStack Query for independent, modular, or SSR-heavy apps.