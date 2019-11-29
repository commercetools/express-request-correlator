module.exports = {
  '**/*.js': [
    'npm run fix:eslint',
    'npm run format:js',
    'git add',
    'flow focus-check',
  ],
  '*.md': ['npm run format:md', 'git add'],
};
