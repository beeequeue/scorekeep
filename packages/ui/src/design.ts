import Color from 'color'

export const colors = {
  background: {
    body: Color('#101516'),
    primary: Color('#182225'),
    secondary: Color('#1e2b2e'),
  },
  text: {
    primary: Color('#eee'),
    secondary: Color('#a1bab3'),
    tertiary: Color('#6c9389'),
  },
  highlights: {
    one: Color('#1AD692'),
    two: Color('#5CDBE7'),
    gradients: {
      main: (deg: number = 0) => `linear-gradient(${deg}deg, #1AD692, #5CDBE7)`,
    },
  },
} as const
