import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: 'Voice Memo App',
  description: 'Record and manage voice memos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100">{children}</body>
    </html>
  )
}
