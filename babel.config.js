// babel.config.js
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          chrome: '120',
        },
        useBuiltIns: 'usage',
        corejs: '3.6.5',
      },
    ],
    '@babel/preset-typescript',
  ],
};
