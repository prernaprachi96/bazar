'use client'

import { Loader2, Mic, Search, Send } from 'lucide-react'
import type { Language } from '@/lib/types'
import { type Translations } from '@/lib/i18n'
import { Button } from '@/components/ui/button'

const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'en-US', label: 'English' },
  { code: 'hi-IN', label: 'हिन्दी' },
  { code: 'es-ES', label: 'Español' },
  { code: 'fr-FR', label: 'Français' },
  { code: 'de-DE', label: 'Deutsch' },
  { code: 'ja-JP', label: '日本語' },
  { code: 'ar-SA', label: 'العربية' },
  { code: 'pt-BR', label: 'Português' },
]

interface VoiceSearchBarProps {
  value: string
  onChange: (v: string) => void
  onSubmit: () => void
  onMicToggle: () => void
  listening: boolean
  interim: string
  processing: boolean
  supported: boolean
  micError: string | null
  language: Language
  translations: Translations
  onLanguageChange: (l: Language) => void
}

export function VoiceSearchBar({
  value,
  onChange,
  onSubmit,
  onMicToggle,
  listening,
  interim,
  processing,
  supported,
  micError,
  language,
  translations,
  onLanguageChange,
}: VoiceSearchBarProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="relative flex flex-1 items-center">
          <Search className="pointer-events-none absolute left-4 size-4 text-muted-foreground" aria-hidden="true" />
          <input
            type="text"
            value={listening && interim ? interim : value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.nativeEvent.isComposing && e.keyCode !== 229) {
                onSubmit()
              }
            }}
            placeholder={listening ? translations.listening : translations.placeholder}
            aria-label="Voice or text command"
            className="h-12 w-full rounded-full border border-border bg-card pl-11 pr-24 text-sm font-medium text-card-foreground shadow-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          />
          <div className="absolute right-1.5 flex items-center gap-1">
            <button
              type="button"
              onClick={onMicToggle}
              disabled={!supported}
              aria-label={listening ? 'Stop listening' : 'Start voice input'}
              aria-pressed={listening}
              className={`relative flex size-9 items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                listening
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-accent'
              }`}
            >
              {listening && (
                <span className="absolute inset-0 animate-ping rounded-full bg-primary/40" aria-hidden="true" />
              )}
              <Mic className="relative size-4" aria-hidden="true" />
            </button>
            <Button
              type="button"
              size="icon"
              className="size-9 rounded-full"
              onClick={onSubmit}
              disabled={processing || (!value.trim() && !listening)}
              aria-label="Send command"
            >
              {processing ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <Send className="size-4" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>

        <label className="sr-only" htmlFor="language-select">
          Voice language
        </label>
        <select
          id="language-select"
          value={language}
          onChange={(e) => onLanguageChange(e.target.value as Language)}
          className="h-12 rounded-full border border-border bg-card px-4 text-sm font-semibold text-card-foreground shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>
              {l.label}
            </option>
          ))}
        </select>
      </div>

      {listening && (
        <div className="flex items-center gap-2 px-4 text-xs font-semibold text-primary">
          <Waveform />
          <span>{translations.listening}</span>
        </div>
      )}

      {!supported && (
        <p className="px-4 text-xs text-muted-foreground">
          {translations.voiceUnsupported}
        </p>
      )}

      {micError && (
        <p className="px-4 text-xs font-medium text-destructive" role="alert">
          {micError === 'permission'
            ? translations.micBlocked
            : micError === 'no-speech'
              ? translations.noSpeech
              : micError === 'unsupported'
                ? translations.voiceUnsupported
                : translations.networkError}
        </p>
      )}
    </div>
  )
}

function Waveform() {
  return (
    <span className="flex items-end gap-0.5" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className="w-1 rounded-full bg-primary"
          style={{
            height: '14px',
            animation: `petal-wave 1s ease-in-out ${i * 0.12}s infinite`,
          }}
        />
      ))}
      <style>{`@keyframes petal-wave{0%,100%{transform:scaleY(0.4)}50%{transform:scaleY(1)}}`}</style>
    </span>
  )
}