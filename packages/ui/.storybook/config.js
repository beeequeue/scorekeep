import { configure, addParameters } from '@storybook/react'
import { themes, create } from '@storybook/theming'
import './styles.css'

export default create({
  base: 'dark',

  colorPrimary: '#21e6c1',
  colorSecondary: '#FAD8D6',

  // UI
  appBg: '#041224',
  appContentBg: '#1c1e31',
  appBorderColor: '#278ea5',
  appBorderRadius: 4,

  // Text colors
  textColor: 'white',
  textInverseColor: 'black',

  // Toolbar default and active colors
  barTextColor: 'silver',
  barSelectedColor: 'black',
  barBg: 'hotpink',

  // Form colors
  inputBg: 'white',
  inputBorder: 'silver',
  inputTextColor: 'black',
  inputBorderRadius: 4,
})

// Option defaults.
addParameters({
  options: {
    theme: themes.dark,
  },
})

// automatically import all files ending in *.stories.js
configure(require.context('../src', true, /\.stories\.tsx$/), module)
