const KEY = "theme"; // "light" | "dark"

export function getTheme() {
  return localStorage.getItem(KEY) || "light";
}

export function applyTheme(theme) {
  const t = (theme === "dark") ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", t);
  localStorage.setItem(KEY, t);
}

export function toggleTheme() {
  const next = getTheme() === "dark" ? "light" : "dark";
  applyTheme(next);
  return next;
}
