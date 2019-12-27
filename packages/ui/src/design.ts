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
  primary: (deg: number = 0) => `linear-gradient(${deg}deg, ${highlights.primary.one} 25%, ${highlights.primary.two})`,
  danger: (deg: number = 0) => `linear-gradient(${deg}deg, ${highlights.danger.one} 25%, ${highlights.danger.two})`,
} as const

// const transparent = new Color('transparent')

export const colors = {
  background,
  text,
  actions: {
    primary: {
      background: background.primary,
      text: text.primary,
      highlight: highlights.primary.one,
      gradient: gradients.primary,
      shine: highlights.primary.one.fade(0.25),
    },
    secondary: {
      background: background.primary,
      text: text.secondary,
      highlight: highlights.primary.one,
      gradient: gradients.primary,
      shine: highlights.primary.one.fade(0.25),
    },
    danger: {
      background: background.primary,
      text: text.primary,
      highlight: highlights.danger.one,
      gradient: gradients.danger,
      shine: highlights.danger.one.fade(0),
    },
  },
} as const

export type Action = keyof typeof colors.actions
