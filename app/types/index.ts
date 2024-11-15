// app/types/index.ts
export interface VoiceMemo {
  id: string
  title: string
  audioData: string  // base64 string
  timestamp: number
}