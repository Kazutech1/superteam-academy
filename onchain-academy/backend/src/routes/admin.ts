import { Router } from "express";
import * as admin from "../controllers/admin";
import { authenticate } from "../middlewares/auth";
import { requireAdmin } from "../middlewares/requireAdmin";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Administrative management for courses, users, and platform analytics
 */

// All admin routes require authentication + admin role
router.use(authenticate, requireAdmin);

// ─── Course Management ────────────────────────────────────────────────────────

/**
 * @swagger
 * /admin/courses:
 *   get:
 *     summary: List all courses with stats (Admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [draft, published, archived] }
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: List of courses with enrollment/completion metrics
 */
router.get("/courses", admin.adminGetCourses);

/**
 * @swagger
 * /admin/courses/{slug}:
 *   patch:
 *     summary: Update course metadata (Admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               difficulty: { type: string }
 *               topic: { type: string }
 *     responses:
 *       200:
 *         description: Course updated
 */
router.patch("/courses/:slug", admin.adminUpdateCourse);

/**
 * @swagger
 * /admin/courses/{slug}/archive:
 *   patch:
 *     summary: Archive a course (Admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Course archived
 */
router.patch("/courses/:slug/archive", admin.adminArchiveCourse);

/**
 * @swagger
 * /admin/courses/{slug}:
 *   delete:
 *     summary: Hard delete a draft course (Admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Course deleted
 *       400:
 *         description: Cannot delete published courses
 */
router.delete("/courses/:slug", admin.adminDeleteCourse);

// ─── User Management ─────────────────────────────────────────────────────────

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: List platform users (Admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: role
 *         schema: { type: string, enum: [user, admin] }
 *     responses:
 *       200:
 *         description: Paginated list of users
 */
router.get("/users", admin.adminGetUsers);

/**
 * @swagger
 * /admin/users/{id}:
 *   get:
 *     summary: Get full user details (Admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: User profile, enrollments, and achievements
 */
router.get("/users/:id", admin.adminGetUser);

/**
 * @swagger
 * /admin/users/{id}/role:
 *   patch:
 *     summary: Update user role (Admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [role]
 *             properties:
 *               role: { type: string, enum: [user, admin] }
 *     responses:
 *       200:
 *         description: Role updated
 */
router.patch("/users/:id/role", admin.adminSetRole);

/**
 * @swagger
 * /admin/users/{id}/ban:
 *   patch:
 *     summary: Ban or unban a user (Admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [banned]
 *             properties:
 *               banned: { type: boolean }
 *     responses:
 *       200:
 *         description: Ban status updated
 */
router.patch("/users/:id/ban", admin.adminBanUser);

// ─── Analytics ────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /admin/analytics/overview:
 *   get:
 *     summary: High-level platform health (Admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Active users, enrollments, and community activity
 */
router.get("/analytics/overview", admin.analyticsOverview);

/**
 * @swagger
 * /admin/analytics/courses:
 *   get:
 *     summary: Per-course performance data (Admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Completion rates and average completion times
 */
router.get("/analytics/courses", admin.analyticsCourses);

/**
 * @swagger
 * /admin/analytics/users:
 *   get:
 *     summary: User signup and level analytics (Admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Signups by day and level distribution
 */
router.get("/analytics/users", admin.analyticsUsers);

/**
 * @swagger
 * /admin/analytics/achievements:
 *   get:
 *     summary: Achievement distribution stats (Admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Minted count and percentage adoption per badge
 */
router.get("/analytics/achievements", admin.analyticsAchievements);

export default router;
