process.env.NODE_ENV = 'development';

module.exports = {
  '*.md': ['prettier --write'],
  '*.yaml': ['prettier --write'],
  '*.js': ['prettier --write', 'eslint --fix'],
  '*.ts': ['prettier --write', () => 'tsc -b'],
};
