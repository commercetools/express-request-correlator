module.exports = {
  runner: 'jest-runner-prettier',
  displayName: 'prettier',
  moduleFileExtensions: ['js', 'ts', 'md', 'yaml', 'yml'],
  testMatch: [
    '<rootDir>/**/*.js',
    '<rootDir>/**/*.ts',
    '<rootDir>/**/*.md',
    '<rootDir>/**/*.graphql',
  ],
};
