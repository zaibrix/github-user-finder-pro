<div align="center">

# GitHub User Finder — Pro

[![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React Router](https://img.shields.io/badge/React_Router-v6-CA4245?style=flat-square&logo=react-router&logoColor=white)](https://reactrouter.com/)
[![GitHub API](https://img.shields.io/badge/GitHub_REST_API-v3-181717?style=flat-square&logo=github&logoColor=white)](https://docs.github.com/en/rest)
[![License](https://img.shields.io/badge/License-MIT-22C55E?style=flat-square)](./LICENSE)

**[Live Demo](https://zaibrix-github-finder.vercel.app/)** · **[Report a Bug](#)**

</div>

---

I started learning web development in May 2025. This is my third real project.

The first was a construction website. The second was a multiplication table generator — pure HTML, CSS, and vanilla JS — which taught me how the DOM actually works. This one is a step up. First full React app with routing, API calls, persistent state, and decisions I had to actually think through before writing any code.

I built this because I wanted to practice something real, not another to-do list. Searching GitHub users, saving favorites across sessions, handling API rate limits — these are actual problems with actual edge cases.

---

## What it does

Search any GitHub username, get their profile back — avatar, bio, followers, repos, link to their page. Save profiles you care about to a Favorites list that survives page refreshes. Remove them whenever you want.

Two pages. Clean navigation. No full reloads.

The search doesn't fire on every keystroke — it waits until you stop typing. Alerts were replaced with toasts so nothing blocks your flow. Favorites are written to LocalStorage so closing the tab doesn't wipe everything. Small things, but they add up.

---

## The decisions that actually mattered

### Debouncing the search input

The first version I built fired an API call on every single keystroke. Type "shahzaib" and you'd burn through 7 requests before even finishing the word. GitHub's unauthenticated API gives you 60 requests per hour — that's easy to waste.

The fix is debouncing. You set a timer every time the input changes. If the user keeps typing, you cancel the previous timer and set a new one. The API call only fires when the user *stops* typing for 350ms.

```js
useEffect(() => {
  const timer = setTimeout(() => {
    if (query.trim()) fetchUser(query);
  }, 350);

  return () => clearTimeout(timer);
}, [query]);
```

That `return () => clearTimeout(timer)` is the cleanup function. Every re-render cancels the previous timer. I initially forgot the cleanup entirely and couldn't figure out why stale searches kept coming back — the old timers were still running in the background. Once I understood that `useEffect` cleanup runs before the next effect, it clicked. No library, no abstraction. Just the event loop.

---

### Favorites that actually persist

React state lives in memory. Refresh the page and it's gone. To make favorites stick, I needed LocalStorage — but the tricky part is keeping React state and LocalStorage *in sync with each other*, not treating one as the source of truth at the wrong time.

The pattern I landed on: React state is always what the UI renders from. LocalStorage is just the save file.

```js
// On mount — read the save file and hydrate state
useEffect(() => {
  const saved = JSON.parse(localStorage.getItem("favorites") || "[]");
  setFavorites(saved);
}, []);

// Whenever favorites change — write back to the save file
useEffect(() => {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}, [favorites]);
```

Two effects. One dependency array each. The first runs once on mount. The second runs every time favorites changes. I spent a while confused about why favorites kept resetting on refresh before I realized the hydration effect needs an empty dependency array — without it, it was re-running and overwriting state with an empty array on every render. Clean separation once you see it.

---

### Removing a favorite

When you remove a profile from favorites, I don't splice the array or delete by index. I use `filter` — it returns a brand new array without the item you removed, and React sees a new reference and re-renders correctly.

```js
const removeFavorite = (login) => {
  setFavorites((prev) => prev.filter((user) => user.login !== login));
};
```

Mutating state directly is one of the most common React bugs. `filter` sidesteps that entirely.

---

### Why React Router for just two pages?

Because the URL should mean something. If you're on the Favorites page, the URL should say `/favorites`. The back button should work. Someone should be able to bookmark it. That's what a real app does — and React Router makes it basically zero effort once the mental model is clear.

---

### The UI

Built with CSS Grid using `auto-fill` and `minmax()`, so cards reflow across screen sizes without writing five separate breakpoints for each viewport. CSS variables handle all the theming — colors, blur, opacity — defined once in `index.css` and referenced everywhere.

---

## Project structure

```
src/
├── App.jsx          # Route setup, nothing else
├── SearchPage.jsx   # API calls, debounce, add to favorites
├── FavPage.jsx      # Read from LocalStorage, filter-based removal
├── index.css        # CSS variables, glass UI, grid system
└── main.jsx         # Entry point
```

---

## Running it locally

You need Node.js v18+.

```bash
git clone https://github.com/your-username/github-user-finder-pro.git
cd github-user-finder-pro
npm install
npm run dev
```

Open `http://localhost:5173`.

---

## Stack

React 18 + Vite · React Router DOM v6 · GitHub REST API v3 · react-hot-toast · CSS3

I used Vite instead of Create React App because CRA is slow to start and hasn't been maintained properly in years. Vite's dev server is near-instant and the build output is cleaner. It was a conscious choice, not just what a tutorial told me to use.

---

## About me

I'm Shahzaib — a 17-year-old self-taught frontend developer from Multan, Pakistan.

I started with HTML and CSS in May 2025. Picked up JavaScript properly after that. Moved to React in January 2026. This is Day 3 of building in public — documenting every project, every decision, and everything I learn along the way.

I'm not trying to collect tutorials. I'm trying to build things that work, understand why they work, and get better at both.

**[GitHub](#)** · **[Portfolio — coming soon](#)**

---

Star it if it was actually useful. I'm 17, building in public, and every bit of feedback or recognition genuinely helps — even a star tells me someone found the project worth looking at.
