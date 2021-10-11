module.exports = {
  runner: 'jest-runner-eslint',
  displayName: 'eslint',
  moduleFileExtensions: ['js', 'ts'],
  modulePathIgnorePatterns: ['.yarn', 'build', 'dist'],
  testMatch: ['<rootDir>/**/*.js', '<rootDir>/**/*.ts'],
  watchPlugins: ['jest-watch-typeahead/filename'],
};
