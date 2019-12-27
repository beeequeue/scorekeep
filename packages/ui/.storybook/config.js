import { configure, addParameters } from '@storybook/react'
import { create } from '@storybook/theming'
import { colors } from '../src/design'
import './styles.css'

const theme = create({
  base: 'dark',

  colorPrimary: colors.actions.primary.highlight.string(),
  colorSecondary: colors.background.secondary.string(),

  // UI
  appBg: colors.background.primary.string(),
  appContentBg: colors.background.body.string(),
  appBorderColor: colors.actions.primary.highlight.string(),
  appBorderRadius: 3,

  // Text colors
  textColor: colors.text.primary.string(),
  textInverseColor: colors.text.tertiary.string(),

  // Toolbar default and active colors
  barTextColor: '#111',
  barSelectedColor: '#111',
  barBg: colors.actions.primary.gradient(90),

  // Form colors
  inputBg: colors.background.primary.string(),
  inputBorder: colors.actions.primary.highlight.string(),
  inputTextColor: colors.text.secondary.string(),
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
