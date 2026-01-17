"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"

export function ModeToggle() {
    const { setTheme, theme, systemTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    const currentTheme = theme === "system" ? systemTheme : theme
    const isDark = currentTheme === "dark"

    const toggleTheme = () => {
        setTheme(isDark ? "light" : "dark")
    }

    return (
        <motion.button
            onClick={toggleTheme}
            className={`relative inline-flex h-10 w-20 items-center rounded-full p-1 transition-colors duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer ${isDark ? "bg-slate-950 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]" : "bg-cyan-200 shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)]"
                }`}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle theme"
        >

            <div className="absolute inset-0 overflow-hidden rounded-full">
                <AnimatePresence mode="wait">
                    {!isDark && (
                        <motion.div
                            key="clouds"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0"
                        >
                            <div className="absolute right-2 top-2 h-2 w-6 rounded-full bg-white/60 blur-[1px]" />
                            <div className="absolute right-5 top-5 h-2 w-4 rounded-full bg-white/50 blur-[1px]" />
                        </motion.div>
                    )}
                    {isDark && (
                        <motion.div
                            key="stars"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0"
                        >
                            {[...Array(6)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute rounded-full bg-white"
                                    initial={{
                                        left: `${Math.random() * 60 + 20}%`,
                                        top: `${Math.random() * 60 + 20}%`,
                                        scale: 0
                                    }}
                                    animate={{
                                        scale: [0, 1, 0.5, 1],
                                        opacity: [0.5, 1, 0.5]
                                    }}
                                    transition={{
                                        duration: 2 + Math.random(),
                                        repeat: Infinity,
                                        delay: Math.random()
                                    }}
                                    style={{
                                        width: Math.random() * 2 + 1,
                                        height: Math.random() * 2 + 1
                                    }}
                                />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <motion.div
                className={`relative flex h-8 w-8 items-center justify-center rounded-full shadow-lg ${isDark
                    ? "bg-slate-800 text-slate-100"
                    : "bg-yellow-400 text-yellow-900"
                    }`}
                layout
                transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30
                }}
                animate={{
                    x: isDark ? 40 : 0,
                    rotate: isDark ? 360 : 0
                }}
            >
                <AnimatePresence mode="wait">
                    {isDark ? (
                        <motion.div
                            key="moon"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Moon className="h-5 w-5" fill="currentColor" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="sun"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Sun className="h-5 w-5" fill="currentColor" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.button>
    )
}
