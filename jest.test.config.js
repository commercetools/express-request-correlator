module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.ts$': 'ts-jest',
  },
  testRegex: '\\.spec\\.[j|t]s$',
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  watchPlugins: ['jest-watch-typeahead/filename'],
};
