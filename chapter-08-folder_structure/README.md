# 📘 Frontend Folder & Component Design Decision Guide

A reference guide to decide **where code belongs** and **how generic to make components**  
when designing scalable frontend architecture.

---

## 🧱 Folder Roles

**`shared/`** — Generic, domain-agnostic building blocks usable anywhere  
Examples: `Button`, `Modal`, `useDebounce`, `formatTime`

**`features/`** — Domain-specific, reusable functionality that represents *what the app can do*  
Examples: `player/`, `auth/`, `comments/`, `catalog/`, `dashboard/`

**`pages/`** — Route-level compositions that combine multiple features into a complete screen  
Examples: `PlayerPage.js`, `CatalogPage.js`, `DashboardPage.js`

---

## 🧠 Common Confusions (and Answers)

**When should I create a folder for a page?**  
→ When the page starts to have its own hooks, API calls, or subcomponents.  
Start small as a file, promote to a folder when it grows.

**If something is reused, why not put it in `shared/`?**  
→ Because *reused* does not always mean *generic*.  
If it carries business or design meaning (like “Player” or “Auth”), it belongs in `features/`.  
If it’s a plain helper or UI element (like “Button”, “Loader”), it belongs in `shared/`.

**What if two pages use the same feature slightly differently?**  
→ Keep it in `features/`. Use props or hooks for variation.  
`features/` = reusable *capabilities*, not one-off implementations.

**How do I avoid circular dependencies?**  
→ `shared/` can be imported anywhere.  
→ `features/` can import from `shared/`.  
→ `pages/` can import from both.  
→ Never import from `pages/` inside `features/` or `shared/`.
- Make use of linting rules

---

## 🧩 Component Reuse Decisions

**Two sections look visually same, but differ in behavior — should I create one generic or two components?**

If the difference is only in display or minor rendering → make one generic component with a `renderValue` prop.  
If behavior or logic diverges → create two separate components, possibly sharing a base layout.

---

## 💭 Decision-Based Summary

1. If the component or hook can be copied into another app and still make sense → put it in **`shared/`**.  
2. If it represents a business capability or has domain meaning → put it in **`features/`**.  
3. If it’s specific to a route or layout → keep it in **`pages/`**.  
4. If a page grows beyond 150 lines or needs local hooks/components → convert it into a **page folder**.  
5. If the structure is identical but visuals differ → make it **generic with props**.  
6. If the logic diverges and variation starts to add complexity → **split into separate components**.  
7. If you find yourself adding flags like `isLink`, `isEditable`, `isInline` — that’s a red flag; it’s time to split.  
8. Always keep `shared/` independent, `features/` composable, and `pages/` lightweight.  
9. When unsure, ask:  
   - “Can this exist outside the project?” → `shared/`  
   - “Does this describe a feature of the product?” → `features/`  
   - “Does this represent a screen in the app?” → `pages/`

---

## 🧭 Golden Rules

> **If it’s generic → `shared/`**  
> **If it’s domain-specific → `features/`**  
> **If it’s route-specific → `pages/`**

> **If structure same → make generic**  
> **If behavior diverges → split**

---