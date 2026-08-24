'use client'

import { CheckCircle2, Languages, Mic, Search, ShoppingBasket, Sparkles } from 'lucide-react'

interface VoiceCommandCenterProps {
  listening: boolean
  transcript: string
  processing: boolean
  itemCount: number
  onCommand: (command: string) => void
  onMicToggle: () => void
  micSupported: boolean
}

const QUICK_COMMANDS = [
  { label: 'Add milk', command: 'Add milk', icon: ShoppingBasket },
  { label: '2 bottles of water', command: 'Add 2 bottles of water', icon: Mic },
  { label: 'Snacks under $4', command: 'Find snacks under $4', icon: Search },
  { label: 'Suggest items', command: 'Suggest something', icon: Sparkles },
]

export function VoiceCommandCenter({
  listening,
  transcript,
  processing,
  itemCount,
  onCommand,
  onMicToggle,
  micSupported,
}: VoiceCommandCenterProps) {
  const status = processing
    ? 'Understanding your command…'
    : listening
      ? 'Listening — speak naturally'
      : 'Ready for your next command'

  return (
    <section
      aria-label="Voice command center"
      className="relative overflow-hidden rounded-[2rem] border border-primary/20 bg-gradient-to-br from-primary/15 via-card to-accent/30 p-5 shadow-sm sm:p-6"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-1/3 size-48 rounded-full bg-accent/30 blur-3xl" />

      <div className="relative grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/80 px-3 py-1 text-xs font-bold text-primary shadow-sm">
            <span
              className={`size-2 rounded-full ${
                listening ? 'animate-pulse bg-primary' : 'bg-emerald-500'
              }`}
            />
            BAZAR VOICE COMMERCE
          </div>

          <h2 className="max-w-xl font-display text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            Shop by speaking. <span className="text-primary">Simple as that.</span>
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Add items, manage quantities, find products by price, and get smart suggestions
            without touching your list.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {QUICK_COMMANDS.map(({ label, command, icon: Icon }) => (
              <button
                key={command}
                type="button"
                onClick={() => onCommand(command)}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/90 px-3 py-2 text-xs font-bold text-card-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary"
              >
                <Icon className="size-3.5" aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center rounded-3xl border border-border bg-card/80 p-4 text-center shadow-sm backdrop-blur sm:min-w-60">
          <button
            type="button"
            onClick={onMicToggle}
            disabled={!micSupported || processing}
            aria-label={listening ? 'Stop listening' : 'Start voice input'}
            className={`relative flex size-20 items-center justify-center rounded-full text-primary-foreground shadow-lg transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 ${
              listening ? 'bg-destructive shadow-destructive/30' : 'bg-primary shadow-primary/30'
            }`}
          >
            {listening && (
              <span
                className="absolute inset-0 animate-ping rounded-full bg-destructive/30"
                aria-hidden="true"
              />
            )}
            <Mic className="relative size-8" aria-hidden="true" />
          </button>

          <p className="mt-3 text-sm font-bold text-card-foreground">{status}</p>

          <p className="mt-1 min-h-5 max-w-52 truncate text-xs text-muted-foreground">
            {transcript ||
              (micSupported
                ? 'Tap the microphone to start'
                : 'Voice input is unavailable in this browser')}
          </p>
        </div>
      </div>

      <div className="relative mt-5 grid grid-cols-3 gap-2 border-t border-border/70 pt-4 sm:max-w-md">
        <Metric
          icon={<Languages className="size-3.5" aria-hidden="true" />}
          value="8"
          label="languages"
        />
        <Metric
          icon={<Sparkles className="size-3.5" aria-hidden="true" />}
          value="Smart"
          label="suggestions"
        />
        <Metric
          icon={<CheckCircle2 className="size-3.5" aria-hidden="true" />}
          value={String(itemCount)}
          label={itemCount === 1 ? 'item in cart' : 'items in cart'}
        />
      </div>
    </section>
  )
}

function Metric({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode
  value: string
  label: string
}) {
  return (
    <div className="flex items-center gap-1.5 text-muted-foreground">
      <span className="text-primary">{icon}</span>
      <span className="text-xs font-bold text-card-foreground">{value}</span>
      <span className="text-[11px]">{label}</span>
    </div>
  )
}
