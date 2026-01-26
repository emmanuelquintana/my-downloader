"use client"

import Image from "next/image"
import { Download, PlayCircle, Clock, User, X, Settings2 } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { VideoData } from "@/app/interfaces/video-data"
import { DownloadItem, DownloadType } from "@/app/interfaces/download-options"

interface VideoCardProps {
    video: VideoData
    config: DownloadItem
    onConfigChange: (config: DownloadItem) => void
    onRemove: () => void
    onDownload: () => void
}

export function VideoCard({ video, config, onConfigChange, onRemove, onDownload }: VideoCardProps) {

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onConfigChange({ ...config, type: e.target.value as DownloadType })
    }

    const handleQualityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onConfigChange({ ...config, quality: e.target.value })
    }

    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="h-full cursor-pointer"
        >
            <Card className="overflow-hidden border-0 shadow-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur relative group/card h-full">
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 z-20 opacity-0 group-hover/card:opacity-100 transition-opacity bg-black/50 hover:bg-black/70 text-white rounded-full"
                    onClick={onRemove}
                >
                    <X className="h-4 w-4" />
                </Button>

                <div className="grid md:grid-cols-5 gap-0 h-full">

                    <div className="md:col-span-2 relative h-48 md:h-full bg-black group min-h-[200px]">
                        <Image
                            src={video.thumbnail}
                            alt={video.title}
                            fill
                            className="object-cover opacity-90 transition-opacity group-hover:opacity-100"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="cursor-pointer"
                            >
                                <PlayCircle className="w-12 h-12 text-white drop-shadow-lg" />
                            </motion.div>
                        </div>
                    </div>


                    <div className="md:col-span-3 p-6 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <Badge variant="secondary" className="text-xs font-mono">{video.platform}</Badge>
                                <div className="flex items-center text-xs text-muted-foreground gap-1">
                                    <Clock className="w-3 h-3" />
                                    {video.duration}
                                </div>
                            </div>

                            <h2 className="text-xl font-bold leading-tight mb-2 line-clamp-2" title={video.title}>
                                {video.title}
                            </h2>

                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                                <User className="w-4 h-4" />
                                <span className="truncate">{video.uploader}</span>
                            </div>
                        </div>


                        <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-muted-foreground">
                                <Settings2 className="w-4 h-4" />
                                <span>Configurar Descarga</span>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-4">

                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-muted-foreground">Formato</label>
                                    <select
                                        className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
                                        value={config.type}
                                        onChange={handleTypeChange}
                                    >
                                        <option value="video">Video (MP4)</option>
                                        <option value="audio">Audio (MP3)</option>
                                    </select>
                                </div>


                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-muted-foreground">Calidad</label>
                                    <select
                                        className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 cursor-pointer"
                                        value={config.quality}
                                        onChange={handleQualityChange}
                                        disabled={config.type === 'audio'}
                                    >
                                        {config.type === 'video' ? (
                                            video.formats.map((f, i) => (
                                                <option key={i} value={f.resolution}>
                                                    {f.resolution} ({f.filesize !== 'N/A' ? f.filesize : 'Auto'})
                                                </option>
                                            ))
                                        ) : (
                                            <option value="best">Mejor Audio</option>
                                        )}
                                        {config.type === 'video' && <option value="best">Mejor Disponible</option>}
                                    </select>
                                </div>
                            </div>

                            <Button
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white transition-all hover:shadow-lg hover:shadow-indigo-500/20"
                                onClick={onDownload}
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Descargar {config.type === 'audio' ? 'Audio' : 'Video'}
                            </Button>
                        </div>

                    </div>
                </div>
            </Card>
        </motion.div>
    )
}
