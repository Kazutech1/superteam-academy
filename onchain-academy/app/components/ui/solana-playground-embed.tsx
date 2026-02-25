"use client";

export function SolanaPlaygroundEmbed({
    initialCode,
    lessonId,
}: {
    initialCode: string;
    lessonId: string;
}) {
    const embedUrl = `https://beta.solpg.io/embed?code=${encodeURIComponent(initialCode)}`;

    return (
        <div className="w-full h-full relative group">
            {/* Corner brackets */}
            <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-neon-green/20 z-10 pointer-events-none" />
            <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-neon-green/20 z-10 pointer-events-none" />

            <iframe
                src={embedUrl}
                className="w-full h-full border-0 bg-[#1e1e1e]"
                allow="clipboard-read; clipboard-write"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                title={`Solana Playground - ${lessonId}`}
                loading="lazy"
            />
        </div>
    );
}
