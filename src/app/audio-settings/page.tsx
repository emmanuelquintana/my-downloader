import { Metadata } from "next";
import AudioSettingsClient from "./audio-settings-client";

export const metadata: Metadata = {
    title: "Audio Settings | Configure Downloader",
    description: "Configure your download preferences, audio quality, and default formats.",
    openGraph: {
        title: "Audio Settings | Configure Downloader",
        description: "Configure your download preferences, audio quality, and default formats.",
        url: "/audio-settings",
        siteName: "Video Downloader",
        locale: "es_ES",
        type: "website",
    },
};

export default function AudioSettingsPage() {
    return <AudioSettingsClient />;
}
