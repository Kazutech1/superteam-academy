import { User } from "../models/users";

/**
 * updateStreak
 * Called after any learning activity (milestone attempt, pass or fail).
 * - Increments streak if last activity was yesterday.
 * - No-op if already active today.
 * - Resets streak to 1 if gap > 1 day.
 * - Appends today's date to activityDates (for heatmap), no duplicates.
 */
export const updateStreak = async (userId: string): Promise<void> => {
    const user = await User.findById(userId);
    if (!user) return;

    const today = new Date();
    const todayStr = toDateString(today);

    // ── Activity dates heatmap ────────────────────────────────────────────────
    if (!user.activityDates) user.activityDates = [];
    if (!user.activityDates.includes(todayStr)) {
        user.activityDates.push(todayStr);
        // Keep only last 365 days
        if (user.activityDates.length > 365) {
            user.activityDates = user.activityDates.slice(-365);
        }
    }

    // ── Streak calculation ────────────────────────────────────────────────────
    const lastActive = user.lastActive;

    if (!lastActive) {
        // First ever activity
        user.currentStreak = 1;
    } else {
        const lastStr = toDateString(lastActive);
        const diffDays = daysBetween(lastActive, today);

        if (lastStr === todayStr) {
            // Already active today — only update heatmap, don't touch streak
        } else if (diffDays === 1) {
            // Active yesterday — extend streak
            user.currentStreak = (user.currentStreak || 0) + 1;
        } else {
            // Gap of 2+ days — reset streak
            user.currentStreak = 1;
        }
    }

    // Update longest streak
    if (user.currentStreak > (user.longestStreak || 0)) {
        user.longestStreak = user.currentStreak;
    }

    user.lastActive = today;

    await user.save();
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Format a Date as "YYYY-MM-DD" in UTC. */
const toDateString = (date: Date): string => {
    return date.toISOString().split("T")[0];
};

/** 
 * Return the number of whole calendar days between two dates.
 * Positive if b is after a.
 */
const daysBetween = (a: Date, b: Date): number => {
    const msPerDay = 86400000;
    const aDay = Math.floor(a.getTime() / msPerDay);
    const bDay = Math.floor(b.getTime() / msPerDay);
    return Math.abs(bDay - aDay);
};
