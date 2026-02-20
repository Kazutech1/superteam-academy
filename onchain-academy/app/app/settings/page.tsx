"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Bell,
    BellOff,
    Camera,
    Download,
    Eye,
    EyeOff,
    Github,
    Globe,
    Key,
    Laptop,
    Lock,
    LogOut,
    Mail,
    Moon,
    Palette,
    Save,
    Shield,
    Sun,
    Twitter,
    User,
    Wallet,
    Zap,
} from "lucide-react";

const tabs = ["Profile", "Account", "Preferences", "Privacy"] as const;

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<typeof tabs[number]>("Profile");

    /* Profile form state */
    const [name, setName] = useState("Alex Rivera");
    const [bio, setBio] = useState("Full-stack Solana builder. Passionate about DeFi and on-chain governance.");
    const [twitter, setTwitter] = useState("alex_sol");
    const [github, setGithub] = useState("alexrivera");
    const [website, setWebsite] = useState("https://alexrivera.dev");

    /* Preferences state */
    const [theme, setTheme] = useState<"dark" | "light" | "system">("dark");
    const [language, setLanguage] = useState("en");
    const [notifications, setNotifications] = useState({ streaks: true, achievements: true, updates: false, marketing: false });

    /* Privacy state */
    const [profileVisibility, setProfileVisibility] = useState(true);
    const [showXP, setShowXP] = useState(true);
    const [showStreak, setShowStreak] = useState(true);

    const tabIcons: Record<typeof tabs[number], typeof User> = {
        Profile: User,
        Account: Key,
        Preferences: Palette,
        Privacy: Shield,
    };

    return (
        <div className="min-h-screen bg-[#020408] relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-neon-green/[0.02] rounded-full blur-[200px]" />
                <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-neon-purple/[0.02] rounded-full blur-[150px]" />
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
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-3xl font-black text-white mb-2">Settings</h1>
                    <p className="text-sm text-zinc-500 mb-8">Manage your account and preferences</p>
                </motion.div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* ── Sidebar tabs ── */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="md:w-52 shrink-0">
                        <nav className="space-y-1">
                            {tabs.map((tab) => {
                                const Icon = tabIcons[tab];
                                return (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab
                                            ? "bg-white/[0.06] text-white border border-white/[0.08]"
                                            : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]"
                                            }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {tab}
                                    </button>
                                );
                            })}
                        </nav>
                    </motion.div>

                    {/* ── Content ── */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="flex-1 min-w-0">

                        {/* ── Profile Tab ── */}
                        {activeTab === "Profile" && (
                            <div className="space-y-6">
                                {/* Avatar */}
                                <div className="flex items-center gap-5">
                                    <div className="relative group">
                                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-neon-green/20 to-neon-purple/20 border border-white/10 flex items-center justify-center">
                                            <User className="w-8 h-8 text-zinc-500" />
                                        </div>
                                        <button className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Camera className="w-5 h-5 text-white" />
                                        </button>
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-white">Profile Photo</div>
                                        <div className="text-[10px] text-zinc-500">JPG, PNG, or GIF. Max 2MB.</div>
                                    </div>
                                </div>

                                {/* Form fields */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-2">Display Name</label>
                                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-neon-green/30 transition-colors" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-2">Bio</label>
                                        <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-neon-green/30 transition-colors resize-none" />
                                    </div>
                                </div>

                                {/* Social links */}
                                <div>
                                    <h3 className="text-sm font-bold text-white mb-3">Social Links</h3>
                                    <div className="space-y-3">
                                        {[
                                            { icon: Twitter, label: "Twitter", value: twitter, setter: setTwitter, prefix: "@" },
                                            { icon: Github, label: "GitHub", value: github, setter: setGithub, prefix: "" },
                                            { icon: Globe, label: "Website", value: website, setter: setWebsite, prefix: "" },
                                        ].map((social) => (
                                            <div key={social.label} className="flex items-center gap-3">
                                                <social.icon className="w-4 h-4 text-zinc-500 shrink-0" />
                                                <input
                                                    type="text"
                                                    value={social.value}
                                                    onChange={(e) => social.setter(e.target.value)}
                                                    placeholder={social.label}
                                                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-neon-green/30 transition-colors"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-neon-green to-emerald-400 text-black text-sm font-black"
                                >
                                    <Save className="w-4 h-4" /> Save Changes
                                </motion.button>
                            </div>
                        )}

                        {/* ── Account Tab ── */}
                        {activeTab === "Account" && (
                            <div className="space-y-6">
                                {/* Email */}
                                <div className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-neon-cyan" />
                                        <span className="text-sm font-bold text-white">Email</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <input type="email" value="alex@example.com" readOnly className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-zinc-400 focus:outline-none" />
                                        <button className="px-4 py-2.5 rounded-xl border border-white/[0.08] text-xs text-zinc-400 hover:text-white hover:border-white/[0.15] transition-all">Change</button>
                                    </div>
                                </div>

                                {/* Connected Wallets */}
                                <div className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Wallet className="w-4 h-4 text-neon-purple" />
                                        <span className="text-sm font-bold text-white">Connected Wallets</span>
                                    </div>
                                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                                        <div className="w-8 h-8 rounded-lg bg-neon-purple/10 flex items-center justify-center">
                                            <Wallet className="w-4 h-4 text-neon-purple" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs font-bold text-white">Phantom</div>
                                            <div className="text-[10px] text-zinc-500 font-mono truncate">8xK3...v7Rp</div>
                                        </div>
                                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-neon-green/10 text-neon-green">Connected</span>
                                    </div>
                                    <button className="w-full px-4 py-2.5 rounded-xl border border-dashed border-white/[0.08] text-xs text-zinc-500 hover:text-white hover:border-white/[0.15] transition-all">
                                        + Connect Another Wallet
                                    </button>
                                </div>

                                {/* OAuth Providers */}
                                <div className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Lock className="w-4 h-4 text-amber-400" />
                                        <span className="text-sm font-bold text-white">Connected Accounts</span>
                                    </div>
                                    {[
                                        { name: "Google", icon: Globe, connected: true, color: "text-red-400" },
                                        { name: "GitHub", icon: Github, connected: true, color: "text-white" },
                                    ].map((provider) => (
                                        <div key={provider.name} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                                            <provider.icon className={`w-4 h-4 ${provider.color}`} />
                                            <span className="text-xs font-bold text-white flex-1">{provider.name}</span>
                                            {provider.connected ? (
                                                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-neon-green/10 text-neon-green">Connected</span>
                                            ) : (
                                                <button className="px-3 py-1 rounded-lg border border-white/[0.08] text-[10px] text-zinc-400 hover:text-white transition-colors">Connect</button>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Danger Zone */}
                                <div className="p-5 rounded-xl border border-red-500/20 bg-red-500/5 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <LogOut className="w-4 h-4 text-red-400" />
                                        <span className="text-sm font-bold text-red-400">Danger Zone</span>
                                    </div>
                                    <button className="px-4 py-2.5 rounded-xl border border-red-500/20 text-xs text-red-400 hover:bg-red-500/10 transition-colors">
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ── Preferences Tab ── */}
                        {activeTab === "Preferences" && (
                            <div className="space-y-6">
                                {/* Theme */}
                                <div className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Palette className="w-4 h-4 text-neon-cyan" />
                                        <span className="text-sm font-bold text-white">Theme</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        {([
                                            { value: "dark", label: "Dark", icon: Moon },
                                            { value: "light", label: "Light", icon: Sun },
                                            { value: "system", label: "System", icon: Laptop },
                                        ] as const).map(({ value, label, icon: Icon }) => (
                                            <button
                                                key={value}
                                                onClick={() => setTheme(value)}
                                                className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-xs font-bold transition-all ${theme === value
                                                    ? "border-neon-green/30 bg-neon-green/5 text-neon-green"
                                                    : "border-white/[0.06] text-zinc-500 hover:text-zinc-300"}`}
                                            >
                                                <Icon className="w-4 h-4" /> {label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Language */}
                                <div className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Globe className="w-4 h-4 text-neon-purple" />
                                        <span className="text-sm font-bold text-white">Language</span>
                                    </div>
                                    <select
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-neon-green/30 transition-colors appearance-none"
                                    >
                                        <option value="en">English</option>
                                        <option value="pt">Português</option>
                                        <option value="es">Español</option>
                                        <option value="zh">中文</option>
                                    </select>
                                </div>

                                {/* Notifications */}
                                <div className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Bell className="w-4 h-4 text-amber-400" />
                                        <span className="text-sm font-bold text-white">Notifications</span>
                                    </div>
                                    {[
                                        { key: "streaks" as const, label: "Streak reminders", desc: "Get reminded to maintain your streak" },
                                        { key: "achievements" as const, label: "Achievement alerts", desc: "When you earn new badges" },
                                        { key: "updates" as const, label: "Course updates", desc: "New lessons and content" },
                                        { key: "marketing" as const, label: "Marketing emails", desc: "News and promotions" },
                                    ].map((n) => (
                                        <div key={n.key} className="flex items-center justify-between">
                                            <div>
                                                <div className="text-xs font-bold text-white">{n.label}</div>
                                                <div className="text-[10px] text-zinc-500">{n.desc}</div>
                                            </div>
                                            <button
                                                onClick={() => setNotifications({ ...notifications, [n.key]: !notifications[n.key] })}
                                                className={`w-10 h-6 rounded-full transition-all flex items-center px-1 ${notifications[n.key] ? "bg-neon-green/30" : "bg-white/[0.06]"}`}
                                            >
                                                <div className={`w-4 h-4 rounded-full transition-all ${notifications[n.key] ? "bg-neon-green translate-x-4" : "bg-zinc-600 translate-x-0"}`} />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-neon-green to-emerald-400 text-black text-sm font-black"
                                >
                                    <Save className="w-4 h-4" /> Save Preferences
                                </motion.button>
                            </div>
                        )}

                        {/* ── Privacy Tab ── */}
                        {activeTab === "Privacy" && (
                            <div className="space-y-6">
                                <div className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Shield className="w-4 h-4 text-neon-green" />
                                        <span className="text-sm font-bold text-white">Profile Visibility</span>
                                    </div>
                                    {[
                                        { label: "Public Profile", desc: "Anyone can view your profile", value: profileVisibility, setter: setProfileVisibility },
                                        { label: "Show XP & Level", desc: "Display your XP and level publicly", value: showXP, setter: setShowXP },
                                        { label: "Show Streak", desc: "Display your streak on your profile", value: showStreak, setter: setShowStreak },
                                    ].map((setting) => (
                                        <div key={setting.label} className="flex items-center justify-between">
                                            <div>
                                                <div className="text-xs font-bold text-white flex items-center gap-2">
                                                    {setting.value ? <Eye className="w-3.5 h-3.5 text-neon-green" /> : <EyeOff className="w-3.5 h-3.5 text-zinc-500" />}
                                                    {setting.label}
                                                </div>
                                                <div className="text-[10px] text-zinc-500 ml-5">{setting.desc}</div>
                                            </div>
                                            <button
                                                onClick={() => setting.setter(!setting.value)}
                                                className={`w-10 h-6 rounded-full transition-all flex items-center px-1 ${setting.value ? "bg-neon-green/30" : "bg-white/[0.06]"}`}
                                            >
                                                <div className={`w-4 h-4 rounded-full transition-all ${setting.value ? "bg-neon-green translate-x-4" : "bg-zinc-600 translate-x-0"}`} />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Data export */}
                                <div className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Download className="w-4 h-4 text-neon-cyan" />
                                        <span className="text-sm font-bold text-white">Data Export</span>
                                    </div>
                                    <p className="text-[10px] text-zinc-500">Download a copy of all your data including progress, achievements, and profile info.</p>
                                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.08] text-xs text-zinc-400 hover:text-white hover:border-white/[0.15] transition-all">
                                        <Download className="w-3.5 h-3.5" /> Export My Data
                                    </button>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-neon-green to-emerald-400 text-black text-sm font-black"
                                >
                                    <Save className="w-4 h-4" /> Save Privacy Settings
                                </motion.button>
                            </div>
                        )}
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
