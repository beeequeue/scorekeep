export const colors = {
  background: {
    body: '#101516',
    primary: '#182225',
    secondary: '#1e2b2e',
  },
  text: {
    primary: '#eee',
    secondary: '#a1bab3',
    tertiary: '#6c9389',
  },
  highlights: {
    one: '#1AD692',
    two: '#5CDBE7',
    gradients: {
      main: (deg: number = 0) => `linear-gradient(${deg}deg, #1AD692, #5CDBE7)`,
    },
  },
} as const
