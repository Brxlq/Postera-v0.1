import { apiFetch, clearAuth, getUser, isAdmin } from "./api.js";
import { escapeHtml, toast } from "./ui.js";

const postsEl = document.getElementById("posts");
const adminBox = document.getElementById("adminBox");
const roleBadge = document.getElementById("roleBadge");

const loginLink = document.getElementById("loginLink");
const registerLink = document.getElementById("registerLink");
const logoutBtn = document.getElementById("logoutBtn");

const titleEl = document.getElementById("title");
const contentEl = document.getElementById("content");
const createBtn = document.getElementById("createPostBtn");
const searchEl = document.getElementById("search");

let allPosts = [];

function setNav() {
  const user = getUser();
  if (user) {
    loginLink.classList.add("hidden");
    registerLink.classList.add("hidden");
    logoutBtn.classList.remove("hidden");

    roleBadge.textContent = `${user.email} • ${user.role}`;
    roleBadge.classList.remove("hidden");
  } else {
    loginLink.classList.remove("hidden");
    registerLink.classList.remove("hidden");
    logoutBtn.classList.add("hidden");
    roleBadge.classList.add("hidden");
  }

  if (isAdmin()) adminBox.classList.remove("hidden");
  else adminBox.classList.add("hidden");
}

logoutBtn?.addEventListener("click", () => {
  clearAuth();
  window.location.reload();
});

function renderPosts(list) {
  postsEl.innerHTML = "";

  if (!list.length) {
    postsEl.innerHTML = `<div class="card">No posts found.</div>`;
    return;
  }

  for (const post of list) {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <div class="post-title">
        <a href="/post.html?id=${post._id}">${escapeHtml(post.title)}</a>
        <span class="badge">${escapeHtml(post.author?.email || "unknown")}</span>
      </div>
      <div class="post-meta">
        <span>${new Date(post.createdAt).toLocaleString()}</span>
        <span>•</span>
        <span>${escapeHtml(post.author?.role || "")}</span>
      </div>
      <div class="divider"></div>
      <div>${escapeHtml(post.content).slice(0, 220)}${post.content.length > 220 ? "..." : ""}</div>
    `;
    postsEl.appendChild(div);
  }
}

function applySearch() {
  const q = (searchEl.value || "").trim().toLowerCase();
  if (!q) return renderPosts(allPosts);

  const filtered = allPosts.filter(p =>
    (p.title || "").toLowerCase().includes(q) ||
    (p.content || "").toLowerCase().includes(q)
  );
  renderPosts(filtered);
}

searchEl?.addEventListener("input", applySearch);

async function loadPosts() {
  postsEl.innerHTML = `<div class="card">Loading...</div>`;
  try {
    allPosts = await apiFetch("/api/posts");
    renderPosts(allPosts);
  } catch (e) {
    postsEl.innerHTML = `<div class="card btn-danger">${escapeHtml(e.message)}</div>`;
  }
}

createBtn?.addEventListener("click", async () => {
  try {
    const title = titleEl.value.trim();
    const content = contentEl.value.trim();
    if (!title || !content) throw new Error("Title and content are required");

    await apiFetch("/api/posts", {
      method: "POST",
      body: JSON.stringify({ title, content })
    });

    titleEl.value = "";
    contentEl.value = "";
    toast("Post created", "ok");
    await loadPosts();
  } catch (e) {
    toast(e.message, "err");
  }
});

setNav();
loadPosts();
