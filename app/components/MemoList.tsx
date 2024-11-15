// app/components/MemoList.tsx
'use client'

import { VoiceMemo } from '@/app/types'
import { useEffect, useState } from 'react'

interface Props {
  memos: VoiceMemo[]
  onDelete: (id: string) => void
}

export default function MemoList({ memos, onDelete }: Props) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleDownload = (audioData: string, title: string) => {
    // Convert base64 to blob
    fetch(audioData)
      .then(res => res.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${title}.mp3`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      })
  }

  if (!isClient) {
    return <div className="mt-8 animate-pulse">Loading...</div>
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4 text-black">Your Memos</h2>
      <div className="space-y-4">
        {memos.map((memo) => (
          <div key={memo.id} className="p-4 bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-gray-500">{memo.title}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDownload(memo.audioData, memo.title)}
                  className="text-blue-500 hover:text-blue-700"
                  aria-label="Download memo"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth={1.5} 
                    stroke="currentColor" 
                    className="w-5 h-5"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" 
                    />
                  </svg>
                </button>
                <button
                  onClick={() => onDelete(memo.id)}
                  className="text-red-500 font-xl hover:text-red-700"
                >
                  ×
                </button>
              </div>
            </div>
            <audio src={memo.audioData} controls className="w-full" />
            <p className="text-sm text-gray-500 mt-2">
              {new Date(memo.timestamp).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}