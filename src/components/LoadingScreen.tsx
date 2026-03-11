"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function LoadingScreen() {
    const [progress, setProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Animate progress 0 → 100 over ~1.8s (a bit faster for better UX)
        let start: number | null = null;
        const DURATION = 2000;

        const tick = (timestamp: number) => {
            start ??= timestamp;
            const elapsed = timestamp - start;
            const pct = Math.min((elapsed / DURATION) * 100, 100);
            setProgress(pct);

            if (elapsed < DURATION) {
                requestAnimationFrame(tick);
            } else {
                // Brief hold then start reveal
                setTimeout(() => setIsComplete(true), 150);
                // Total cleanup after reveal finishes (shutter takes 0.9s)
                setTimeout(() => setIsVisible(false), 1200);
            }
        };

        const raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[9999] overflow-hidden pointer-events-none">
            {/* ── SHUTTER TOP PANEL ── */}
            <motion.div
                initial={{ y: 0 }}
                animate={isComplete ? { y: "-100%" } : { y: 0 }}
                transition={{ duration: 1.1, ease: [0.7, 0, 0.2, 1], delay: 0.1 }}
                className="absolute top-0 left-0 w-full h-1/2 bg-[#050505] pointer-events-auto z-20 overflow-hidden"
            >
                {/* Grain Texture */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
            </motion.div>

            {/* ── SHUTTER BOTTOM PANEL ── */}
            <motion.div
                initial={{ y: 0 }}
                animate={isComplete ? { y: "100%" } : { y: 0 }}
                transition={{ duration: 1.1, ease: [0.7, 0, 0.2, 1], delay: 0.1 }}
                className="absolute bottom-0 left-0 w-full h-1/2 bg-[#050505] pointer-events-auto z-20 overflow-hidden"
            >
                {/* Grain Texture */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
            </motion.div>

            {/* ── CENTERED LOADER ── */}
            <AnimatePresence>
                {!isComplete && (
                    <motion.div
                        key="center-loader"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none"
                    >
                        {/* Circular Progress (Minimalist Circle) */}
                        <div className="relative w-32 h-32 flex items-center justify-center">
                            {/* Static track */}
                            <svg className="absolute w-full h-full -rotate-90">
                                <circle
                                    cx="64"
                                    cy="64"
                                    r="60"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    fill="transparent"
                                    className="text-white/5"
                                />
                                {/* Dynamic stroke */}
                                <motion.circle
                                    cx="64"
                                    cy="64"
                                    r="60"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    fill="transparent"
                                    strokeDasharray="377" // 2 * pi * 60
                                    style={{
                                        strokeDashoffset: 377 - (377 * progress) / 100,
                                    }}
                                    className="text-white/40"
                                />
                            </svg>

                            {/* Percentage Counter */}
                            <span className="font-heading text-4xl md:text-5xl font-light text-white tracking-tight tabular-nums relative z-40">
                                {Math.floor(progress)}<span className="text-white/20 text-2xl ml-0.5">%</span>
                            </span>
                        </div>

                        {/* Subtle Label */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.3 }}
                            transition={{ delay: 0.4 }}
                            className="font-sans text-[10px] tracking-[0.4em] uppercase text-white mt-8"
                        >
                            Loading Clarity
                        </motion.p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── BACKGROUND GLOW (Behind Shutter) ── */}
            {!isComplete && (
                <div className="absolute inset-0 pointer-events-none z-10">
                    <div
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20"
                        style={{
                            background: "radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, transparent 60%)",
                            filter: "blur(50px)",
                        }}
                    />
                </div>
            )}
        </div>
    );
}
