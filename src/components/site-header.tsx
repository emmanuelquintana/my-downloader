"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Download, RefreshCw, Settings2, Merge } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { useState } from "react"

export function SiteHeader() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex w-full h-14 items-center justify-between px-8">
                <div className="flex items-center">
                    <div className="md:hidden mr-2">
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden">
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[300px] flex flex-col p-6">
                                <SheetHeader className="mb-6 text-left">
                                    <SheetTitle className="flex items-center gap-2">
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                                <Download className="h-4 w-4" />
                                            </div>
                                            <span className="font-bold text-lg">Video Downloader</span>
                                        </div>
                                    </SheetTitle>
                                </SheetHeader>
                                <div className="flex flex-col gap-2 flex-1">
                                    <Link
                                        href="/"
                                        onClick={() => setIsOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium transition-all hover:bg-accent",
                                            pathname === "/"
                                                ? "bg-accent text-accent-foreground"
                                                : "text-muted-foreground hover:text-accent-foreground"
                                        )}
                                    >
                                        <Download className="h-5 w-5" />
                                        Descargador
                                    </Link>
                                    <Link
                                        href="/converter"
                                        onClick={() => setIsOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium transition-all hover:bg-accent",
                                            pathname === "/converter"
                                                ? "bg-accent text-accent-foreground"
                                                : "text-muted-foreground hover:text-accent-foreground"
                                        )}
                                    >
                                        <RefreshCw className="h-5 w-5" />
                                        Convertidor
                                    </Link>
                                    <Link
                                        href="/audio-settings"
                                        onClick={() => setIsOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium transition-all hover:bg-accent",
                                            pathname === "/audio-settings"
                                                ? "bg-accent text-accent-foreground"
                                                : "text-muted-foreground hover:text-accent-foreground"
                                        )}
                                    >
                                        <Settings2 className="h-5 w-5" />
                                        Configuración de Audio
                                    </Link>
                                    <Link
                                        href="/merger"
                                        onClick={() => setIsOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium transition-all hover:bg-accent",
                                            pathname === "/merger"
                                                ? "bg-accent text-accent-foreground"
                                                : "text-muted-foreground hover:text-accent-foreground"
                                        )}
                                    >
                                        <Merge className="h-5 w-5" />
                                        Fusión
                                    </Link>
                                </div>
                                <div className="mt-auto border-t pt-4">
                                    <p className="text-xs text-muted-foreground">
                                        © 2024 Video Downloader.
                                        <br />
                                        All rights reserved.
                                    </p>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="font-bold inline-block">
                            Video Downloader
                        </span>
                    </Link>
                </div>
                <div className="flex items-center gap-6">
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                        <Link
                            href="/"
                            className={cn(
                                "transition-colors hover:text-foreground/80",
                                pathname === "/" ? "text-foreground" : "text-foreground/60"
                            )}
                        >
                            Descargador
                        </Link>
                        <Link
                            href="/converter"
                            className={cn(
                                "transition-colors hover:text-foreground/80",
                                pathname === "/converter" ? "text-foreground" : "text-foreground/60"
                            )}
                        >
                            Convertidor
                        </Link>
                        <Link
                            href="/audio-settings"
                            className={cn(
                                "transition-colors hover:text-foreground/80",
                                pathname === "/audio-settings" ? "text-foreground" : "text-foreground/60"
                            )}
                        >
                            Configuración de Audio
                        </Link>
                        <Link
                            href="/merger"
                            className={cn(
                                "transition-colors hover:text-foreground/80",
                                pathname === "/merger" ? "text-foreground" : "text-foreground/60"
                            )}
                        >
                            Fusión
                        </Link>
                    </nav>
                    <ModeToggle />
                </div>
            </div>
        </header>
    )
}
