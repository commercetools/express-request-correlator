module.exports = {
  presets: [
    '@babel/preset-flow',
    ['@babel/preset-env', { targets: { node: true } }],
  ],
  plugins: ['@babel/plugin-proposal-object-rest-spread'],
};
