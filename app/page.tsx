import { AssistantApp } from '@/components/assistant-app'
import { AuthGate } from '@/components/auth-gate'
import { AuthProvider } from '@/components/auth-provider'
import { ToastProvider } from '@/components/toast'

export default function Page() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AuthGate>
          <AssistantApp />
        </AuthGate>
      </ToastProvider>
    </AuthProvider>
  )
}
