const presets =  [
  [
    '@babel/preset-env',
    {
      'useBuiltIns': 'entry',
      'targets': {
        'browsers': [
          '>0.25% in JP',
          'not ie <= 10',
          'not op_mini all'
        ],
        'node': 'current',
      },
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