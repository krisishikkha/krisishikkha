function canAccessPremium() {
  if (typeof isLoggedIn !== "function") return false;
  return isLoggedIn();
}

function getAccessState() {
  if (typeof getSession !== "function") {
    return {
      loggedIn: false,
      valid: false,
      reason: "not_logged_in"
    };
  }

  const session = getSession();

  if (!session) {
    return {
      loggedIn: false,
      valid: false,
      reason: "not_logged_in"
    };
  }

  if (session.access !== "active") {
    return {
      loggedIn: true,
      valid: false,
      reason: "inactive"
    };
  }

  if (typeof isExpired === "function" && isExpired(session.expires)) {
    return {
      loggedIn: true,
      valid: false,
      reason: "expired"
    };
  }

  return {
    loggedIn: true,
    valid: true,
    reason: "ok"
  };
}
