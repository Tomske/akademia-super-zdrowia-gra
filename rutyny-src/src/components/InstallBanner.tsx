import { useState } from 'react'
import { useInstallPrompt } from '../hooks/useInstallPrompt'

const DISMISS_KEY = 'zdrowe-rutyny-install-dismissed'

export function InstallBanner() {
  const { availability, promptInstall } = useInstallPrompt()
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(DISMISS_KEY) === '1')

  if (dismissed || availability === 'none') return null

  const dismiss = () => { localStorage.setItem(DISMISS_KEY, '1'); setDismissed(true) }

  return (
    <div className="install-banner" role="status">
      {availability === 'prompt' ? (
        <>
          <span>Zainstaluj Zdrowe Rutyny jako aplikację</span>
          <button onClick={promptInstall}>Zainstaluj</button>
        </>
      ) : (
        <span>Dotknij Udostępnij, a potem „Do ekranu początkowego”, żeby mieć aplikację na ekranie głównym.</span>
      )}
      <button className="install-banner-dismiss" onClick={dismiss} aria-label="Nie pokazuj więcej">×</button>
    </div>
  )
}
