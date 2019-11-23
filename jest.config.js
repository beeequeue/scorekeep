/* eslint-disable @typescript-eslint/no-var-requires */
const { resolve } = require('path')
const { pathsToModuleNameMapper } = require('ts-jest/utils')
const { compilerOptions } = require('./tsconfig')

const rootDir = resolve(__dirname)

/**
 * @type DefaultOptions
 */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: [`${rootDir}/packages/`],
  setupFiles: [`${rootDir}/jest.setup.ts`],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
}
