export function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, s => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[s]));
}

export function ensureToastRoot() {
  let root = document.getElementById("toastRoot");
  if (!root) {
    root = document.createElement("div");
    root.id = "toastRoot";
    root.className = "toast-wrap";
    document.body.appendChild(root);
  }
  return root;
}

export function toast(message, type = "ok") {
  const root = ensureToastRoot();
  const el = document.createElement("div");
  el.className = `toast ${type === "err" ? "err" : "ok"}`;
  el.textContent = message;
  root.appendChild(el);
  setTimeout(() => el.remove(), 2600);
}
