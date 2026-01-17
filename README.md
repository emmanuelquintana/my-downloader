# My Downloader & Converter

A powerful, modern web application for downloading videos from various platforms and converting media files, built with Next.js 16 and Tailwind CSS.

## 🚀 Features

### Video Downloader
- **Multi-Platform Support**: Download videos from YouTube, TikTok, X (Twitter), and more.
- **Smart Queue System**: Add multiple videos to a queue and manage them efficiently.
- **Batch Processing**: Download multiple videos at once as a ZIP archive.
- **Quality Control**: Choose between Best, 1080p, 720p, or Audio Only (MP3).
- **Metadata Inspection**: Automatically fetches and displays video details before downloading.

### Media Tools
- **Batch Converter**: Convert multiple MP4 files to MP3 format simultaneously.
- **Drag & Drop Interface**: Intuitive file upload for conversion.
- **Video/Audio Merger**: Combine multiple media files into a single output (located in `/merger`).
- **Audio Settings**: Configure bitrate (128k, 192k, 320k) and sample rates.

### UI/UX
- **Modern Design**: Sleek interface with glassmorphism effects and smooth transitions.
- **Animations**: Powered by Framer Motion for a fluid user experience.
- **Dark Mode**: Fully supported dark/light themes.
- **Responsive**: Optimized for both desktop and mobile devices.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)
- **UI Components**: Built with Radix UI primitives.

## 📦 Getting Started

### Prerequisites
- Node.js 20+ installed.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/my-downloader.git
   cd my-downloader
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

```
src/
├── app/
│   ├── page.tsx            # Main Downloader Page
│   ├── converter/          # Media Converter Page
│   ├── merger/             # Audio Merger Page
│   ├── audio-settings/     # Audio Configuration
│   └── layout.tsx          # Root Layout
├── components/
│   ├── ui/                 # Reusable UI Components
│   ├── video-card.tsx      # Video Item Component
│   └── ...
├── lib/                    # Utilities and API clients
└── context/                # Global State (Loading, etc.)
```

## 🤝 Contributing

Contributions are welcome! Please run the linter before submitting PRs.

```bash
npm run lint
```

## 📄 License

This project is for personal use and educational purposes.
