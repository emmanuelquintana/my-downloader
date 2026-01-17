"use client"

import { X, FileAudio } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface MergerQueueItemProps {
    file: File
    index: number
    onRemove: () => void
    disabled?: boolean
}

export function MergerQueueItem({
    file,
    index,
    onRemove,
    disabled
}: MergerQueueItemProps) {
    return (
        <Card className="p-3 relative group overflow-hidden border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-muted-foreground">
                {index + 1}
            </div>

            <div className="h-10 w-10 rounded-lg bg-pink-100 dark:bg-pink-900/20 flex items-center justify-center flex-shrink-0">
                <FileAudio className="h-5 w-5 text-pink-600 dark:text-pink-400" />
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate pr-2" title={file.name}>
                    {file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
            </div>

            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                onClick={onRemove}
                disabled={disabled}
            >
                <X className="h-4 w-4" />
            </Button>
        </Card>
    )
}
