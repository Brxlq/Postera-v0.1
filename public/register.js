import { apiFetch, setToken, setUser } from "./api.js";

const emailEl = document.getElementById("email");
const passEl = document.getElementById("password");
const roleEl = document.getElementById("role");
const msgEl = document.getElementById("msg");
const btn = document.getElementById("registerBtn");

btn.addEventListener("click", async () => {
  msgEl.textContent = "";
  try {
    const email = emailEl.value.trim();
    const password = passEl.value;
    const role = roleEl.value;

    const data = await apiFetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, role })
    });

    setToken(data.token);
    setUser(data.user);

    msgEl.textContent = "Registered and logged in";
    window.location.href = "/";
  } catch (e) {
    msgEl.textContent = e.message;
  }
});
