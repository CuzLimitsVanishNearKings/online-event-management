import { format, parseISO } from 'date-fns'

export const formatDate = (date: string | Date, formatStr = 'MMM dd, yyyy'): string => {
  try {
    if (typeof date === 'string') {
      if (date === 'Invalid Date') return 'TBD'
      if (date.includes(',') || isNaN(Date.parse(date)) && !date.includes('-') && !date.includes('T')) {
        return date
      }
      const parsed = parseISO(date)
      if (!isNaN(parsed.getTime())) {
        return format(parsed, formatStr)
      }
      const nativeDate = new Date(date)
      if (!isNaN(nativeDate.getTime())) {
        return format(nativeDate, formatStr)
      }
      return date
    }
    return format(date, formatStr)
  } catch {
    return typeof date === 'string' ? date : 'TBD'
  }
}

export const formatTime = (time: string): string => {
  try {
    if (!time || time === 'Invalid Date') return 'TBD'
    const parsed = parseISO(`1970-01-01T${time}`)
    if (!isNaN(parsed.getTime())) {
      return format(parsed, 'h:mm a')
    }
    return time
  } catch {
    return time
  }
}

export const formatDateTime = (dateTime: string): string => {
  try {
    if (!dateTime || dateTime === 'Invalid Date') return 'TBD'
    const parsed = parseISO(dateTime)
    if (!isNaN(parsed.getTime())) {
      return format(parsed, 'MMM dd, yyyy h:mm a')
    }
    const nativeDate = new Date(dateTime)
    if (!isNaN(nativeDate.getTime())) {
      return format(nativeDate, 'MMM dd, yyyy h:mm a')
    }
    return dateTime
  } catch {
    return dateTime
  }
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    minimumFractionDigits: 0
  }).format(amount) + ' FCFA'
}

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
