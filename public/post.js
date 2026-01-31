import { apiFetch, clearAuth, getToken, getUser, isAdmin } from "./api.js";
import { escapeHtml, toast } from "./ui.js";

const qs = new URLSearchParams(window.location.search);
const postId = qs.get("id");

const postTitleEl = document.getElementById("postTitle");
const postMetaEl = document.getElementById("postMeta");
const postContentEl = document.getElementById("postContent");

const adminActions = document.getElementById("adminActions");
const editBtn = document.getElementById("editBtn");
const deleteBtn = document.getElementById("deleteBtn");

const postView = document.getElementById("postView");
const postEdit = document.getElementById("postEdit");
const editTitleEl = document.getElementById("editTitle");
const editContentEl = document.getElementById("editContent");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");

const commentsEl = document.getElementById("comments");

const loginLink = document.getElementById("loginLink");
const registerLink = document.getElementById("registerLink");
const logoutBtn = document.getElementById("logoutBtn");
const roleBadge = document.getElementById("roleBadge");

const commentForm = document.getElementById("commentForm");
const loginHint = document.getElementById("loginHint");
const commentText = document.getElementById("commentText");
const sendBtn = document.getElementById("sendCommentBtn");

let currentPost = null;

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

  if (getToken()) {
    commentForm.classList.remove("hidden");
    loginHint.classList.add("hidden");
  } else {
    commentForm.classList.add("hidden");
    loginHint.classList.remove("hidden");
  }

  // Admin-only action buttons
  if (isAdmin()) adminActions.classList.remove("hidden");
  else adminActions.classList.add("hidden");
}

logoutBtn?.addEventListener("click", () => {
  clearAuth();
  window.location.reload();
});

function renderPost(post) {
  postTitleEl.textContent = post.title || "(no title)";

  const authorEmail = post.author?.email || "unknown";
  const authorRole = post.author?.role || "";
  const date = new Date(post.createdAt).toLocaleString();

  postMetaEl.innerHTML = `
    <span>${escapeHtml(authorEmail)}</span>
    <span>•</span>
    <span>${escapeHtml(authorRole)}</span>
    <span>•</span>
    <span>${escapeHtml(date)}</span>
  `;

  // Preserve line breaks
  postContentEl.innerHTML = escapeHtml(post.content || "").replace(/\n/g, "<br/>");

  // Prefill edit form
  editTitleEl.value = post.title || "";
  editContentEl.value = post.content || "";
}

async function loadPost() {
  if (!postId) {
    postTitleEl.textContent = "Missing post id";
    return;
  }

  postContentEl.innerHTML = "<div class='card'>Loading...</div>";

  try {
    currentPost = await apiFetch(`/api/posts/${postId}`);
    renderPost(currentPost);
  } catch (e) {
    postTitleEl.textContent = "Error";
    postContentEl.innerHTML = `<div class="card btn-danger">${escapeHtml(e.message)}</div>`;
  }
}

function commentCard(c) {
  const div = document.createElement("div");
  div.className = "card";

  const canDelete = isAdmin();

  div.innerHTML = `
    <div class="row">
      <small class="muted">${escapeHtml(c.author?.email || "unknown")} • ${new Date(c.createdAt).toLocaleString()}</small>
      ${canDelete ? `<button data-del="${c._id}" class="btn-danger">Delete</button>` : ""}
    </div>
    <div class="divider"></div>
    <div>${escapeHtml(c.text || "").replace(/\n/g, "<br/>")}</div>
  `;

  return div;
}

async function loadComments() {
  commentsEl.innerHTML = `<div class="card">Loading...</div>`;
  try {
    const comments = await apiFetch(`/api/posts/${postId}/comments`);
    commentsEl.innerHTML = "";

    if (!comments.length) {
      commentsEl.innerHTML = `<div class="card">No comments yet.</div>`;
      return;
    }

    for (const c of comments) commentsEl.appendChild(commentCard(c));

    // Bind delete handlers for admin
    if (isAdmin()) {
      commentsEl.querySelectorAll("button[data-del]").forEach(btn => {
        btn.addEventListener("click", async () => {
          const id = btn.getAttribute("data-del");
          if (!confirm("Delete this comment?")) return;

          try {
            await apiFetch(`/api/comments/${id}`, { method: "DELETE" });
            toast("Comment deleted", "ok");
            await loadComments();
          } catch (e) {
            toast(e.message, "err");
          }
        });
      });
    }
  } catch (e) {
    commentsEl.innerHTML = `<div class="card btn-danger">${escapeHtml(e.message)}</div>`;
  }
}

function setMode(mode) {
  if (mode === "edit") {
    postView.classList.add("hidden");
    postEdit.classList.remove("hidden");
  } else {
    postEdit.classList.add("hidden");
    postView.classList.remove("hidden");
  }
}

editBtn?.addEventListener("click", () => {
  if (!isAdmin()) return;
  setMode("edit");
});

cancelBtn?.addEventListener("click", () => {
  if (!currentPost) return;
  // reset inputs
  editTitleEl.value = currentPost.title || "";
  editContentEl.value = currentPost.content || "";
  setMode("view");
});

saveBtn?.addEventListener("click", async () => {
  if (!isAdmin()) return;

  try {
    const title = editTitleEl.value.trim();
    const content = editContentEl.value.trim();
    if (!title || !content) throw new Error("Title and content are required");

    const updated = await apiFetch(`/api/posts/${postId}`, {
      method: "PUT",
      body: JSON.stringify({ title, content })
    });

    currentPost = { ...currentPost, ...updated };
    renderPost(currentPost);
    setMode("view");
    toast("Post updated", "ok");
  } catch (e) {
    toast(e.message, "err");
  }
});

deleteBtn?.addEventListener("click", async () => {
  if (!isAdmin()) return;
  if (!confirm("Delete this post?")) return;

  try {
    await apiFetch(`/api/posts/${postId}`, { method: "DELETE" });
    toast("Post deleted", "ok");
    setTimeout(() => (window.location.href = "/"), 600);
  } catch (e) {
    toast(e.message, "err");
  }
});

sendBtn?.addEventListener("click", async () => {
  try {
    const text = commentText.value.trim();
    if (!text) throw new Error("Comment text is required");

    await apiFetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify({ text })
    });

    commentText.value = "";
    toast("Comment added", "ok");
    await loadComments();
  } catch (e) {
    toast(e.message, "err");
  }
});

setNav();
setMode("view");
loadPost();
loadComments();
