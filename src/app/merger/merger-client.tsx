"use client"

import { useState, useRef } from "react"
import { Upload, Loader2, Merge, Trash2, Plus, FileAudio } from "lucide-react"
import { AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useLoading } from "@/context/loading-context"
import { createHttpClient } from "@/lib/http-client"
import { cn } from "@/lib/utils"

import { MergerQueueItem } from "@/components/merger-queue-item"
import { MotionDiv, FadeInItem, slideUp, slideDown, fadeIn } from "@/components/motion-primitives"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export default function MergerPage() {
    const [files, setFiles] = useState<File[]>([])
    const [isMerging, setIsMerging] = useState(false)
    const [isDragOver, setIsDragOver] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const loadingContext = useLoading()
    const client = createHttpClient(loadingContext)

    const handleFileSelect = (selectedFiles: FileList | null) => {
        if (!selectedFiles) return

        const newFiles: File[] = []
        Array.from(selectedFiles).forEach(file => {

            if (file.type.startsWith("audio/") || file.type === "video/mp4") {

                const exists = files.some(f => f.name === file.name && f.size === file.size)
                if (!exists) {
                    newFiles.push(file)
                }
            }
        })

        if (newFiles.length > 0) {
            setFiles(prev => [...prev, ...newFiles])
        }

        if (fileInputRef.current) fileInputRef.current.value = ""
    }

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileSelect(e.dataTransfer.files)
        }
    }

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(true)
    }

    const onDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
    }

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index))
    }

    const clearAll = () => {
        setFiles([])
    }

    const handleMerge = async () => {
        if (files.length < 2) {
            alert("Please select at least 2 files to merge.")
            return
        }

        setIsMerging(true)
        const formData = new FormData()

        files.forEach(file => {
            formData.append("files", file)
        })

        try {
            const blob = await client.post<Blob>(`${API_URL}/api/v1/merger/merge`, formData, {
                headers: {
                    'Accept': '*/*'
                }
            })

            const url = window.URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = "merged_audio.mp3"
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)

        } catch (error) {
            console.error("Merge failed:", error)
            alert("Merge failed. Please try again.")
        } finally {
            setIsMerging(false)
        }
    }

    return (
        <MotionDiv className="w-full flex min-h-[calc(100vh-14rem)] flex-col py-10 relative z-10 px-4 max-w-7xl mx-auto">
            <MotionDiv variants={slideDown} className="text-center space-y-4 mb-12">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-rose-500">
                    Audio Merger
                </h1>
                <p className="text-muted-foreground md:text-xl">
                    Combine multiple audio files into a single track.
                </p>
            </MotionDiv>

            <div className="grid lg:grid-cols-12 gap-8 items-start">

                <MotionDiv variants={fadeIn} delay={0.2} className="lg:col-span-7 xl:col-span-8 order-2 lg:order-1">
                    <Card className="w-full p-8 bg-background/60 backdrop-blur-sm border-slate-200/50 dark:border-slate-800/50 shadow-2xl min-h-[400px] flex flex-col">
                        <div
                            className={cn(
                                "flex-1 border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 gap-4 min-h-[300px]",
                                isDragOver
                                    ? "border-pink-500 bg-pink-50/10 scale-[1.01]"
                                    : "border-muted-foreground/25 hover:border-pink-500/50 hover:bg-muted/50"
                            )}
                            onDrop={onDrop}
                            onDragOver={onDragOver}
                            onDragLeave={onDragLeave}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <div className="h-20 w-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                <Merge className="h-10 w-10 text-muted-foreground" />
                            </div>
                            <div className="text-center space-y-2">
                                <h3 className="text-lg font-semibold">
                                    {files.length > 0 ? "Add more files" : "Click to upload or drag files"}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    MP3, WAV, M4A, etc.
                                </p>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="audio/*"
                                multiple
                                onChange={(e) => handleFileSelect(e.target.files)}
                            />
                        </div>

                        {files.length > 0 && (
                            <MotionDiv initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 flex justify-end">
                                <Button
                                    size="lg"
                                    className="font-bold h-12 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white shadow-lg shadow-pink-500/20 w-full sm:w-auto px-8"
                                    onClick={handleMerge}
                                    disabled={loadingContext.isLoading || isMerging}
                                >
                                    {loadingContext.isLoading || isMerging ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Merging...
                                        </>
                                    ) : (
                                        <>
                                            <Merge className="mr-2 h-5 w-5" /> Merge Files ({files.length})
                                        </>
                                    )}
                                </Button>
                            </MotionDiv>
                        )}
                    </Card>
                </MotionDiv>


                <MotionDiv variants={slideUp} delay={0.3} className="lg:col-span-5 xl:col-span-4 order-1 lg:order-2 space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            Track List <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">{files.length}</span>
                        </h2>
                        {files.length > 0 && (
                            <Button variant="ghost" size="sm" onClick={clearAll} className="text-muted-foreground hover:text-destructive h-8 px-2 text-xs">
                                <Trash2 className="w-3 h-3 mr-1" /> Clear All
                            </Button>
                        )}
                    </div>

                    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-muted-foreground/20">
                        <AnimatePresence mode="popLayout">
                            {files.length === 0 ? (
                                <FadeInItem
                                    key="empty-state"
                                    className="h-40 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-muted-foreground text-sm p-4 text-center"
                                    initial="hidden"
                                    animate="visible"
                                >
                                    <Plus className="w-8 h-8 mb-2 opacity-50" />
                                    <p>No tracks added</p>
                                    <p className="text-xs opacity-70">Add files to merge them</p>
                                </FadeInItem>
                            ) : (
                                files.map((file, index) => (
                                    <FadeInItem
                                        key={`${file.name}-${index}`}
                                        layout
                                        initial="hidden"
                                        animate="visible"
                                        exit={{ opacity: 0, x: 20 }}
                                    >
                                        <MergerQueueItem
                                            file={file}
                                            index={index}
                                            onRemove={() => removeFile(index)}
                                            disabled={isMerging}
                                        />
                                    </FadeInItem>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </MotionDiv>
            </div>
        </MotionDiv>
    )
}
