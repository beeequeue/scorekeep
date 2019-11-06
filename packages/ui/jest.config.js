/* eslint-disable @typescript-eslint/no-var-requires,no-undef */
const config = require('../../jest.config')

module.exports = {
  ...config,
  testEnvironment: 'jsdom',
  testURL: 'http://localhost',
}
