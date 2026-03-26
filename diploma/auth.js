const AGRI_SESSION_KEY = "agriculture_logged_user";

function getTodayDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isExpired(expiryDate) {
  const today = getTodayDateString();
  return today > expiryDate;
}

function findUser(username, password) {
  return AGRICULTURE_USERS.find(user =>
    user.username === username && user.password === password
  );
}

function saveSession(user) {
  const sessionData = {
    username: user.username,
    access: user.access,
    expires: user.expires,
    loginTime: new Date().toISOString()
  };

  localStorage.setItem(AGRI_SESSION_KEY, JSON.stringify(sessionData));
}

function getSession() {
  const saved = localStorage.getItem(AGRI_SESSION_KEY);
  if (!saved) return null;

  try {
    return JSON.parse(saved);
  } catch (error) {
    return null;
  }
}

function clearSession() {
  localStorage.removeItem(AGRI_SESSION_KEY);
}

function isLoggedIn() {
  const session = getSession();
  if (!session) return false;
  if (session.access !== "active") return false;
  if (isExpired(session.expires)) return false;
  return true;
}

function logoutUser() {
  clearSession();
  window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const messageBox = document.getElementById("loginMessage");
  const loginStatus = document.getElementById("loginStatus");
  const logoutBtn = document.getElementById("logoutBtn");

  if (loginStatus) {
    const session = getSession();

    if (session && isLoggedIn()) {
      loginStatus.textContent = `Logged in as ${session.username} (Access valid until ${session.expires})`;
    } else {
      loginStatus.textContent = "Not logged in";
    }
  }
});
