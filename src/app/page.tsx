"use client"

import { useState } from "react"
import { Search, Loader2, Layers, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { VideoCard } from "@/components/video-card"
import { MotionDiv, StaggeredList, FadeInItem, slideUp } from "@/components/motion-primitives"

import { VideoData } from "./interfaces/video-data"
import { ApiResponse } from "./interfaces/api-response"
import { DownloadItem, BatchRequest } from "./interfaces/download-options"
import { useLoading } from "@/context/loading-context"
import { createHttpClient } from "@/lib/http-client"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"


interface QueueItem {
  data: VideoData;
  config: DownloadItem;
}

export default function Home() {
  const [url, setUrl] = useState("")
  const [queue, setQueue] = useState<QueueItem[]>([])

  const loadingContext = useLoading()
  const client = createHttpClient(loadingContext)


  const URL_REGEX = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/.*)?$/i

  const handleAddToQueue = async () => {
    if (!url) return


    if (!URL_REGEX.test(url)) {
      toast.error("Por favor ingresa una URL válida")
      return
    }


    if (queue.some(item => item.data.original_url === url)) {
      toast.warning("Este video ya está en la cola")
      return
    }

    try {

      const endpoint = `${API_URL}/api/v1/downloader/metadata?url=${encodeURIComponent(url)}`
      const json = await client.get<ApiResponse>(endpoint)

      if (json.code !== 'TG_DL_200') {
        throw new Error(json.message || "Error desconocido al procesar el video")
      }


      const newItem: QueueItem = {
        data: json.data,
        config: {
          url: json.data.original_url,
          quality: 'best',
          type: 'video'
        }
      }

      setQueue(prev => [...prev, newItem])
      toast.success("Agregado a la cola")
      setUrl("")

    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "No se pudo conectar con el servidor")
    }
  }

  const handleRemoveFromQueue = (index: number) => {
    setQueue(prev => prev.filter((_, i) => i !== index))
  }

  const handleConfigChange = (index: number, newConfig: DownloadItem) => {
    setQueue(prev => {
      const newQueue = [...prev]
      newQueue[index].config = newConfig
      return newQueue
    })
  }


  const handleSingleDownload = async (item: QueueItem) => {
    try {
      const endpoint = `${API_URL}/api/v1/downloader/stream`

      const blob = await client.post<Blob>(endpoint, item.config)


      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url

      const ext = item.config.type === 'audio' ? 'mp3' : 'mp4'
      a.download = `${item.data.title || 'download'}.${ext}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success("Descarga iniciada")
    } catch (err) {
      console.error("Single download failed", err)
      toast.error("Error en la descarga. Intenta de nuevo.")
    }
  }


  const handleBatchDownload = async () => {
    if (queue.length === 0) return

    try {

      const items = queue.map(q => q.config)
      const payload: BatchRequest = { items }

      const blob = await client.post<Blob>(`${API_URL}/api/v1/downloader/batch`, payload)

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `batch-download-${Date.now()}.zip`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success("Descarga por lotes iniciada")
    } catch (error) {
      console.error("Batch download failed", error)
      toast.error("Error en descarga por lotes. Intenta de nuevo.")
    }
  }

  const handleClearQueue = () => {
    setQueue([])
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAddToQueue()
  }

  return (
    <main className="w-full flex-1 flex flex-col items-center justify-start pt-20 p-4 transition-colors relative overflow-hidden">

      <MotionDiv className="w-full max-w-3xl space-y-8 relative z-10 text-center">

        <MotionDiv variants={slideUp} delay={0.1} className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
            Video Downloader
          </h1>
          <p className="text-muted-foreground">
            Descarga videos en MP4 y Mp3. Configura calidad y formato para cada video.
          </p>
        </MotionDiv>

        <MotionDiv variants={slideUp} delay={0.2} className="flex gap-2 relative max-w-xl mx-auto">
          <div className="relative w-full">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              className="pl-10 h-12 text-lg shadow-sm bg-white/80 dark:bg-slate-900/80 backdrop-blur"
              placeholder="Pega un enlace de YouTube, TikTok, X..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <Button
            size="lg"
            className="h-12 px-6 font-semibold shadow-indigo-500/20 shadow-lg whitespace-nowrap"
            onClick={handleAddToQueue}
            disabled={loadingContext.isLoading || !url}
          >
            {loadingContext.isLoading ? <Loader2 className="animate-spin" /> : "Agregar a la cola"}
          </Button>
        </MotionDiv>

        <AnimatePresence>
          {queue.length > 0 && (
            <MotionDiv
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex justify-center gap-4 flex-wrap touch-manipulation"
            >
              {queue.length > 1 && (
                <Button
                  size="lg"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-500/30"
                  onClick={handleBatchDownload}
                  disabled={loadingContext.isLoading}
                >
                  {loadingContext.isLoading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Layers className="mr-2 h-5 w-5" />
                  )}
                  Download Batch ({queue.length})
                </Button>
              )}

              <Button
                size="lg"
                variant="destructive"
                className="shadow-xl shadow-red-500/20"
                onClick={handleClearQueue}
                disabled={loadingContext.isLoading}
              >
                <Trash2 className="mr-2 h-5 w-5" />
                Clear All
              </Button>
            </MotionDiv>
          )}
        </AnimatePresence>

        <div className="space-y-6 pb-20">
          <AnimatePresence mode="popLayout">
            {queue.map((item, index) => (
              <FadeInItem
                key={`${item.data.original_url}-${index}`}
                layout
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              >
                <VideoCard
                  video={item.data}
                  config={item.config}
                  onConfigChange={(newConfig) => handleConfigChange(index, newConfig)}
                  onRemove={() => handleRemoveFromQueue(index)}
                  onDownload={() => handleSingleDownload(item)}
                />
              </FadeInItem>
            ))}
          </AnimatePresence>
        </div>

      </MotionDiv>
    </main>
  )
}