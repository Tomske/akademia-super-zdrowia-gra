const ACTIVE_PROFILE_KEY = 'asz-rutyny-active-profile'
export function getStoredActiveProfileId(): string | null { try { return localStorage.getItem(ACTIVE_PROFILE_KEY) } catch { return null } }
export function storeActiveProfileId(id:string): void { try { localStorage.setItem(ACTIVE_PROFILE_KEY, id) } catch { /* np. tryb prywatny, apka dalej działa w pamięci */ } }
export function clearStoredActiveProfileId(): void { try { localStorage.removeItem(ACTIVE_PROFILE_KEY) } catch { /* jw. */ } }
