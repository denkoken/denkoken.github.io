const presets =  [
  [
    '@babel/preset-env',
    {
      'modules': false,
      'useBuiltIns': 'entry',
      'targets': [
        '>0.25% in JP',
        'not ie <= 10',
        'not op_mini all'
      ],
      'corejs': 3
    }
  ],
  [
    '@babel/preset-react',
  ]
];

const plugins = [
  [
    'import',
    {
      libraryName: 'antd',
      style: true,
    },
  ],
];

module.exports = { presets, plugins }