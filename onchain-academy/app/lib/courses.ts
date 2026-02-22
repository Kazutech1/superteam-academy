import { fetchWithAuth } from "./api";

// ─── Interfaces ───

export interface CourseAuthor {
    name: string;
    avatar?: string;
    title?: string;
}

export interface Lesson {
    _id?: string;
    id?: string;
    title: string;
    type: "video" | "doc" | "test";
    duration: string;
    completed?: boolean;
}

export interface Milestone {
    _id?: string;
    id?: string;
    title: string;
    description: string;
    xp: number;
    lessons: Lesson[];
    completed?: boolean;
}

export interface Course {
    _id: string;
    slug: string;
    title: string;
    description: string;
    shortDescription: string;
    thumbnail?: string;
    tags: string[];
    difficulty: "beginner" | "intermediate" | "advanced";
    topic: string;
    milestones: Milestone[];
    author: CourseAuthor;
    createdAt: string;

    // Front-end calculated or injected fields
    level?: string;
    xp?: number;
    modules?: number;
    courseLessons?: number; // mapped to avoid conflict
    duration?: string;

    boss?: string;
    bossEmoji?: string;
    bossHp?: number;
    ringColor?: string;
    borderColor?: string;
    glowColor?: string;
    textColor?: string;
    bgAccent?: string;
    tag?: string;
    tagColor?: string;
    questIcon?: string;
    rarity?: string;
    rarityColor?: string;
    rewards?: { name: string; type: string; emoji: string }[];
    loot?: string[];
    playersActive?: number;
    completionRate?: number;
    locked?: boolean;
}

export interface PaginatedCourses {
    success: boolean;
    data: Course[];
    total: number;
    page: number;
    pages: number;
}

export interface SingleCourseResponse {
    success: boolean;
    data: Course;
    enrollment?: any;
    milestoneProgress?: any;
}

// ─── API Wrapper ───

export const coursesApi = {
    /**
     * Get all courses, paginated
     */
    async getCourses(params?: { difficulty?: string; topic?: string; search?: string; page?: number; limit?: number }): Promise<PaginatedCourses> {
        const queryParams = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined) {
                    queryParams.append(key, String(value));
                }
            });
        }
        const qs = queryParams.toString() ? `?${queryParams.toString()}` : "";
        return fetchWithAuth<PaginatedCourses>(`/courses${qs}`, { method: "GET" });
    },

    /**
     * Get a single course by slug
     */
    async getCourseBySlug(slug: string): Promise<SingleCourseResponse> {
        return fetchWithAuth<SingleCourseResponse>(`/courses/${slug}`, { method: "GET" });
    },

    /**
     * Enroll in a course
     */
    async enrollInCourse(slug: string): Promise<any> {
        return fetchWithAuth(`/courses/${slug}/enroll`, { method: "POST" });
    },

    /**
     * Complete a test attempt for a milestone
     */
    async completeMilestone(slug: string, milestoneId: string, testId: string, score: number): Promise<any> {
        return fetchWithAuth(`/courses/${slug}/milestones/${milestoneId}/complete`, {
            method: "POST",
            body: JSON.stringify({ testId, score }),
        });
    },

    /**
     * Claim XP for a completed milestone
     */
    async claimMilestoneXP(slug: string, milestoneId: string): Promise<any> {
        return fetchWithAuth(`/courses/${slug}/milestones/${milestoneId}/claim-xp`, { method: "POST" });
    }
};
