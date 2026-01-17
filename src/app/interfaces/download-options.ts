export type DownloadType = 'video' | 'audio';

export interface DownloadItem {
    url: string;
    quality: string;
    type: DownloadType;
}

export interface BatchRequest {
    items: DownloadItem[];
}
