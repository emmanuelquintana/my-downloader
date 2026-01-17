import { VideoFormat } from "./video-format"

export interface VideoData {
    id: string
    title: string
    description: string
    thumbnail: string
    uploader: string
    duration: string
    original_url: string
    platform: string
    formats: VideoFormat[]
}