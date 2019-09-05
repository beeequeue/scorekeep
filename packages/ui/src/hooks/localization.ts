const getLanguage = () => {
  if (navigator.language) {
    return navigator.language
  }

  if (navigator.languages) {
    return navigator.languages[0]
  }

  return 'en-GB'
}

const language = getLanguage()

const formatNumber = (value: number, options: Intl.NumberFormatOptions = {}) =>
  Intl.NumberFormat(language, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  }).format(value)

const formatCurrency = (
  value: number,
  options: Intl.NumberFormatOptions = {},
) =>
  Intl.NumberFormat(language, {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  }).format(value / 100)

export const useLocalization = () => ({
  number: formatNumber,
  currency: formatCurrency,
})
