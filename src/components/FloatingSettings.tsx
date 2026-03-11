"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { Settings, Moon, Sun, Play, Square, Volume2, VolumeX, X } from "lucide-react";

const TRACKS = ["/audio/Epic_Spectrum.mp3", "/audio/theojt_minimalist.mp3"];
// Loader total duration (should match LoadingScreen: 2400ms progress + 200ms pause + 700ms fade)
const AUTOPLAY_DELAY_MS = 3400;

export function FloatingSettings() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [open, setOpen] = useState(false);
    const [playing, setPlaying] = useState(false);
    const [muted, setMuted] = useState(false);
    const [trackIndex] = useState(() => Math.floor(Math.random() * TRACKS.length));
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        setMounted(true);

        const audio = new Audio(TRACKS[trackIndex]);
        audio.loop = true;
        audio.volume = 0.35;
        audioRef.current = audio;

        const startAudio = () => {
            if (audioRef.current && !playing) {
                audioRef.current.play()
                    .then(() => setPlaying(true))
                    .catch(() => { /* Still blocked */ });
            }
        };

        // 1. Immediate attempt (likely blocked if first interaction)
        startAudio();

        // 2. Delayed attempt (timed with loader exit)
        const timer = setTimeout(startAudio, AUTOPLAY_DELAY_MS);

        // 3. User Interaction Kickstart (Universal across browsers)
        const handleInteraction = () => {
            startAudio();
            window.removeEventListener("click", handleInteraction);
            window.removeEventListener("touchstart", handleInteraction);
            window.removeEventListener("scroll", handleInteraction);
        };

        window.addEventListener("click", handleInteraction);
        window.addEventListener("touchstart", handleInteraction);
        window.addEventListener("scroll", handleInteraction);

        return () => {
            clearTimeout(timer);
            window.removeEventListener("click", handleInteraction);
            window.removeEventListener("touchstart", handleInteraction);
            window.removeEventListener("scroll", handleInteraction);
            audio.pause();
            audio.src = "";
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trackIndex]); // Note: removing 'playing' from deps to avoid re-triggering logic unnecessarily 


    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;
        if (playing) {
            audio.pause();
            setPlaying(false);
        } else {
            void audio.play();
            setPlaying(true);
        }
    };

    const toggleMute = () => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.muted = !muted;
        setMuted(!muted);
    };

    if (!mounted) return null;

    const isDark = theme === "dark";

    return (
        <>
            {/* ── BACKDROP DISMISS ── */}
            {open && (
                <div
                    className="fixed inset-0 z-[9990]"
                    onClick={() => setOpen(false)}
                />
            )}

            <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-2">

                {/* ── SETTINGS PANEL ── */}
                <AnimatePresence>
                    {open && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.92, y: 8 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.92, y: 8 }}
                            transition={{ duration: 0.22, ease: "easeOut" }}
                            className="rounded-2xl border border-foreground/10 bg-background/80 backdrop-blur-xl p-3 flex flex-col gap-1 min-w-[180px] shadow-xl"
                        >
                            {/* Theme row */}
                            <button
                                onClick={() => setTheme(isDark ? "light" : "dark")}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-foreground/5 transition-colors text-left"
                            >
                                {isDark
                                    ? <Sun className="w-4 h-4 text-foreground/60 shrink-0" />
                                    : <Moon className="w-4 h-4 text-foreground/60 shrink-0" />
                                }
                                <span className="font-sans text-xs text-foreground/70">
                                    {isDark ? "Light Mode" : "Dark Mode"}
                                </span>
                            </button>

                            <div className="h-px bg-foreground/8 mx-2" />

                            {/* Play/Stop row */}
                            <button
                                onClick={togglePlay}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-foreground/5 transition-colors text-left"
                            >
                                {playing
                                    ? <Square className="w-4 h-4 text-foreground/60 shrink-0" />
                                    : <Play className="w-4 h-4 text-foreground/60 shrink-0" />
                                }
                                <span className="font-sans text-xs text-foreground/70">
                                    {playing ? "Stop Music" : "Play Music"}
                                </span>
                            </button>

                            {/* Mute row */}
                            <button
                                onClick={toggleMute}
                                disabled={!playing}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-foreground/5 disabled:opacity-35 disabled:cursor-not-allowed transition-colors text-left"
                            >
                                {muted
                                    ? <VolumeX className="w-4 h-4 text-foreground/60 shrink-0" />
                                    : <Volume2 className="w-4 h-4 text-foreground/60 shrink-0" />
                                }
                                <span className="font-sans text-xs text-foreground/70">
                                    {muted ? "Unmute" : "Mute"}
                                </span>
                            </button>

                            {/* Track label */}
                            <div className="px-3 pt-1 pb-0.5">
                                <p className="font-sans text-[10px] text-foreground/25 truncate">
                                    ♪ {trackIndex === 0 ? "Epic Spectrum" : "Minimalist"}
                                    {playing && !muted && (
                                        <span className="ml-1 animate-pulse">●</span>
                                    )}
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── FAB TRIGGER ── */}
                <AnimatePresence>
                    {mounted && (
                        <motion.button
                            key="settings-fab"
                            initial={{ opacity: 0, scale: 0.8, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 1.5, delay: 4, ease: "easeOut" }}
                            onClick={() => setOpen((v) => !v)}
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.93 }}
                            className="relative w-10 h-10 rounded-full bg-foreground/10 hover:bg-foreground/18 border border-foreground/10 backdrop-blur-sm flex items-center justify-center text-foreground transition-colors"
                        >
                            <AnimatePresence mode="wait">
                                {open ? (
                                    <motion.span
                                        key="x"
                                        initial={{ opacity: 0, rotate: -45 }}
                                        animate={{ opacity: 1, rotate: 0 }}
                                        exit={{ opacity: 0, rotate: 45 }}
                                        transition={{ duration: 0.18 }}
                                    >
                                        <X className="w-4 h-4" />
                                    </motion.span>
                                ) : (
                                    <motion.span
                                        key="gear"
                                        initial={{ opacity: 0, rotate: 45 }}
                                        animate={{ opacity: 1, rotate: 0 }}
                                        exit={{ opacity: 0, rotate: -45 }}
                                        transition={{ duration: 0.18 }}
                                    >
                                        <Settings className="w-4 h-4" />
                                    </motion.span>
                                )}
                            </AnimatePresence>

                            {/* Playing indicator dot */}
                            {playing && !muted && (
                                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            )}
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}
