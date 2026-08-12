import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
}

export type InstallAvailability = 'none' | 'prompt' | 'ios'

export function isStandalone(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches || (navigator as unknown as { standalone?: boolean }).standalone === true
}

export function isIos(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent)
}

export function useInstallPrompt() {
  const [deferredEvent, setDeferredEvent] = useState<BeforeInstallPromptEvent>()
  const [installed, setInstalled] = useState(isStandalone())

  useEffect(() => {
    const onPrompt = (event: Event) => { event.preventDefault(); setDeferredEvent(event as BeforeInstallPromptEvent) }
    const onInstalled = () => setInstalled(true)
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const availability: InstallAvailability = installed ? 'none' : deferredEvent ? 'prompt' : isIos() ? 'ios' : 'none'

  const promptInstall = async () => {
    if (!deferredEvent) return
    try { await deferredEvent.prompt() } finally { setDeferredEvent(undefined) }
  }

  return { availability, promptInstall }
}
