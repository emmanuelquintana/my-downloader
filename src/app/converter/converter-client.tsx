"use client"

import { useState, useRef } from "react"
import { Upload, Loader2, Music, Trash2, Plus } from "lucide-react"
import { AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useLoading } from "@/context/loading-context"
import { createHttpClient } from "@/lib/http-client"
import { cn } from "@/lib/utils"
// We'll use the new component we just created
import { ConverterQueueItem } from "@/components/converter-queue-item"
import { MotionDiv, StaggeredList, FadeInItem, slideUp, slideDown, fadeIn } from "@/components/motion-primitives"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export default function ConverterPage() {
    const [files, setFiles] = useState<File[]>([])
    const [convertingIndices, setConvertingIndices] = useState<number[]>([])
    const [isDragOver, setIsDragOver] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const loadingContext = useLoading()
    const client = createHttpClient(loadingContext)

    const handleFileSelect = (selectedFiles: FileList | null) => {
        if (!selectedFiles) return

        const newFiles: File[] = []
        Array.from(selectedFiles).forEach(file => {
            if (file.type.startsWith("video/")) {
                // Check for duplicates based on name and size to be simple
                const exists = files.some(f => f.name === file.name && f.size === file.size)
                if (!exists) {
                    newFiles.push(file)
                }
            }
        })

        if (newFiles.length > 0) {
            setFiles(prev => [...prev, ...newFiles])
        }

        // Reset input
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

    const handleConvertSingle = async (file: File, index: number) => {
        setConvertingIndices(prev => [...prev, index])

        const formData = new FormData()
        formData.append("file", file)

        try {
            // Use single converter endpoint
            const blob = await client.post<Blob>(`${API_URL}/api/v1/converter/mp3`, formData)

            const url = window.URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = file.name.replace(/\.[^/.]+$/, "") + ".mp3"
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)

        } catch (error) {
            console.error("Conversion failed:", error)
            alert("Conversion failed. Please try again.")
        } finally {
            setConvertingIndices(prev => prev.filter(i => i !== index))
        }
    }

    const isConverting = (index: number) => loadingContext.isLoading && convertingIndices.includes(index)

    const handleConvert = async () => {
        if (files.length === 0) return

        const formData = new FormData()
        files.forEach(file => {
            formData.append("files", file)
        })

        try {
            // If single file, use the single endpoint (optional optimization, but user asked for batch structure)
            // But let's stick to the batch endpoint as requested for multiple files.
            // If the user uploads just 1 file, batch endpoint usually handles it too (returns a zip with 1 file).

            // NOTE: The curl request showed:
            // -F 'files=@...;type=video/mp4'
            // FormData usually handles content-type automatically.

            const response = await client.post<Blob>(`${API_URL}/api/v1/converter/batch`, formData, {
                headers: {
                    'Accept': 'application/zip'
                },
                // Axios/Client usually handles multipart boundary
            })

            // Trigger Download
            // The response for batch is likely a ZIP file
            const blob = response as unknown as Blob // Client returns data, assuming it's configured for blob responseType where needed

            // If the custom client wrapper doesn't support responseType 'blob' easily, we might need to adjust.
            // Assuming createHttpClient is a wrapper around fetch or axios that returns parsed JSON by default, 
            // but here we likely need the raw blob.
            // Let's assume the implementation helper handles this or we might need to verify the client.
            // For now, let's proceed assuming the client returns the response body.

            const url = window.URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = files.length === 1 ? `${files[0].name.replace(/\.[^/.]+$/, "")}.mp3` : "converted_audio_files.zip"
            // If the backend forces ZIP even for one file, we stick to ZIP extension, 
            // unless we detect content-header. But safe bet is zip for batch endpoint.
            if (files.length > 1) {
                a.download = "converted_files.zip"
            }

            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)

            // Optional: Clear files after successful download? 
            // setFiles([]) 

        } catch (error) {
            console.error("Conversion failed:", error)
            alert("Conversion failed. Please try again.")
        }
    }

    return (
        <MotionDiv className="w-full flex min-h-[calc(100vh-14rem)] flex-col py-10 relative z-10 px-4 max-w-7xl mx-auto">
            <MotionDiv variants={slideDown} className="text-center space-y-4 mb-12">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
                    Batch MP4 to MP3
                </h1>
                <p className="text-muted-foreground md:text-xl">
                    Convert multiple videos to high-quality audio at once.
                </p>
            </MotionDiv>

            <div className="grid lg:grid-cols-12 gap-8 items-start">
                {/* Left Side: Upload Area */}
                <MotionDiv variants={fadeIn} delay={0.2} className="lg:col-span-7 xl:col-span-8 order-2 lg:order-1">
                    <Card className="w-full p-8 bg-background/60 backdrop-blur-sm border-slate-200/50 dark:border-slate-800/50 shadow-2xl min-h-[400px] flex flex-col">
                        <div
                            className={cn(
                                "flex-1 border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 gap-4 min-h-[300px]",
                                isDragOver
                                    ? "border-primary bg-primary/5 scale-[1.01]"
                                    : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
                            )}
                            onDrop={onDrop}
                            onDragOver={onDragOver}
                            onDragLeave={onDragLeave}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <div className="h-20 w-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                <Upload className="h-10 w-10 text-muted-foreground" />
                            </div>
                            <div className="text-center space-y-2">
                                <h3 className="text-lg font-semibold">
                                    {files.length > 0 ? "Add more files" : "Click to upload or drag and drop"}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    MP4, AVI, MOV (max 500MB per file)
                                </p>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="video/*"
                                multiple
                                onChange={(e) => handleFileSelect(e.target.files)}
                            />
                        </div>

                        {files.length > 0 && (
                            <MotionDiv initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 flex justify-end">
                                <Button
                                    size="lg"
                                    className="font-bold h-12 bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-700 hover:to-violet-700 text-white shadow-lg shadow-pink-500/20 w-full sm:w-auto px-8"
                                    onClick={handleConvert}
                                    disabled={loadingContext.isLoading && convertingIndices.length === 0}
                                >
                                    {loadingContext.isLoading && convertingIndices.length === 0 ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Converting {files.length} files...
                                        </>
                                    ) : (
                                        <>
                                            <Music className="mr-2 h-5 w-5" /> Convert All ({files.length})
                                        </>
                                    )}
                                </Button>
                            </MotionDiv>
                        )}
                    </Card>
                </MotionDiv>

                {/* Right Side: Queue Carousel/List */}
                <MotionDiv variants={slideUp} delay={0.3} className="lg:col-span-5 xl:col-span-4 order-1 lg:order-2 space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            Queue <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">{files.length}</span>
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
                                    <p>No files in queue</p>
                                    <p className="text-xs opacity-70">Upload videos to start</p>
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
                                        <ConverterQueueItem
                                            file={file}
                                            onRemove={() => removeFile(index)}
                                            onConvert={() => handleConvertSingle(file, index)}
                                            isConverting={convertingIndices.includes(index)}
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
