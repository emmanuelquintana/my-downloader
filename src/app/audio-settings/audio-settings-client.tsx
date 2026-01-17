"use client"

import { useState, useRef } from "react"
import { Upload, Loader2, Settings2, Trash2, Plus, Music } from "lucide-react"
import { AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useLoading } from "@/context/loading-context"
import { createHttpClient } from "@/lib/http-client"
import { cn } from "@/lib/utils"

import { AudioSettingsQueueItem } from "@/components/audio-settings-queue-item"
import { MotionDiv, FadeInItem, slideUp, slideDown, fadeIn } from "@/components/motion-primitives"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"


interface QueueItem {
    id: string
    file: File
    bitrate: string
    sampleRate: number
}

export default function AudioSettingsPage() {
    const [queue, setQueue] = useState<QueueItem[]>([])
    const [convertingIds, setConvertingIds] = useState<string[]>([])
    const [isDragOver, setIsDragOver] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const loadingContext = useLoading()
    const client = createHttpClient(loadingContext)

    const handleFileSelect = (selectedFiles: FileList | null) => {
        if (!selectedFiles) return

        const newItems: QueueItem[] = []
        Array.from(selectedFiles).forEach(file => {

            const exists = queue.some(item => item.file.name === file.name && item.file.size === file.size)
            if (!exists) {
                newItems.push({
                    id: Math.random().toString(36).substring(7),
                    file,
                    bitrate: "192",
                    sampleRate: 48000
                })
            }
        })

        if (newItems.length > 0) {
            setQueue(prev => [...prev, ...newItems])
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

    const removeItem = (id: string) => {
        setQueue(prev => prev.filter(item => item.id !== id))
    }

    const clearAll = () => {
        setQueue([])
    }

    const updateItemConfig = (id: string, key: 'bitrate' | 'sampleRate', value: string | number) => {
        setQueue(prev => prev.map(item =>
            item.id === id ? { ...item, [key]: value } : item
        ))
    }

    const handleConvertSingle = async (item: QueueItem) => {
        setConvertingIds(prev => [...prev, item.id])

        const formData = new FormData()
        formData.append("file", item.file)
        formData.append("bitrate", item.bitrate)
        formData.append("sampleRate", item.sampleRate.toString())

        try {
            const blob = await client.post<Blob>(`${API_URL}/api/v1/converter/audio-settings`, formData)

            const url = window.URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = item.file.name.replace(/\.[^/.]+$/, "") + ".mp3"
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)

        } catch (error) {
            console.error("Conversion failed:", error)
            alert("Conversion failed. Please try again.")
        } finally {
            setConvertingIds(prev => prev.filter(id => id !== item.id))
        }
    }

    const handleConvertAll = async () => {
        if (queue.length === 0) return

        const formData = new FormData()


        queue.forEach(item => {
            formData.append("files", item.file)
        })


        const configurations = queue.map(item => ({
            filename: item.file.name,
            bitrate: item.bitrate,
            sampleRate: item.sampleRate
        }))


        formData.append("configurations", JSON.stringify(configurations))

        try {
            const response = await client.post<Blob>(`${API_URL}/api/v1/converter/audio-settings/batch`, formData, {
                headers: {
                    'Accept': 'application/zip'
                }
            })

            const blob = response as unknown as Blob
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement("a")
            const isSingle = queue.length === 1
            a.href = url
            a.download = isSingle
                ? `${queue[0].file.name.replace(/\.[^/.]+$/, "")}.mp3`
                : "converted_audio_files.zip"


            if (queue.length > 1) {
                a.download = "converted_files.zip"
            }

            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)

        } catch (error) {
            console.error("Conversion failed:", error)
            alert("Conversion failed. Please try again.")
        }
    }

    return (
        <MotionDiv className="w-full flex min-h-[calc(100vh-14rem)] flex-col py-10 relative z-10 px-4 max-w-7xl mx-auto">
            <MotionDiv variants={slideDown} className="text-center space-y-4 mb-12">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500">
                    Advanced Audio Settings
                </h1>
                <p className="text-muted-foreground md:text-xl">
                    Convert videos to MP3 with custom Bitrate and Sample Rate.
                </p>
            </MotionDiv>

            <div className="grid lg:grid-cols-12 gap-8 items-start">

                <MotionDiv variants={fadeIn} delay={0.2} className="lg:col-span-12 xl:col-span-12">
                    <Card className="w-full p-8 bg-background/60 backdrop-blur-sm border-slate-200/50 dark:border-slate-800/50 shadow-2xl min-h-[300px] flex flex-col">


                        <div
                            className={cn(
                                "border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 gap-4 mb-8",
                                isDragOver
                                    ? "border-violet-500 bg-violet-50/10 scale-[1.01]"
                                    : "border-muted-foreground/25 hover:border-violet-500/50 hover:bg-muted/50"
                            )}
                            onDrop={onDrop}
                            onDragOver={onDragOver}
                            onDragLeave={onDragLeave}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                <Settings2 className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <div className="text-center space-y-1">
                                <h3 className="text-lg font-semibold">
                                    Click to upload or drag files
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    MP4, AVI, MOV, etc.
                                </p>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="video/*,audio/*"
                                multiple
                                onChange={(e) => handleFileSelect(e.target.files)}
                            />
                        </div>


                        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                Configuration Queue <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">{queue.length}</span>
                            </h2>
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                {queue.length > 0 && (
                                    <>
                                        <Button variant="ghost" size="sm" onClick={clearAll} className="text-muted-foreground hover:text-destructive h-9">
                                            <Trash2 className="w-4 h-4 mr-2" /> Clear Queue
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="font-bold h-9 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white shadow-lg shadow-violet-500/20 flex-1 sm:flex-none"
                                            onClick={handleConvertAll}
                                            disabled={loadingContext.isLoading || convertingIds.length > 0}
                                        >
                                            {loadingContext.isLoading ? (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            ) : (
                                                <Music className="mr-2 h-4 w-4" />
                                            )}
                                            Convert All
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>


                        <div className="space-y-3">
                            <AnimatePresence mode="popLayout">
                                {queue.length === 0 ? (
                                    <FadeInItem
                                        key="empty"
                                        className="h-32 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col items-center justify-center text-muted-foreground text-sm p-4 bg-slate-50/50 dark:bg-slate-900/50"
                                        initial="hidden"
                                        animate="visible"
                                    >
                                        <p>Queue is empty</p>
                                    </FadeInItem>
                                ) : (
                                    queue.map((item) => (
                                        <FadeInItem
                                            key={item.id}
                                            layout
                                            initial="hidden"
                                            animate="visible"
                                            exit={{ opacity: 0, scale: 0.95 }}
                                        >
                                            <AudioSettingsQueueItem
                                                file={item.file}
                                                bitrate={item.bitrate}
                                                sampleRate={item.sampleRate}
                                                onRemove={() => removeItem(item.id)}
                                                onConvert={() => handleConvertSingle(item)}
                                                onBitrateChange={(val) => updateItemConfig(item.id, 'bitrate', val)}
                                                onSampleRateChange={(val) => updateItemConfig(item.id, 'sampleRate', val)}
                                                isConverting={convertingIds.includes(item.id)}
                                            />
                                        </FadeInItem>
                                    ))
                                )}
                            </AnimatePresence>
                        </div>

                    </Card>
                </MotionDiv>
            </div>
        </MotionDiv>
    )
}
