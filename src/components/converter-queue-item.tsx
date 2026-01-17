"use client"

import { X, FileVideo } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface ConverterQueueItemProps {
    file: File
    onRemove: () => void
    onConvert: () => void
    isConverting: boolean
}

export function ConverterQueueItem({ file, onRemove, onConvert, isConverting }: ConverterQueueItemProps) {
    return (
        <Card className="p-3 relative group overflow-hidden border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center flex-shrink-0">
                    <FileVideo className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate pr-6" title={file.name}>
                        {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 text-xs"
                        onClick={onConvert}
                        disabled={isConverting}
                    >
                        {isConverting ? "..." : "Convert"}
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
        </Card>
    )
}
