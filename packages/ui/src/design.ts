import Color from 'color'

const background = {
  body: new Color('#101516'),
  primary: new Color('#182225'),
  secondary: new Color('#1e2b2e'),
} as const

const text = {
  primary: new Color('#eee'),
  secondary: new Color('#a1bab3'),
  tertiary: new Color('#6c9389'),
} as const

const highlights = {
  primary: {
    one: new Color('#1ed497'),
    two: new Color('#5ce6da'),
  },
  danger: {
    one: new Color('#f0163d'),
    two: new Color('#e21b57'),
  },
} as const

const gradients = {
  primary: (deg: number = 0) => `linear-gradient(${deg}deg, ${highlights.primary.one}, ${highlights.primary.two})`,
  danger: (deg: number = 0) => `linear-gradient(${deg}deg, ${highlights.danger.one}, ${highlights.danger.two})`,
} as const

const transparent = new Color('transparent')

export const colors = {
  background,
  text,
  gradients,
  actions: {
    primary: {
      background: background.primary,
      text: text.primary,
      highlight: highlights.primary.one,
      gradient: gradients.primary,
    },
    secondary: {
      background: transparent,
      text: text.secondary,
      highlight: transparent,
      gradient: (_deg?: number) => 'transparent',
    },
    danger: {
      background: background.primary,
      text: text.primary,
      highlight: highlights.danger.one,
      gradient: gradients.danger,
    },
  },
} as const

export type Action = keyof typeof colors.actions
