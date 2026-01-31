import { apiFetch, setToken, setUser } from "./api.js";

const emailEl = document.getElementById("email");
const passEl = document.getElementById("password");
const msgEl = document.getElementById("msg");
const btn = document.getElementById("loginBtn");

btn.addEventListener("click", async () => {
  msgEl.textContent = "";
  try {
    const email = emailEl.value.trim();
    const password = passEl.value;

    const data = await apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });

    setToken(data.token);
    setUser(data.user);

    msgEl.textContent = "Logged in";
    window.location.href = "/";
  } catch (e) {
    msgEl.textContent = e.message;
  }
});
