"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Award,
    BookOpen,
    Calendar,
    CheckCircle2,
    Crown,
    ExternalLink,
    Eye,
    EyeOff,
    Flame,
    Github,
    Globe,
    Shield,
    Star,
    Trophy,
    Twitter,
    User,
    Zap,
} from "lucide-react";

/* ── stub data ──────────────────────────────────────── */
const profileData = {
    username: "alex_sol",
    name: "Alex Rivera",
    bio: "Full-stack Solana builder. Passionate about DeFi and on-chain governance. Learning every day.",
    avatar: "",
    joinDate: "Jan 2025",
    isPublic: true,
    level: 7,
    totalXP: 4850,
    streak: 14,
    rank: 42,
    socialLinks: {
        twitter: "alex_sol",
        github: "alexrivera",
        website: "https://alexrivera.dev",
    },
    skills: [
        { name: "Rust", value: 72 },
        { name: "Anchor", value: 58 },
        { name: "Frontend", value: 85 },
        { name: "Security", value: 40 },
        { name: "DeFi", value: 65 },
        { name: "NFTs", value: 50 },
    ],
    achievements: [
        { id: "a1", name: "First Steps", description: "Complete your first lesson", icon: "🚀", earned: true, date: "Jan 15" },
        { id: "a2", name: "Course Completer", description: "Complete an entire course", icon: "🎓", earned: true, date: "Feb 2" },
        { id: "a3", name: "Week Warrior", description: "7-day learning streak", icon: "🔥", earned: true, date: "Feb 10" },
        { id: "a4", name: "Rust Rookie", description: "Complete a Rust-based course", icon: "🦀", earned: true, date: "Feb 12" },
        { id: "a5", name: "Speed Runner", description: "Finish a course in under 48h", icon: "⚡", earned: false, date: null },
        { id: "a6", name: "Perfect Score", description: "100% on all challenges in a course", icon: "💯", earned: false, date: null },
        { id: "a7", name: "Monthly Master", description: "30-day learning streak", icon: "👑", earned: false, date: null },
        { id: "a8", name: "Full Stack Solana", description: "Complete all available courses", icon: "🏆", earned: false, date: null },
    ],
    credentials: [
        { id: "c1", course: "Intro to Solana", mintAddress: "SoL...x7Kp", date: "Feb 2, 2025", level: "Beginner", verified: true },
        { id: "c2", course: "Smart Contracts 101", mintAddress: "AnC...r3Qm", date: "Feb 14, 2025", level: "Intermediate", verified: true },
    ],
    completedCourses: [
        { slug: "intro-to-solana", title: "Intro to Solana", xp: 200, completedDate: "Feb 2, 2025", grade: "A+" },
        { slug: "smart-contracts-101", title: "Smart Contracts 101", xp: 500, completedDate: "Feb 14, 2025", grade: "A" },
    ],
};

/* ── Radar chart (CSS-based) ─────────────────────────── */
function SkillRadar({ skills }: { skills: typeof profileData.skills }) {
    const n = skills.length;
    const cx = 100, cy = 100, r = 75;
    const angleStep = (2 * Math.PI) / n;

    const bgPoints = Array.from({ length: n }, (_, i) => {
        const angle = -Math.PI / 2 + i * angleStep;
        return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    }).join(" ");

    const dataPoints = skills.map((s, i) => {
        const angle = -Math.PI / 2 + i * angleStep;
        const sr = (s.value / 100) * r;
        return `${cx + sr * Math.cos(angle)},${cy + sr * Math.sin(angle)}`;
    }).join(" ");

    return (
        <div className="relative w-[200px] h-[200px] mx-auto">
            <svg viewBox="0 0 200 200" className="w-full h-full">
                {/* Grid circles */}
                {[0.25, 0.5, 0.75, 1].map((scale) => (
                    <polygon
                        key={scale}
                        points={Array.from({ length: n }, (_, i) => {
                            const angle = -Math.PI / 2 + i * angleStep;
                            return `${cx + r * scale * Math.cos(angle)},${cy + r * scale * Math.sin(angle)}`;
                        }).join(" ")}
                        fill="none"
                        stroke="rgba(255,255,255,0.06)"
                        strokeWidth="1"
                    />
                ))}
                {/* Axes */}
                {skills.map((_, i) => {
                    const angle = -Math.PI / 2 + i * angleStep;
                    return (
                        <line key={i} x1={cx} y1={cy} x2={cx + r * Math.cos(angle)} y2={cy + r * Math.sin(angle)} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                    );
                })}
                {/* Data polygon */}
                <polygon points={dataPoints} fill="rgba(0,255,163,0.1)" stroke="#00ffa3" strokeWidth="2" />
                {/* Labels */}
                {skills.map((s, i) => {
                    const angle = -Math.PI / 2 + i * angleStep;
                    const tx = cx + (r + 18) * Math.cos(angle);
                    const ty = cy + (r + 18) * Math.sin(angle);
                    return (
                        <text key={i} x={tx} y={ty} textAnchor="middle" dominantBaseline="middle" className="fill-zinc-400 text-[8px] font-bold">
                            {s.name}
                        </text>
                    );
                })}
            </svg>
        </div>
    );
}

export default function ProfilePage() {
    const { username } = useParams<{ username: string }>();
    const profile = profileData; // stubbed
    const [isPublic, setIsPublic] = useState(profile.isPublic);

    const nextLevelXP = Math.pow((profile.level + 1), 2) * 100;
    const currentLevelXP = Math.pow(profile.level, 2) * 100;
    const levelProgress = ((profile.totalXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

    return (
        <div className="min-h-screen bg-[#020408] relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-neon-green/[0.03] rounded-full blur-[200px]" />
                <div className="absolute bottom-1/3 left-1/4 w-[500px] h-[500px] bg-neon-purple/[0.03] rounded-full blur-[150px]" />
            </div>

            {/* Top Bar */}
            <header className="relative z-10 border-b border-white/[0.06]">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                        Dashboard
                    </Link>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-green to-emerald-400 flex items-center justify-center">
                            <Zap className="w-4 h-4 text-black" />
                        </div>
                        <span className="text-sm font-black text-white tracking-tight">SolLearn</span>
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-5xl mx-auto px-6 py-10">
                {/* ── Profile Header ── */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row gap-6 items-start mb-10">
                    {/* Avatar */}
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-neon-green/20 to-neon-purple/20 border border-white/10 flex items-center justify-center shrink-0">
                        {profile.avatar ? (
                            <img src={profile.avatar} alt="" className="w-full h-full rounded-2xl object-cover" />
                        ) : (
                            <User className="w-10 h-10 text-zinc-500" />
                        )}
                    </div>

                    <div className="flex-1 space-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-2xl font-black text-white">{profile.name}</h1>
                            <span className="text-sm text-zinc-500">@{username}</span>
                            <button
                                onClick={() => setIsPublic(!isPublic)}
                                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.08] text-[10px] text-zinc-500 hover:text-white transition-colors"
                            >
                                {isPublic ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                {isPublic ? "Public" : "Private"}
                            </button>
                        </div>
                        <p className="text-sm text-zinc-400 max-w-lg">{profile.bio}</p>
                        <div className="flex flex-wrap items-center gap-4 text-zinc-500">
                            <span className="flex items-center gap-1.5 text-xs"><Calendar className="w-3.5 h-3.5" /> Joined {profile.joinDate}</span>
                            {profile.socialLinks.twitter && (
                                <a href="#" className="flex items-center gap-1 text-xs hover:text-neon-cyan transition-colors"><Twitter className="w-3.5 h-3.5" /> @{profile.socialLinks.twitter}</a>
                            )}
                            {profile.socialLinks.github && (
                                <a href="#" className="flex items-center gap-1 text-xs hover:text-white transition-colors"><Github className="w-3.5 h-3.5" /> {profile.socialLinks.github}</a>
                            )}
                            {profile.socialLinks.website && (
                                <a href="#" className="flex items-center gap-1 text-xs hover:text-neon-green transition-colors"><Globe className="w-3.5 h-3.5" /> Website</a>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* ── Stats Row ── */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    {[
                        { icon: Zap, label: "Total XP", value: profile.totalXP.toLocaleString(), color: "text-neon-green", bg: "from-neon-green/10 to-neon-green/5" },
                        { icon: Crown, label: "Level", value: String(profile.level), color: "text-neon-purple", bg: "from-neon-purple/10 to-neon-purple/5" },
                        { icon: Flame, label: "Streak", value: `${profile.streak} days`, color: "text-orange-400", bg: "from-orange-400/10 to-orange-400/5" },
                        { icon: Trophy, label: "Global Rank", value: `#${profile.rank}`, color: "text-amber-400", bg: "from-amber-400/10 to-amber-400/5" },
                    ].map((stat, i) => (
                        <div key={i} className={`p-5 rounded-xl bg-gradient-to-br ${stat.bg} border border-white/[0.06] space-y-3`}>
                            <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            <div>
                                <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
                                <div className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold mt-1">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Level progress */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-10 p-5 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-white flex items-center gap-2">
                            <Crown className="w-4 h-4 text-neon-purple" /> Level {profile.level}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-bold">{profile.totalXP.toLocaleString()} / {nextLevelXP.toLocaleString()} XP</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-white/[0.04] overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${levelProgress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full rounded-full bg-gradient-to-r from-neon-purple to-neon-cyan"
                        />
                    </div>
                    <p className="text-[10px] text-zinc-600 mt-2">{(nextLevelXP - profile.totalXP).toLocaleString()} XP until Level {profile.level + 1}</p>
                </motion.div>

                <div className="grid lg:grid-cols-[1fr_320px] gap-8">
                    <div className="space-y-10">
                        {/* ── Skill Radar ── */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                            <h2 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-neon-cyan" /> Skill Breakdown
                            </h2>
                            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
                                <SkillRadar skills={profile.skills} />
                            </div>
                        </motion.div>

                        {/* ── Achievements ── */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                            <h2 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                                <Award className="w-5 h-5 text-amber-400" /> Achievements
                                <span className="text-[10px] text-zinc-600 font-bold ml-auto">{profile.achievements.filter(a => a.earned).length}/{profile.achievements.length}</span>
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {profile.achievements.map((ach) => (
                                    <div
                                        key={ach.id}
                                        className={`p-4 rounded-xl border text-center space-y-2 transition-all ${ach.earned
                                            ? "border-white/[0.08] bg-white/[0.03] hover:border-neon-green/30"
                                            : "border-white/[0.04] bg-white/[0.01] opacity-40"}`}
                                    >
                                        <div className="text-2xl">{ach.icon}</div>
                                        <div className="text-[11px] font-bold text-white leading-tight">{ach.name}</div>
                                        <div className="text-[9px] text-zinc-600">{ach.earned ? ach.date : "Locked"}</div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* ── Completed Courses ── */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                            <h2 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-neon-green" /> Completed Courses
                            </h2>
                            <div className="space-y-3">
                                {profile.completedCourses.map((c) => (
                                    <Link
                                        key={c.slug}
                                        href={`/courses/${c.slug}`}
                                        className="flex items-center gap-4 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] transition-all group"
                                    >
                                        <CheckCircle2 className="w-5 h-5 text-neon-green shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-bold text-white group-hover:text-neon-green transition-colors">{c.title}</div>
                                            <div className="text-[10px] text-zinc-500">Completed {c.completedDate}</div>
                                        </div>
                                        <span className="text-[10px] font-black text-neon-green flex items-center gap-1"><Zap className="w-3 h-3" /> +{c.xp}</span>
                                        <span className="px-2 py-0.5 rounded bg-amber-400/10 text-amber-400 text-[10px] font-bold">{c.grade}</span>
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* ── Right sidebar: Credentials ── */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
                        <h2 className="text-lg font-black text-white flex items-center gap-2">
                            <Star className="w-5 h-5 text-neon-green" /> On-Chain Credentials
                        </h2>
                        {profile.credentials.map((cred) => (
                            <div key={cred.id} className="rounded-xl border border-white/[0.08] bg-gradient-to-br from-neon-green/5 to-neon-purple/5 p-5 space-y-3">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-8 h-8 rounded-lg bg-neon-green/10 flex items-center justify-center">
                                        <Shield className="w-4 h-4 text-neon-green" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-white">{cred.course}</div>
                                        <div className="text-[9px] text-zinc-500">{cred.date}</div>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[9px] text-zinz-600 uppercase tracking-wider font-bold">Mint</span>
                                        <span className="text-[10px] text-zinc-400 font-mono">{cred.mintAddress}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[9px] text-zinc-600 uppercase tracking-wider font-bold">Level</span>
                                        <span className="text-[10px] text-zinc-400">{cred.level}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[9px] text-zinc-600 uppercase tracking-wider font-bold">Status</span>
                                        <span className="flex items-center gap-1 text-[10px] text-neon-green font-bold">
                                            <CheckCircle2 className="w-3 h-3" /> Verified
                                        </span>
                                    </div>
                                </div>
                                <a href="#" className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-white/[0.08] bg-white/[0.02] text-[10px] text-zinc-400 hover:text-white hover:border-white/[0.15] transition-all">
                                    <ExternalLink className="w-3 h-3" /> View on Solana Explorer
                                </a>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
