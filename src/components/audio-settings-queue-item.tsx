"use client"

import { X, FileAudio, Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface AudioSettingsQueueItemProps {
    file: File
    bitrate: string
    sampleRate: number
    onRemove: () => void
    onConvert: () => void
    onBitrateChange: (value: string) => void
    onSampleRateChange: (value: number) => void
    isConverting: boolean
}

export function AudioSettingsQueueItem({
    file,
    bitrate,
    sampleRate,
    onRemove,
    onConvert,
    onBitrateChange,
    onSampleRateChange,
    isConverting
}: AudioSettingsQueueItemProps) {
    return (
        <Card className="p-4 relative group overflow-hidden border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all hover:shadow-md">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">


                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="h-10 w-10 rounded-lg bg-violet-100 dark:bg-violet-900/20 flex items-center justify-center flex-shrink-0">
                        <FileAudio className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate pr-2" title={file.name}>
                            {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                    </div>
                </div>


                <div className="flex flex-wrap items-center gap-3 sm:justify-end">


                    <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-md p-1 h-8">
                        <button
                            onClick={() => onBitrateChange("128")}
                            disabled={isConverting}
                            className={cn(
                                "px-2 py-0.5 text-xs font-medium rounded-sm transition-all",
                                bitrate === "128"
                                    ? "bg-white dark:bg-slate-700 shadow-sm text-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            128k
                        </button>
                        <div className="w-px h-3 bg-slate-300 dark:bg-slate-700 mx-1" />
                        <button
                            onClick={() => onBitrateChange("192")}
                            disabled={isConverting}
                            className={cn(
                                "px-2 py-0.5 text-xs font-medium rounded-sm transition-all",
                                bitrate === "192"
                                    ? "bg-white dark:bg-slate-700 shadow-sm text-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            192k
                        </button>
                        <div className="w-px h-3 bg-slate-300 dark:bg-slate-700 mx-1" />
                        <button
                            onClick={() => onBitrateChange("320")}
                            disabled={isConverting}
                            className={cn(
                                "px-2 py-0.5 text-xs font-medium rounded-sm transition-all",
                                bitrate === "320"
                                    ? "bg-white dark:bg-slate-700 shadow-sm text-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            320k
                        </button>
                    </div>


                    <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-md p-1 h-8">
                        <button
                            onClick={() => onSampleRateChange(44100)}
                            disabled={isConverting}
                            className={cn(
                                "px-2 py-0.5 text-xs font-medium rounded-sm transition-all",
                                sampleRate === 44100
                                    ? "bg-white dark:bg-slate-700 shadow-sm text-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            44.1kHz
                        </button>
                        <div className="w-px h-3 bg-slate-300 dark:bg-slate-700 mx-1" />
                        <button
                            onClick={() => onSampleRateChange(48000)}
                            disabled={isConverting}
                            className={cn(
                                "px-2 py-0.5 text-xs font-medium rounded-sm transition-all",
                                sampleRate === 48000
                                    ? "bg-white dark:bg-slate-700 shadow-sm text-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            48kHz
                        </button>
                    </div>


                    <div className="flex items-center gap-1 pl-2 border-l border-slate-100 dark:border-slate-800">
                        <Button
                            size="sm"
                            variant="default" // Changed to default for better visibility
                            className="h-8 text-xs bg-violet-600 hover:bg-violet-700 text-white"
                            onClick={onConvert}
                            disabled={isConverting}
                        >
                            {isConverting ? "..." : "Convertir"}
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                            onClick={onRemove}
                            disabled={isConverting}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    )
}
