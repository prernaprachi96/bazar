'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { Language } from '@/lib/types'

// Minimal typings for the Web Speech API (not in standard DOM lib).
interface SpeechRecognitionResultLike {
  0: { transcript: string }
  isFinal: boolean
}
interface SpeechRecognitionEventLike {
  resultIndex: number
  results: { length: number; [i: number]: SpeechRecognitionResultLike }
}
interface SpeechRecognitionErrorLike {
  error: string
}
interface SpeechRecognitionLike {
  lang: string
  continuous: boolean
  interimResults: boolean
  start: () => void
  stop: () => void
  abort: () => void
  onresult: ((e: SpeechRecognitionEventLike) => void) | null
  onerror: ((e: SpeechRecognitionErrorLike) => void) | null
  onend: (() => void) | null
  onstart: (() => void) | null
}

type SpeechRecognitionCtor = new () => SpeechRecognitionLike

interface Options {
  language: Language
  onFinalResult?: (transcript: string) => void
}

interface SpeechState {
  supported: boolean
  listening: boolean
  transcript: string
  error: string | null
  start: () => void
  stop: () => void
}

function getRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === 'undefined') return null
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor
    webkitSpeechRecognition?: SpeechRecognitionCtor
  }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

export function useSpeechRecognition({ language, onFinalResult }: Options): SpeechState {
  const [supported, setSupported] = useState(false)
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)
  const onFinalRef = useRef(onFinalResult)

  useEffect(() => {
    onFinalRef.current = onFinalResult
  }, [onFinalResult])

  useEffect(() => {
    setSupported(getRecognitionCtor() !== null)
  }, [])

  const stop = useCallback(() => {
    recognitionRef.current?.stop()
    setListening(false)
  }, [])

  const start = useCallback(() => {
    const Ctor = getRecognitionCtor()
    if (!Ctor) {
      setError('unsupported')
      return
    }
    // Clean up any previous instance.
    recognitionRef.current?.abort()

    const recognition = new Ctor()
    recognition.lang = language
    recognition.continuous = false
    recognition.interimResults = true
    setError(null)
    setTranscript('')

    recognition.onstart = () => setListening(true)

    recognition.onresult = (event) => {
      let interim = ''
      let final = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) final += result[0].transcript
        else interim += result[0].transcript
      }
      setTranscript(final || interim)
      if (final) {
        onFinalRef.current?.(final.trim())
      }
    }

    recognition.onerror = (event) => {
      setListening(false)
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setError('permission')
      } else if (event.error === 'no-speech') {
        setError('no-speech')
      } else if (event.error === 'aborted') {
        setError(null)
      } else {
        setError('network')
      }
    }

    recognition.onend = () => setListening(false)

    recognitionRef.current = recognition
    try {
      recognition.start()
    } catch {
      // start() throws if already started; ignore.
    }
  }, [language])

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort()
    }
  }, [])

  return { supported, listening, transcript, error, start, stop }
}
