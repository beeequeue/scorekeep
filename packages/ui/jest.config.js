/* eslint-disable @typescript-eslint/no-var-requires,no-undef */
const config = require('../../jest.config')

module.exports = {
  ...config,
  testEnvironment: 'jsdom',
  transform: {
    ...config.transform,
    '\\.(gql|graphql)$': 'jest-transform-graphql',
  },
  testURL: 'http://localhost',
}
