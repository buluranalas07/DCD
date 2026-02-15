export const formatDateKey = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const getTodayKey = (): string => formatDateKey(new Date())

export const getYesterdayKey = (): string => {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return formatDateKey(d)
}
