'use client'

import VoiceRecorder from '@/app/components/VoiceRecorder'
import MemoList from '@/app/components/MemoList'
import { VoiceMemo } from '@/app/types'
import { useLocalStorage } from '@/app/hooks/useLocalStorage'

export default function Home() {
  const [memos, setMemos] = useLocalStorage<VoiceMemo[]>('voiceMemos', [])

  const addMemo = (memo: VoiceMemo) => {
    setMemos(prev => [...prev, memo])
  }

  const deleteMemo = (id: string) => {
    setMemos(prev => prev.filter(memo => memo.id !== id))
  }

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Voice Memo App</h1>
      <div className="max-w-2xl mx-auto">
        <VoiceRecorder onSave={addMemo} />
        <MemoList memos={memos} onDelete={deleteMemo} />
      </div>
    </main>
  )
}