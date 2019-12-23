import { configure, addParameters } from '@storybook/react'
import { create } from '@storybook/theming'
import { colors } from '../src/design'
import './styles.css'

const theme = create({
  base: 'dark',

  colorPrimary: colors.highlights.one,
  colorSecondary: colors.background.secondary,

  // UI
  appBg: colors.background.primary,
  appContentBg: colors.background.body,
  appBorderColor: colors.highlights.one,
  appBorderRadius: 3,

  // Text colors
  textColor: colors.text.primary,
  textInverseColor: colors.text.tertiary,

  // Toolbar default and active colors
  barTextColor: '#111',
  barSelectedColor: '#111',
  barBg: colors.highlights.gradients.main,

  // Form colors
  inputBg: colors.background.primary,
  inputBorder: colors.highlights.one,
  inputTextColor: colors.text.secondary,
  inputBorderRadius: 3,
})

// Option defaults.
addParameters({
  options: {
    theme: theme,
  },
})

// automatically import all files ending in *.stories.js
configure(require.context('../src', true, /\.stories\.tsx$/), module)
