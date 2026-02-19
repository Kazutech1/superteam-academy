"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    ArrowRight,
    BookOpen,
    CheckCircle2,
    ChevronRight,
    Code2,
    Copy,
    Flame,
    Lightbulb,
    List,
    Loader2,
    Play,
    RotateCcw,
    Shield,
    Sparkles,
    Terminal,
    X,
    Zap,
} from "lucide-react";

/* ── stub lesson data ────────────────────────────────────── */
const lessonData = {
    id: "l5",
    title: "Instructions & Programs",
    type: "doc" as const,
    content: `
# Instructions & Programs on Solana

Every transaction on Solana is composed of one or more **instructions**. Each instruction targets a specific **program** (smart contract) deployed on-chain.

## Anatomy of an Instruction

\`\`\`rust
pub struct Instruction {
    /// The program that will process this instruction
    pub program_id: Pubkey,
    /// Accounts required by the instruction
    pub accounts: Vec<AccountMeta>,
    /// Serialized instruction data
    pub data: Vec<u8>,
}
\`\`\`

### Key Concepts

1. **Program ID** — The public key of the on-chain program
2. **Account Metas** — List of accounts the instruction reads/writes
3. **Instruction Data** — Serialized arguments for the program

## System Program Example

The System Program is one of Solana's built-in programs:

\`\`\`typescript
import { SystemProgram, Transaction } from "@solana/web3.js";

const tx = new Transaction().add(
  SystemProgram.transfer({
    fromPubkey: sender.publicKey,
    toPubkey: receiver.publicKey,
    lamports: 1_000_000_000, // 1 SOL
  })
);
\`\`\`

> **💡 Tip:** Every SOL transfer is just an instruction to the System Program!

## Cross-Program Invocations (CPI)

Programs can call other programs using CPIs. This is how composability works on Solana — like LEGO blocks snapping together.
    `,
    milestone: { id: "m2", title: "Transactions Deep Dive" },
    course: { slug: "intro-to-solana", title: "Intro to Solana" },
    prev: { id: "l4", title: "Transaction Structure" },
    next: { id: "l6", title: "Build a Transaction" },
    xpReward: 25,
    completed: false,
    hasChallenge: true,
    challenge: {
        title: "Create a Transfer Instruction",
        description: "Write a function that creates a SOL transfer instruction using the System Program. The function should accept sender, receiver, and amount parameters.",
        starterCode: `import { SystemProgram, PublicKey } from "@solana/web3.js";

function createTransferInstruction(
  sender: PublicKey,
  receiver: PublicKey,
  lamports: number
) {
  // TODO: Return a SystemProgram.transfer instruction
  
}`,
        testCases: [
            { id: "t1", name: "Returns a valid instruction object", passed: null as boolean | null },
            { id: "t2", name: "Uses correct sender public key", passed: null as boolean | null },
            { id: "t3", name: "Transfers correct lamport amount", passed: null as boolean | null },
        ],
        expectedOutput: "✓ All 3 test cases passed!",
        xp: 50,
    },
};

const sidebarLessons = [
    { id: "l4", title: "Transaction Structure", type: "video", completed: true },
    { id: "l5", title: "Instructions & Programs", type: "doc", completed: false },
    { id: "l6", title: "Build a Transaction", type: "test", completed: false },
];

const typeIcons: Record<string, { icon: typeof Play; color: string }> = {
    video: { icon: Play, color: "text-neon-cyan" },
    doc: { icon: BookOpen, color: "text-neon-purple" },
    test: { icon: Shield, color: "text-amber-400" },
};

/* ── simple markdown-ish renderer ─────────────────────── */
function renderContent(md: string) {
    const lines = md.trim().split("\n");
    const elements: React.ReactNode[] = [];
    let codeBlock: string[] | null = null;
    let codeLanguage = "";

    lines.forEach((line, i) => {
        // code fences
        if (line.trim().startsWith("```")) {
            if (codeBlock !== null) {
                elements.push(
                    <div key={`code-${i}`} className="my-4 rounded-xl border border-white/[0.06] bg-[#0a0f1a] overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.06] bg-white/[0.02]">
                            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{codeLanguage || "code"}</span>
                            <button className="text-zinc-500 hover:text-white transition-colors"><Copy className="w-3.5 h-3.5" /></button>
                        </div>
                        <pre className="p-4 text-sm text-zinc-300 overflow-x-auto font-mono leading-relaxed">
                            <code>{codeBlock.join("\n")}</code>
                        </pre>
                    </div>
                );
                codeBlock = null;
            } else {
                codeLanguage = line.trim().replace("```", "");
                codeBlock = [];
            }
            return;
        }
        if (codeBlock !== null) { codeBlock.push(line); return; }

        // headings
        if (line.startsWith("# ")) { elements.push(<h1 key={i} className="text-2xl font-black text-white mt-8 mb-4">{line.slice(2)}</h1>); return; }
        if (line.startsWith("## ")) { elements.push(<h2 key={i} className="text-xl font-black text-white mt-6 mb-3">{line.slice(3)}</h2>); return; }
        if (line.startsWith("### ")) { elements.push(<h3 key={i} className="text-lg font-bold text-white mt-4 mb-2">{line.slice(4)}</h3>); return; }

        // blockquote
        if (line.startsWith("> ")) {
            elements.push(
                <div key={i} className="my-3 pl-4 border-l-2 border-neon-green/40 text-sm text-zinc-400 italic">{line.slice(2)}</div>
            );
            return;
        }

        // numbered list
        if (/^\d+\.\s/.test(line.trim())) {
            elements.push(<li key={i} className="text-sm text-zinc-300 ml-4 mb-1 list-decimal leading-relaxed">{line.replace(/^\d+\.\s/, "")}</li>);
            return;
        }

        // empty line
        if (line.trim() === "") { elements.push(<div key={i} className="h-2" />); return; }

        // paragraph — handle inline code
        const parts = line.split(/(`[^`]+`)/g);
        elements.push(
            <p key={i} className="text-sm text-zinc-400 leading-relaxed mb-2">
                {parts.map((part, j) =>
                    part.startsWith("`") && part.endsWith("`")
                        ? <code key={j} className="px-1.5 py-0.5 rounded bg-white/[0.06] text-neon-cyan text-xs font-mono">{part.slice(1, -1)}</code>
                        : <span key={j}>{part}</span>
                )}
            </p>
        );
    });
    return elements;
}

export default function LessonPage() {
    const { slug, id } = useParams<{ slug: string; id: string }>();
    const lesson = lessonData; // stubbed — always same data
    const [showSidebar, setShowSidebar] = useState(false);
    const [showHint, setShowHint] = useState(false);

    /* Code challenge state */
    const [code, setCode] = useState(lesson.challenge.starterCode);
    const [isRunning, setIsRunning] = useState(false);
    const [output, setOutput] = useState<string | null>(null);
    const [testResults, setTestResults] = useState(lesson.challenge.testCases);
    const [challengeCompleted, setChallengeCompleted] = useState(false);
    const [showChallenge, setShowChallenge] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    /* Divider drag state */
    const [splitPercent, setSplitPercent] = useState(55);
    const dragging = useRef(false);

    const handleMouseDown = useCallback(() => { dragging.current = true; }, []);
    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!dragging.current) return;
        const container = (e.currentTarget as HTMLElement);
        const rect = container.getBoundingClientRect();
        const pct = ((e.clientX - rect.left) / rect.width) * 100;
        setSplitPercent(Math.min(80, Math.max(30, pct)));
    }, []);
    const handleMouseUp = useCallback(() => { dragging.current = false; }, []);

    /* Simulated test run */
    const runTests = useCallback(() => {
        setIsRunning(true);
        setOutput(null);
        setTimeout(() => {
            const allPass = code.includes("SystemProgram.transfer");
            const results = lesson.challenge.testCases.map((tc) => ({
                ...tc,
                passed: allPass ? true : Math.random() > 0.5,
            }));
            setTestResults(results);
            const passed = results.filter((r) => r.passed).length;
            if (passed === results.length) {
                setOutput(`✓ All ${results.length} test cases passed!`);
                setChallengeCompleted(true);
            } else {
                setOutput(`✗ ${passed}/${results.length} test cases passed. Check your implementation.`);
            }
            setIsRunning(false);
        }, 1500);
    }, [code, lesson.challenge.testCases]);

    const resetCode = () => {
        setCode(lesson.challenge.starterCode);
        setTestResults(lesson.challenge.testCases);
        setOutput(null);
        setChallengeCompleted(false);
    };

    return (
        <div className="h-screen flex flex-col bg-[#020408] overflow-hidden" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>

            {/* Top Bar */}
            <header className="shrink-0 z-20 border-b border-white/[0.06] bg-[#020408]">
                <div className="px-4 h-12 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <Link href={`/courses/${slug}`} className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors shrink-0 group">
                            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                            Back
                        </Link>
                        <div className="h-4 w-px bg-white/10" />
                        <span className="text-[10px] text-zinc-600 truncate">{lesson.course.title}</span>
                        <ChevronRight className="w-3 h-3 text-zinc-700 shrink-0" />
                        <span className="text-[10px] text-zinc-500 truncate">{lesson.milestone.title}</span>
                        <ChevronRight className="w-3 h-3 text-zinc-700 shrink-0" />
                        <span className="text-xs text-white font-bold truncate">{lesson.title}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            onClick={() => setShowSidebar(!showSidebar)}
                            className="p-2 rounded-lg hover:bg-white/5 transition-colors text-zinc-500 hover:text-white"
                        >
                            <List className="w-4 h-4" />
                        </button>
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neon-green/10 text-neon-green text-[10px] font-bold">
                            <Zap className="w-3 h-3" /> +{lesson.xpReward} XP
                        </span>
                    </div>
                </div>
            </header>

            {/* Main split area */}
            <div className="flex-1 flex overflow-hidden relative">

                {/* ── Left: Content ── */}
                <div className="overflow-y-auto" style={{ width: `${splitPercent}%` }}>
                    <div className="max-w-3xl mx-auto px-8 py-8">
                        {renderContent(lesson.content)}

                        {/* Challenge toggle */}
                        {lesson.hasChallenge && (
                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                onClick={() => setShowChallenge(!showChallenge)}
                                className="mt-8 w-full flex items-center gap-3 p-4 rounded-xl border border-neon-green/20 bg-neon-green/5 hover:bg-neon-green/10 transition-all text-left"
                            >
                                <Code2 className="w-5 h-5 text-neon-green shrink-0" />
                                <div className="flex-1">
                                    <div className="text-sm font-bold text-white">{lesson.challenge.title}</div>
                                    <div className="text-[10px] text-zinc-500">Complete the challenge to earn +{lesson.challenge.xp} XP</div>
                                </div>
                                <ChevronRight className={`w-4 h-4 text-neon-green transition-transform ${showChallenge ? "rotate-90" : ""}`} />
                            </motion.button>
                        )}

                        {/* Hint */}
                        <div className="mt-6">
                            <button onClick={() => setShowHint(!showHint)} className="flex items-center gap-2 text-xs text-zinc-500 hover:text-amber-400 transition-colors">
                                <Lightbulb className="w-3.5 h-3.5" /> {showHint ? "Hide Hint" : "Show Hint"}
                            </button>
                            <AnimatePresence>
                                {showHint && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                                        <div className="mt-3 p-4 rounded-xl bg-amber-400/5 border border-amber-400/10 text-xs text-amber-300/80 leading-relaxed">
                                            💡 Remember that <code className="px-1 py-0.5 bg-white/5 rounded text-amber-300 font-mono text-[11px]">SystemProgram.transfer()</code> accepts an object with <code className="px-1 py-0.5 bg-white/5 rounded text-amber-300 font-mono text-[11px]">fromPubkey</code>, <code className="px-1 py-0.5 bg-white/5 rounded text-amber-300 font-mono text-[11px]">toPubkey</code>, and <code className="px-1 py-0.5 bg-white/5 rounded text-amber-300 font-mono text-[11px]">lamports</code> fields.
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Nav */}
                        <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/[0.05]">
                            {lesson.prev ? (
                                <Link href={`/courses/${slug}/lessons/${lesson.prev.id}`} className="flex items-center gap-2 text-xs text-zinc-500 hover:text-white transition-colors group">
                                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                                    {lesson.prev.title}
                                </Link>
                            ) : <div />}
                            {lesson.next ? (
                                <Link href={`/courses/${slug}/lessons/${lesson.next.id}`} className="flex items-center gap-2 text-xs text-zinc-500 hover:text-white transition-colors group">
                                    {lesson.next.title}
                                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                </Link>
                            ) : <div />}
                        </div>

                        <div className="h-12" />
                    </div>
                </div>

                {/* ── Drag divider ── */}
                <div
                    onMouseDown={handleMouseDown}
                    className="w-1.5 shrink-0 cursor-col-resize bg-white/[0.04] hover:bg-neon-green/20 active:bg-neon-green/40 transition-colors z-10"
                />

                {/* ── Right: Code editor / Challenge ── */}
                <div className="flex-1 flex flex-col overflow-hidden bg-[#0a0f1a]">
                    {showChallenge && lesson.hasChallenge ? (
                        <>
                            {/* Challenge header */}
                            <div className="shrink-0 px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Code2 className="w-4 h-4 text-neon-green" />
                                    <span className="text-xs font-bold text-white">{lesson.challenge.title}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={resetCode} className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-500 hover:text-white transition-colors" title="Reset code">
                                        <RotateCcw className="w-3.5 h-3.5" />
                                    </button>
                                    <button onClick={() => setShowChallenge(false)} className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-500 hover:text-white transition-colors">
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>

                            {/* Challenge description */}
                            <div className="shrink-0 px-4 py-3 border-b border-white/[0.06] bg-white/[0.01]">
                                <p className="text-xs text-zinc-400 leading-relaxed">{lesson.challenge.description}</p>
                            </div>

                            {/* Code textarea */}
                            <div className="flex-1 overflow-hidden relative">
                                <textarea
                                    ref={textareaRef}
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    spellCheck={false}
                                    className="w-full h-full p-4 bg-transparent text-sm text-zinc-300 font-mono resize-none focus:outline-none leading-relaxed placeholder:text-zinc-700"
                                    placeholder="Write your code here..."
                                />
                            </div>

                            {/* Test cases */}
                            <div className="shrink-0 border-t border-white/[0.06]">
                                <div className="px-4 py-2 flex items-center gap-2 border-b border-white/[0.04]">
                                    <Terminal className="w-3.5 h-3.5 text-zinc-500" />
                                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Test Cases</span>
                                </div>
                                <div className="px-4 py-2 space-y-1.5 max-h-32 overflow-y-auto">
                                    {testResults.map((tc) => (
                                        <div key={tc.id} className="flex items-center gap-2 text-xs">
                                            {tc.passed === null ? (
                                                <div className="w-3.5 h-3.5 rounded-full border border-zinc-700" />
                                            ) : tc.passed ? (
                                                <CheckCircle2 className="w-3.5 h-3.5 text-neon-green" />
                                            ) : (
                                                <X className="w-3.5 h-3.5 text-red-400" />
                                            )}
                                            <span className={tc.passed === null ? "text-zinc-500" : tc.passed ? "text-neon-green" : "text-red-400"}>
                                                {tc.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Output */}
                            <AnimatePresence>
                                {output && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="shrink-0 border-t border-white/[0.06] px-4 py-3"
                                    >
                                        <p className={`text-xs font-mono ${challengeCompleted ? "text-neon-green" : "text-red-400"}`}>
                                            {output}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Run / Complete bar */}
                            <div className="shrink-0 px-4 py-3 border-t border-white/[0.06] flex items-center justify-between bg-white/[0.01]">
                                <span className="flex items-center gap-1 text-[10px] text-neon-green font-bold">
                                    <Zap className="w-3 h-3" /> +{lesson.challenge.xp} XP
                                </span>
                                <div className="flex items-center gap-2">
                                    {challengeCompleted && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neon-green/10 text-neon-green text-[10px] font-bold"
                                        >
                                            <Sparkles className="w-3.5 h-3.5" /> Challenge Complete!
                                        </motion.div>
                                    )}
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={runTests}
                                        disabled={isRunning}
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-neon-green to-emerald-400 text-black text-xs font-black disabled:opacity-50"
                                    >
                                        {isRunning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                                        {isRunning ? "Running…" : "Run Tests"}
                                    </motion.button>
                                </div>
                            </div>
                        </>
                    ) : (
                        /* Placeholder when no challenge active */
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center space-y-3">
                                <Code2 className="w-10 h-10 text-zinc-700 mx-auto" />
                                <p className="text-xs text-zinc-600">
                                    {lesson.hasChallenge
                                        ? "Open the challenge from the lesson content to start coding"
                                        : "No code challenge for this lesson"}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Sidebar overlay ── */}
                <AnimatePresence>
                    {showSidebar && (
                        <>
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50 z-30" onClick={() => setShowSidebar(false)} />
                            <motion.div
                                initial={{ x: "100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "100%" }}
                                transition={{ type: "spring", damping: 25, stiffness: 250 }}
                                className="absolute right-0 top-0 bottom-0 w-72 bg-[#0a0f1a] border-l border-white/[0.06] z-40 overflow-y-auto"
                            >
                                <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
                                    <span className="text-xs font-bold text-white">{lesson.milestone.title}</span>
                                    <button onClick={() => setShowSidebar(false)} className="p-1 rounded hover:bg-white/5 text-zinc-500"><X className="w-4 h-4" /></button>
                                </div>
                                <div className="p-3 space-y-1">
                                    {sidebarLessons.map((sl) => {
                                        const ti = typeIcons[sl.type] || typeIcons.doc;
                                        const Icon = ti.icon;
                                        const isActive = sl.id === id || sl.id === lesson.id;
                                        return (
                                            <Link
                                                key={sl.id}
                                                href={`/courses/${slug}/lessons/${sl.id}`}
                                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? "bg-white/[0.06] border border-white/[0.08]" : "hover:bg-white/[0.03]"}`}
                                            >
                                                <Icon className={`w-4 h-4 ${ti.color} shrink-0`} />
                                                <span className={`text-xs flex-1 ${isActive ? "text-white font-bold" : sl.completed ? "text-zinc-500" : "text-zinc-400"}`}>{sl.title}</span>
                                                {sl.completed && <CheckCircle2 className="w-3.5 h-3.5 text-neon-green shrink-0" />}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>

            {/* Bottom bar */}
            <div className="shrink-0 border-t border-white/[0.06] bg-[#020408] px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {lesson.prev ? (
                        <Link href={`/courses/${slug}/lessons/${lesson.prev.id}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/5 text-xs text-zinc-500 hover:text-white transition-colors">
                            <ArrowLeft className="w-3 h-3" /> Previous
                        </Link>
                    ) : <div />}
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-neon-green to-emerald-400 text-black text-xs font-black"
                >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Mark Complete
                </motion.button>
                <div className="flex items-center gap-3">
                    {lesson.next ? (
                        <Link href={`/courses/${slug}/lessons/${lesson.next.id}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/5 text-xs text-zinc-500 hover:text-white transition-colors">
                            Next <ArrowRight className="w-3 h-3" />
                        </Link>
                    ) : <div />}
                </div>
            </div>
        </div>
    );
}
