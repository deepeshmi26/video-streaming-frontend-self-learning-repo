# 🧩 Chapter 09 — State Management Decisions

## ⚙️ Context vs Global Store

**React Context**
- Best for rarely changing global data (theme, locale, authentication state).
- Built-in, lightweight, and has no external dependencies.
- But causes all consumers to re-render when the value changes.
- Works well for static UI-level data but not for rapidly changing state.

**Global Store (Zustand / Redux)**
- Designed for shared, dynamic data like video playback, buffering, preferences, and analytics.
- Components re-render only when the specific subscribed data changes.
- Supports middleware for persistence, logging, or async operations.

**My Doubt:**  
> “If Zustand or Redux can do everything Context can — and more — why not just use them everywhere?”

**Answer:**  
You *can*, but it adds unnecessary complexity. Context is extremely lightweight, requires no external setup, and is ideal when the data barely changes. Zustand shines when performance or modularity matters.  
Using Zustand for theme data is like using a sledgehammer to push a pin — it works but isn’t worth the setup.

**Decision:**  
- Keep static UI data (theme, locale) in Context.  
- Keep fast-changing, cross-component state (playback, buffering, preferences) in Zustand.

---

## 🥊 Redux vs Zustand

**Redux**
- Uses a strict pattern of actions and reducers to modify state.
- Excellent for debugging and time-travel (you can replay state changes).
- Predictable and scalable for large teams.
- But has a steep learning curve and a lot of boilerplate.
- React components re-render more frequently unless memoized carefully.

**Zustand**
- Minimal API — a store is just a function returning state and actions.
- Uses a subscription model, so only components using changed slices re-render.
- Simpler mental model — direct mutations inside `set()` are allowed.
- Built-in persistence and middleware support (`persist`, `subscribe`, `devtools`).
- Extremely performant, small footprint, and flexible architecture.

**Beyond simplicity — real reasons for choosing Zustand:**
1. **Performance**: selective subscriptions prevent wasteful re-renders.  
2. **Scalability**: multiple isolated stores instead of one giant reducer tree.  
3. **Developer Velocity**: no action types or reducers — code directly in hooks.  
4. **Adaptability**: fits functional React patterns better than Redux’s traditional structure.

**Decision:**  
Use **Zustand** — it’s faster, cleaner, modular, and naturally fits modern React app design.

---

## 💡 Summary

- `useState` → Local component-only state  
- `useContext` → Global static UI state  
- `Zustand` → Dynamic global or feature state  
- `Redux` → Enterprise-scale predictability and debugging power  

**Final Choice for This Project**
- **Theme / Locale** → React Context  
- **Video Playback / Buffering / Preferences** → Zustand  