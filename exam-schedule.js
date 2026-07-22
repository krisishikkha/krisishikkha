// ==================== exam-schedule.js ====================
// Shared helper — include this AFTER exam-status.js on every page that needs
// to know whether an exam is currently open (exam-corner.html, exam.js,
// admin-auto-scoreboard.html). One place to change the scheduling logic
// instead of copy-pasting it into three files.

/**
 * Returns one of: "archived" | "draft" | "upcoming" | "live" | "ended"
 *
 * - archived : category === "archived" → always open, no schedule.
 * - draft    : category === "draft"    → never open, hidden everywhere.
 * - upcoming : category === "live" and now < startDate.
 * - ended    : category === "live" and endDate is set and now > endDate.
 * - live     : category === "live" and currently within the window
 *              (or no startDate/endDate set at all → always open).
 */
function getExamState(exam) {
  if (!exam) return "draft";
  if (exam.category === "archived") return "archived";
  if (exam.category === "draft") return "draft";

  // category === "live"
  const now = new Date();
  const start = exam.startDate ? new Date(exam.startDate) : null;
  const end = exam.endDate ? new Date(exam.endDate) : null;

  if (start && now < start) return "upcoming";
  if (end && now > end) return "ended";
  return "live";
}

// Human-readable Bengali countdown, e.g. "২ ঘণ্টা ১৫ মিনিট পর শুরু হবে"
function formatCountdown(targetDate) {
  const diffMs = new Date(targetDate) - new Date();
  if (diffMs <= 0) return "শুরু হচ্ছে...";

  const totalMin = Math.floor(diffMs / 60000);
  const days = Math.floor(totalMin / 1440);
  const hours = Math.floor((totalMin % 1440) / 60);
  const mins = totalMin % 60;

  const parts = [];
  if (days > 0) parts.push(`${days} দিন`);
  if (hours > 0) parts.push(`${hours} ঘণ্টা`);
  if (mins > 0 || parts.length === 0) parts.push(`${mins} মিনিট`);

  return parts.join(" ") + " পর শুরু হবে";
}
