import { VideoData } from "./video-data"

export interface ApiResponse {
    code: string
    message: string
    traceId: string
    data: VideoData
}