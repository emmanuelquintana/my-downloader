"use client"

import Link from "next/link"
import { Mail } from "lucide-react"
import { motion } from "framer-motion"
import { fadeIn } from "@/components/motion-primitives"

export function SiteFooter() {
    return (
        <motion.footer
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="relative z-10 w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-12 md:py-16"
        >
            <div className="w-full px-8 md:px-12 lg:px-24">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">

                    {/* Brand & Description */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold tracking-tighter">Video Downloader</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                            La mejor herramienta para descargar videos y convertir audio de tus plataformas favoritas. Rápido, seguro y gratuito.
                        </p>
                    </div>

                    {/* Sitemap - Centered on Desktop */}
                    <div className="space-y-4 md:text-center">
                        <h3 className="text-lg font-bold tracking-tighter">Sitemap</h3>
                        <nav className="flex flex-col space-y-2 text-sm text-muted-foreground md:items-center">
                            <Link href="/" className="hover:text-foreground transition-colors w-fit">
                                Downloader
                            </Link>
                            <Link href="/converter" className="hover:text-foreground transition-colors w-fit">
                                Audio Converter
                            </Link>
                        </nav>
                    </div>

                    {/* Contact - Right Aligned on Desktop */}
                    <div className="space-y-4 md:text-right">
                        <h3 className="text-lg font-bold tracking-tighter">Contacto</h3>
                        <div className="flex flex-col space-y-2 text-sm text-muted-foreground md:items-end">
                            <a
                                href="mailto:quintanatorresjoseemmanuel1dm@gmail.com"
                                className="flex items-center gap-2 hover:text-foreground transition-colors justify-start md:justify-end"
                            >
                                <Mail className="h-4 w-4" />
                                quintanatorresjoseemmanuel1dm@gmail.com
                            </a>
                            <p className="text-xs text-muted-foreground/60 pt-2">
                                &copy; {new Date().getFullYear()} Antigravity. Todos los derechos reservados.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </motion.footer>
    )
}
