"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Crown,
    Flame,
    Medal,
    Search,
    Trophy,
    Zap,
} from "lucide-react";

/* ── stub data ──────────────────────────────────────── */
const leaderboardUsers = [
    { rank: 1, name: "Maya Chen", username: "maya_sol", xp: 12400, level: 11, streak: 45, avatar: "", isCurrentUser: false },
    { rank: 2, name: "Carlos Mendez", username: "carlos_dev", xp: 11200, level: 10, streak: 38, avatar: "", isCurrentUser: false },
    { rank: 3, name: "Aisha Patel", username: "aisha_crypto", xp: 10800, level: 10, streak: 32, avatar: "", isCurrentUser: false },
    { rank: 4, name: "James Wilson", username: "jwilson", xp: 9500, level: 9, streak: 28, avatar: "", isCurrentUser: false },
    { rank: 5, name: "Yuki Tanaka", username: "yuki_anchor", xp: 8900, level: 9, streak: 21, avatar: "", isCurrentUser: false },
    { rank: 6, name: "Elena Volkov", username: "elena_v", xp: 7800, level: 8, streak: 19, avatar: "", isCurrentUser: false },
    { rank: 7, name: "David Kim", username: "d_kim", xp: 7200, level: 8, streak: 15, avatar: "", isCurrentUser: false },
    { rank: 8, name: "You", username: "alex_sol", xp: 4850, level: 7, streak: 14, avatar: "", isCurrentUser: true },
    { rank: 9, name: "Sophie Martin", username: "sophie_m", xp: 4200, level: 6, streak: 12, avatar: "", isCurrentUser: false },
    { rank: 10, name: "Omar Hassan", username: "omar_h", xp: 3800, level: 6, streak: 10, avatar: "", isCurrentUser: false },
    { rank: 11, name: "Lisa Park", username: "lisa_p", xp: 3500, level: 5, streak: 8, avatar: "", isCurrentUser: false },
    { rank: 12, name: "Raj Kumar", username: "raj_k", xp: 3100, level: 5, streak: 7, avatar: "", isCurrentUser: false },
];

const tabs = ["All Time", "Monthly", "Weekly"] as const;

const podiumColors = [
    { bg: "from-amber-400/20 to-amber-400/5", border: "border-amber-400/30", text: "text-amber-400", icon: Crown },
    { bg: "from-zinc-300/20 to-zinc-300/5", border: "border-zinc-400/30", text: "text-zinc-300", icon: Medal },
    { bg: "from-amber-700/20 to-amber-700/5", border: "border-amber-700/30", text: "text-amber-600", icon: Medal },
];

export default function LeaderboardPage() {
    const [activeTab, setActiveTab] = useState<typeof tabs[number]>("All Time");
    const [searchQuery, setSearchQuery] = useState("");

    const filtered = leaderboardUsers.filter((u) =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const top3 = filtered.slice(0, 3);
    const rest = filtered.slice(3);

    return (
        <div className="min-h-screen bg-[#020408] relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-amber-400/[0.02] rounded-full blur-[200px]" />
                <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] bg-neon-purple/[0.03] rounded-full blur-[150px]" />
            </div>

            {/* Top Bar */}
            <header className="relative z-10 border-b border-white/[0.06]">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
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

            <main className="relative z-10 max-w-4xl mx-auto px-6 py-10">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-3 mb-10">
                    <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                        <Trophy className="w-10 h-10 text-amber-400 mx-auto" />
                    </motion.div>
                    <h1 className="text-3xl md:text-4xl font-black text-white">Leaderboard</h1>
                    <p className="text-sm text-zinc-500">Top builders ranked by XP</p>
                </motion.div>

                {/* Tabs + Search */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === tab
                                    ? "bg-white/[0.08] text-white"
                                    : "text-zinc-500 hover:text-zinc-300"}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-neon-green/30 transition-colors w-56"
                        />
                    </div>
                </motion.div>

                {/* ── Podium (top 3) ── */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="grid grid-cols-3 gap-4 mb-8">
                    {/* Order: 2nd, 1st, 3rd for visual podium */}
                    {[top3[1], top3[0], top3[2]].map((user, displayIdx) => {
                        if (!user) return <div key={displayIdx} />;
                        const podiumIdx = displayIdx === 1 ? 0 : displayIdx === 0 ? 1 : 2;
                        const pc = podiumColors[podiumIdx];
                        const PodiumIcon = pc.icon;
                        return (
                            <motion.div
                                key={user.rank}
                                whileHover={{ y: -4 }}
                                className={`p-5 rounded-xl border ${pc.border} bg-gradient-to-b ${pc.bg} text-center space-y-3 ${displayIdx === 1 ? "-mt-4" : "mt-4"}`}
                            >
                                <PodiumIcon className={`w-6 h-6 mx-auto ${pc.text}`} />
                                <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/[0.08] flex items-center justify-center text-lg font-black text-white">
                                    {user.name.split(" ").map(n => n[0]).join("")}
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-white">{user.name}</div>
                                    <div className="text-[10px] text-zinc-500">@{user.username}</div>
                                </div>
                                <div className="flex items-center justify-center gap-1 text-neon-green font-black text-sm">
                                    <Zap className="w-3.5 h-3.5" /> {user.xp.toLocaleString()}
                                </div>
                                <div className="flex items-center justify-center gap-3 text-[10px] text-zinc-500">
                                    <span>Lv.{user.level}</span>
                                    <span className="flex items-center gap-0.5"><Flame className="w-3 h-3 text-orange-400" /> {user.streak}d</span>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* ── Rest of leaderboard ── */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-2">
                    {rest.map((user, i) => (
                        <motion.div
                            key={user.rank}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + i * 0.04 }}
                            className={`flex items-center gap-4 px-5 py-4 rounded-xl border transition-all ${user.isCurrentUser
                                ? "border-neon-green/30 bg-neon-green/5"
                                : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1]"}`}
                        >
                            {/* Rank */}
                            <span className={`w-8 text-center text-sm font-black ${user.isCurrentUser ? "text-neon-green" : "text-zinc-600"}`}>
                                #{user.rank}
                            </span>

                            {/* Avatar */}
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${user.isCurrentUser
                                ? "bg-gradient-to-br from-neon-green/20 to-neon-cyan/20 border border-neon-green/20 text-neon-green"
                                : "bg-white/[0.04] border border-white/[0.08] text-zinc-400"
                                }`}>
                                {user.name.split(" ").map(n => n[0]).join("")}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className={`text-sm font-bold ${user.isCurrentUser ? "text-neon-green" : "text-white"}`}>{user.name}</span>
                                    {user.isCurrentUser && <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-neon-green/10 text-neon-green uppercase">You</span>}
                                </div>
                                <span className="text-[10px] text-zinc-600">@{user.username}</span>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center gap-5 shrink-0">
                                <span className="flex items-center gap-1 text-xs text-zinc-400">
                                    <Flame className="w-3 h-3 text-orange-400" /> {user.streak}d
                                </span>
                                <span className="text-[10px] text-zinc-500 font-bold">Lv.{user.level}</span>
                                <span className="flex items-center gap-1 text-sm font-black text-neon-green w-20 justify-end">
                                    <Zap className="w-3.5 h-3.5" /> {user.xp.toLocaleString()}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </main>
        </div>
    );
}
