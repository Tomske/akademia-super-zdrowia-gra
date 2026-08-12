export function toLocalDateKey(date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function recentDateKeys(count = 30, from = new Date()): string[] {
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(from.getFullYear(), from.getMonth(), from.getDate() - index)
    return toLocalDateKey(date)
  })
}

export function formatPolishDate(key: string): string {
  const [year, month, day] = key.split('-').map(Number)
  return new Intl.DateTimeFormat('pl-PL', { weekday:'short', day:'numeric', month:'long' }).format(new Date(year, month - 1, day))
}

export function dateKeysBetween(fromKey: string, toKey: string): string[] {
  const [fy, fm, fd] = fromKey.split('-').map(Number)
  const [ty, tm, td] = toKey.split('-').map(Number)
  const keys: string[] = []
  const cursor = new Date(ty, tm - 1, td)
  const first = new Date(fy, fm - 1, fd)
  while (cursor >= first) {
    keys.push(toLocalDateKey(cursor))
    cursor.setDate(cursor.getDate() - 1)
  }
  return keys
}

export function monthKey(dateKey: string): string {
  return dateKey.slice(0, 7)
}

export function formatPolishMonth(key: string): string {
  const [year, month] = key.split('-').map(Number)
  const name = new Intl.DateTimeFormat('pl-PL', { month:'long' }).format(new Date(year, month - 1, 1))
  return `${name.charAt(0).toUpperCase()}${name.slice(1)} ${year}`
}
