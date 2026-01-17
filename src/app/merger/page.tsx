import { Metadata } from "next";
import MergerClient from "./merger-client";

export const metadata: Metadata = {
    title: "Audio Merger | Combine MP3 Files",
    description: "Merge multiple audio files into a single track. Simple video and audio merging tool.",
    keywords: ["audio merger", "mp3 merger", "combine audio", "join mp3"],
    openGraph: {
        title: "Audio Merger | Combine MP3 Files",
        description: "Merge multiple audio files into a single track.",
        url: "/merger",
        siteName: "Video Downloader",
        locale: "es_ES",
        type: "website",
    },
};

export default function MergerPage() {
    return <MergerClient />;
}
