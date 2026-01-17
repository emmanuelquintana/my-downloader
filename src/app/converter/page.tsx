import { Metadata } from "next";
import ConverterClient from "./converter-client";

export const metadata: Metadata = {
    title: "Audio Converter | Convert Video to MP3",
    description: "Convert your videos to high-quality audio (MP3) format. Batch processing available for multiple files.",
    keywords: ["audio converter", "mp3 converter", "video to audio", "batch converter"],
    openGraph: {
        title: "Audio Converter | Convert Video to MP3",
        description: "Convert your videos to high-quality audio (MP3) format. Batch processing available for multiple files.",
        url: "/converter",
        siteName: "Video Downloader",
        locale: "es_ES",
        type: "website",
    },
};

export default function ConverterPage() {
    return <ConverterClient />;
}
