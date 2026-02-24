import { Request, Response } from "express";
import { User } from "../models/users";
import { Enrollment } from "../models/enrollment";
import { MilestoneProgress } from "../models/milestoneProgress";
import { Course } from "../models/courses";
import { getXPProgress } from "../services/gamification";

/**
 * GET /api/v1/dashboard
 * Returns the authenticated user's full dashboard data:
 *  - XP & level summary
 *  - Streak + activity heatmap
 *  - Active course enrollments with progress
 *  - Recommended courses (not yet enrolled)
 *  - Recent activity feed
 */
export const getDashboard = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.id;

        // ── 1. Fetch user ─────────────────────────────────────────────────────────
        const user = await User.findById(userId).lean();
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }

        // ── 2. XP summary ─────────────────────────────────────────────────────────
        const lockedMilestones = await MilestoneProgress.find({
            userId,
            allTestsPassed: true,
            isXPUnlocked: false,
        }).select("xpReward").lean();

        const lockedXP = lockedMilestones.reduce((sum, mp) => sum + (mp.xpReward ?? 0), 0);
        const xpProgress = getXPProgress(user.totalXP);

        // ── 3. Active enrollments + progress ──────────────────────────────────────
        const enrollments = await Enrollment.find({ userId })
            .sort({ lastAccessedAt: -1 })
            .lean();

        const courseIds = enrollments.map((e) => e.courseId);

        // Fetch course info for enrolled courses
        const courses = await Course.find({ _id: { $in: courseIds } })
            .select("title slug thumbnail shortDescription totalXP difficulty topic")
            .lean();

        const courseMap = new Map(courses.map((c) => [c._id.toString(), c]));

        // Fetch milestone progress for all enrolled courses in one query
        const allProgress = await MilestoneProgress.find({ userId, courseId: { $in: courseIds } })
            .select("courseId allTestsPassed milestoneOrder")
            .lean();

        // Group by courseId
        const progressByCourse = new Map<string, typeof allProgress>();
        for (const p of allProgress) {
            const key = p.courseId.toString();
            if (!progressByCourse.has(key)) progressByCourse.set(key, []);
            progressByCourse.get(key)!.push(p);
        }

        const activeCourses = enrollments.map((enrollment) => {
            const courseId = enrollment.courseId.toString();
            const course = courseMap.get(courseId);
            const milestones = progressByCourse.get(courseId) ?? [];
            const completed = milestones.filter((m) => m.allTestsPassed).length;
            const total = milestones.length;
            const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

            return {
                courseId,
                slug: course?.slug,
                title: course?.title,
                thumbnail: course?.thumbnail,
                difficulty: course?.difficulty,
                topic: course?.topic,
                totalXP: course?.totalXP,
                completedAt: enrollment.completedAt ?? null,
                lastAccessedAt: enrollment.lastAccessedAt,
                progress: { completed, total, percent },
            };
        });

        // ── 4. Recommended courses (not yet enrolled, published) ──────────────────
        const recommendedCourses = await Course.find({
            status: "published",
            _id: { $nin: courseIds },
        })
            .select("title slug thumbnail shortDescription totalXP difficulty topic")
            .sort({ enrollmentCount: -1 })
            .limit(3)
            .lean();

        // ── 5. Recent activity feed ────────────────────────────────────────────────
        // Use recent milestone completions as the activity feed
        const recentMilestones = await MilestoneProgress.find({
            userId,
            allTestsPassed: true,
        })
            .sort({ completedAt: -1 })
            .limit(10)
            .populate({ path: "courseId", select: "title slug" })
            .lean();

        const recentActivity = recentMilestones
            .filter((mp) => mp.completedAt)
            .map((mp) => ({
                type: "milestone_complete",
                courseId: mp.courseId,
                milestoneOrder: mp.milestoneOrder,
                at: mp.completedAt,
            }));

        // ── 6. Build response ──────────────────────────────────────────────────────
        res.status(200).json({
            success: true,
            data: {
                xp: {
                    total: user.totalXP,
                    locked: lockedXP,
                    ...xpProgress,
                },
                streak: {
                    current: user.currentStreak,
                    longest: user.longestStreak,
                    lastActive: user.lastActive ?? null,
                    activityDates: user.activityDates ?? [],
                },
                activeCourses,
                recommendedCourses,
                recentActivity,
            },
        });
    } catch (err: any) {
        console.error("[getDashboard] error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
