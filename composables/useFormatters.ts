import numeral from 'numeral'
import { format, parseISO, isValid } from 'date-fns'

/**
 * Composable for formatting values consistently across the app
 */
export function useFormatters() {
  /**
   * Format a number as currency (USD)
   */
  function formatCurrency(value: number | null | undefined, compact = false): string {
    if (value === null || value === undefined || isNaN(value)) {
      return '-'
    }

    if (compact) {
      if (value >= 1_000_000_000) {
        return `$${numeral(value / 1_000_000_000).format('0.0')}B`
      }
      if (value >= 1_000_000) {
        return `$${numeral(value / 1_000_000).format('0.0')}M`
      }
      if (value >= 1_000) {
        return `$${numeral(value / 1_000).format('0.0')}K`
      }
    }

    if (value >= 1000) {
      return `$${numeral(value).format('0,0')}`
    }

    return `$${numeral(value).format('0,0.00')}`
  }

  /**
   * Format a number with appropriate precision
   */
  function formatNumber(value: number | null | undefined, decimals = 2): string {
    if (value === null || value === undefined || isNaN(value)) {
      return '-'
    }

    if (value >= 1_000_000) {
      return numeral(value).format('0.0a').toUpperCase()
    }

    if (value >= 1000) {
      return numeral(value).format('0,0')
    }

    return numeral(value).format(`0,0.${'0'.repeat(decimals)}`)
  }

  /**
   * Format a percentage
   */
  function formatPercent(value: number | null | undefined, decimals = 2): string {
    if (value === null || value === undefined || isNaN(value)) {
      return '-'
    }

    return numeral(value / 100).format(`0.${'0'.repeat(decimals)}%`)
  }

  /**
   * Format P/S ratio
   */
  function formatRatio(value: number | null | undefined): string {
    if (value === null || value === undefined || isNaN(value)) {
      return '-'
    }

    if (value >= 1000) {
      return numeral(value).format('0.0a').toUpperCase()
    }

    return numeral(value).format('0.0')
  }

  /**
   * Format a date string
   */
  function formatDate(
    date: string | Date | null | undefined,
    formatStr = 'MMM d, yyyy'
  ): string {
    if (!date) return '-'

    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date

      if (!isValid(dateObj)) {
        return '-'
      }

      return format(dateObj, formatStr)
    } catch {
      return '-'
    }
  }

  /**
   * Format date for API calls (YYYY-MM-DD)
   */
  function formatDateForApi(date: Date): string {
    return format(date, 'yyyy-MM-dd')
  }

  /**
   * Format a date as relative time (e.g., "2 hours ago")
   */
  function formatRelativeTime(date: string | Date): string {
    const now = new Date()
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    const diffMs = now.getTime() - dateObj.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`

    return formatDate(dateObj)
  }

  return {
    formatCurrency,
    formatNumber,
    formatPercent,
    formatRatio,
    formatDate,
    formatDateForApi,
    formatRelativeTime,
  }
}
