// app/components/VoiceRecorder.tsx
'use client'

import { useState, useRef } from 'react'
import { VoiceMemo } from '@/app/types'

interface Props {
  onSave: (memo: VoiceMemo) => void
}

export default function VoiceRecorder({ onSave }: Props) {
  const [isRecording, setIsRecording] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        chunksRef.current.push(e.data)
      }

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/ogg' })
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        chunksRef.current = []
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
    } catch (err) {
      console.error('Error accessing microphone:', err)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const saveMemo = () => {
    if (audioUrl) {
      fetch(audioUrl)
        .then(res => res.blob())
        .then(blob => {
          const reader = new FileReader()
          reader.readAsDataURL(blob)
          reader.onloadend = () => {
            const base64data = reader.result as string
            const title = prompt('Enter a title for your voice memo:', `Memo ${new Date().toLocaleString()}`) || `Memo ${new Date().toLocaleString()}`
            const memo: VoiceMemo = {
              id: Date.now().toString(),
              title,
              audioData: base64data,
              timestamp: Date.now()
            }
            onSave(memo)
            handleDownload(blob, memo.title)
            setAudioUrl(null)
          }
        })
    }
  }

  const handleDownload = (blob: Blob, title: string) => {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${title}.mp3`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-center gap-4">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600"
          >
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="bg-gray-500 text-white px-4 py-2 rounded-full hover:bg-gray-600"
          >
            Stop Recording
          </button>
        )}
        
        {audioUrl && (
          <div className="flex gap-4">
            <audio src={audioUrl} controls />
            <button
              onClick={saveMemo}
              className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600"
            >
              Save Memo
            </button>
          </div>
        )}
      </div>
    </div>
  )
}