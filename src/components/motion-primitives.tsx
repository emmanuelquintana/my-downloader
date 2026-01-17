"use client";

import { motion, HTMLMotionProps, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

// Variants
export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
};

export const slideUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export const slideDown: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
        },
    },
};

// Components
interface MotionDivProps extends HTMLMotionProps<"div"> {
    className?: string;
    delay?: number;
}

export function MotionDiv({ className, delay, children, ...props }: MotionDivProps) {
    return (
        <motion.div
            className={cn(className)}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={fadeIn}
            transition={{ delay }}
            {...props}
        >
            {children}
        </motion.div>
    );
}

export function StaggeredList({ className, children, ...props }: MotionDivProps) {
    return (
        <motion.div
            className={cn(className)}
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            {...props}
        >
            {children}
        </motion.div>
    );
}

export function FadeInItem({ className, children, ...props }: MotionDivProps) {
    return (
        <motion.div
            className={cn(className)}
            variants={slideUp}
            {...props}
        >
            {children}
        </motion.div>
    );
}
