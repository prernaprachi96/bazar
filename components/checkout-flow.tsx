'use client'

import { Banknote, CheckCircle2, ChevronLeft, CreditCard, Mail, MapPin, Smartphone, Truck } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { CartItem, DeliveryAddress, Order, PaymentMethod } from '@/lib/types'

const DELIVERY_SLOTS = ['Today, 6–8 PM', 'Tomorrow, 8–10 AM', 'Tomorrow, 4–6 PM']

type Step = 'address' | 'payment' | 'confirmation'

interface CheckoutFlowProps {
  cart: CartItem[]
  total: number
  userEmail: string
  userName: string
  onClose: () => void
  onOrderComplete: () => void
}

const EMPTY_ADDRESS: DeliveryAddress = {
  fullName: '',
  phone: '',
  line1: '',
  city: '',
  state: '',
  pincode: '',
}

export function CheckoutFlow({ cart, total, userEmail, userName, onClose, onOrderComplete }: CheckoutFlowProps) {
  const [step, setStep] = useState<Step>('address')
  const [address, setAddress] = useState<DeliveryAddress>({ ...EMPTY_ADDRESS, fullName: userName })
  const [slot, setSlot] = useState(DELIVERY_SLOTS[0])
  const [payment, setPayment] = useState<PaymentMethod>('card')
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [order, setOrder] = useState<Order | null>(null)
  const [emailSent, setEmailSent] = useState(false)

  const deliveryFee = total >= 35 ? 0 : 4.99
  const grandTotal = total + deliveryFee

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!address.fullName || !address.phone || !address.line1 || !address.city || !address.pincode) {
      setError('Please fill in every field so we know where to deliver.')
      return
    }
    setStep('payment')
  }

  const placeOrder = async () => {
    setPlacing(true)
    setError(null)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail, items: cart, address, paymentMethod: payment, slot }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Could not place your order. Please try again.')
        setPlacing(false)
        return
      }
      setOrder(data.order)
      setEmailSent(Boolean(data.email?.sent))
      setStep('confirmation')
      onOrderComplete()
    } catch {
      setError('Could not reach the server. Please try again.')
    } finally {
      setPlacing(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-foreground/20 backdrop-blur-sm" role="dialog" aria-label="Checkout">
      <div className="flex h-dvh w-full max-w-md flex-col overflow-y-auto bg-background p-4 shadow-2xl sm:p-5">
        <div className="mb-4 flex items-center gap-2">
          {step !== 'confirmation' && (
            <button
              type="button"
              onClick={() => (step === 'payment' ? setStep('address') : onClose())}
              className="flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary"
              aria-label="Back"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </button>
          )}
          <h2 className="font-display text-base font-bold text-foreground">
            {step === 'address' && 'Delivery Address'}
            {step === 'payment' && 'Payment'}
            {step === 'confirmation' && 'Order Confirmed'}
          </h2>
        </div>

        {step === 'address' && (
          <form onSubmit={handleAddressSubmit} className="flex flex-col gap-3">
            <div className="flex items-center gap-2 rounded-2xl bg-secondary px-3 py-2 text-xs text-muted-foreground">
              <MapPin className="size-3.5 shrink-0" aria-hidden="true" /> Tell us where to deliver your order.
            </div>

            <Field label="Full name" value={address.fullName} onChange={(v) => setAddress({ ...address, fullName: v })} />
            <Field label="Phone number" value={address.phone} onChange={(v) => setAddress({ ...address, phone: v })} type="tel" />
            <Field label="Address" value={address.line1} onChange={(v) => setAddress({ ...address, line1: v })} />
            <div className="grid grid-cols-2 gap-3">
              <Field label="City" value={address.city} onChange={(v) => setAddress({ ...address, city: v })} />
              <Field label="State" value={address.state} onChange={(v) => setAddress({ ...address, state: v })} />
            </div>
            <Field label="Pincode" value={address.pincode} onChange={(v) => setAddress({ ...address, pincode: v })} />

            <div>
              <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">Delivery slot</span>
              <div className="flex flex-col gap-2">
                {DELIVERY_SLOTS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSlot(s)}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm ${
                      slot === s ? 'border-primary bg-primary/10 font-semibold text-foreground' : 'border-border text-muted-foreground'
                    }`}
                  >
                    <Truck className="size-4 shrink-0" aria-hidden="true" /> {s}
                  </button>
                ))}
              </div>
            </div>

            {error && <p role="alert" className="rounded-xl bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">{error}</p>}

            <Button type="submit" className="mt-2 h-11 rounded-full text-sm font-semibold">
              Continue to payment
            </Button>
          </form>
        )}

        {step === 'payment' && (
          <div className="flex flex-col gap-3">
            <div className="rounded-2xl border border-border bg-card p-3 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery fee</span>
                <span>{deliveryFee === 0 ? 'Free' : `$${deliveryFee.toFixed(2)}`}</span>
              </div>
              <div className="mt-1 flex justify-between border-t border-border pt-1 font-display font-bold text-card-foreground">
                <span>Total</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <span className="text-xs font-semibold text-muted-foreground">Choose payment method</span>
            <PaymentOption
              icon={<CreditCard className="size-4" aria-hidden="true" />}
              label="Credit / Debit Card"
              active={payment === 'card'}
              onClick={() => setPayment('card')}
            />
            <PaymentOption
              icon={<Smartphone className="size-4" aria-hidden="true" />}
              label="UPI"
              active={payment === 'upi'}
              onClick={() => setPayment('upi')}
            />
            <PaymentOption
              icon={<Banknote className="size-4" aria-hidden="true" />}
              label="Cash on Delivery"
              active={payment === 'cod'}
              onClick={() => setPayment('cod')}
            />

            {error && <p role="alert" className="rounded-xl bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">{error}</p>}

            <Button onClick={placeOrder} disabled={placing} className="mt-2 h-11 rounded-full text-sm font-semibold">
              {placing ? 'Placing order…' : `Place order · $${grandTotal.toFixed(2)}`}
            </Button>
          </div>
        )}

        {step === 'confirmation' && order && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col items-center gap-2 rounded-2xl bg-secondary py-6 text-center">
              <CheckCircle2 className="size-10 text-primary" aria-hidden="true" />
              <p className="font-display text-lg font-bold text-foreground">Order placed!</p>
              <p className="text-xs text-muted-foreground">Order #{order.id}</p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-3 text-sm">
              <p className="mb-1 flex items-center gap-2 font-semibold text-card-foreground">
                <Truck className="size-4 shrink-0" aria-hidden="true" /> Arriving {order.slot}
              </p>
              <p className="text-xs text-muted-foreground">
                {order.address.line1}, {order.address.city}, {order.address.state} {order.address.pincode}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-3 text-sm">
              <p className="mb-1 flex items-center gap-2 font-semibold text-card-foreground">
                <Mail className="size-4 shrink-0" aria-hidden="true" /> Confirmation email
              </p>
              <p className="text-xs text-muted-foreground">
                {emailSent
                  ? `Sent to ${order.userEmail} with your receipt and delivery details.`
                  : `Email preview generated for ${order.userEmail} (no email provider configured yet — add a RESEND_API_KEY to actually send it).`}
              </p>
            </div>

            <Button onClick={onClose} className="h-11 rounded-full text-sm font-semibold">
              Done
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        className="rounded-2xl border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
      />
    </label>
  )
}

function PaymentOption({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 rounded-2xl border px-3 py-3 text-left text-sm font-semibold ${
        active ? 'border-primary bg-primary/10 text-foreground' : 'border-border text-muted-foreground'
      }`}
    >
      {icon} {label}
    </button>
  )
}
