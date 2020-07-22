module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'no-console': 'warn',
    'no-debugger': 'warn',
    // don't require .vue extension when importing
    'import/extensions': ['error', 'always', {
      js: 'never',
      vue: 'never'
    }],
    // disallow reassignment of function parameters
    // disallow parameter object manipulation except for specific exclusions
    'no-param-reassign': ['error', {
      props: true,
      ignorePropertyModificationsFor: [
        'state', // for vuex state
        'acc', // for reduce accumulators
        'e' // for e.returnvalue
      ]
    }],
    // allow optionalDependencies
    'import/no-extraneous-dependencies': ['error', {
      optionalDependencies: ['test/unit/index.js']
    }],
    'max-len': ['error', {
      "code": 124,// vscode代码格式化一行最大字符就是124，所以这里要用124
      "tabWidth": 2,
      // "comments": 100,//enforces a maximum line length for comments; defaults to value of code
      // "ignorePattern": true,// ignores lines matching a regular expression; can only match a single line and need to be double escaped when written in YAML or JSON
      "ignoreComments": false,// ignores all trailing comments and comments on their own line
      "ignoreTrailingComments": false,// ignores only trailing comments
      "ignoreUrls": true,// ignores lines that contain a URL
      "ignoreStrings": true,// ignores lines that contain a double-quoted or single-quoted string
      "ignoreTemplateLiterals": true,// ignores lines that contain a template literal
      "ignoreRegExpLiterals": true,// ignores lines that contain a RegExp literal
    }],
    'consistent-return': ['off'],
    'no-underscore-dangle': ['off'],
    'eqeqeq': ['off'],
    'no-param-reassign': ['off'],
    'eol-last': ['off'],
    'linebreak-style': ['off'],
    'no-restricted-syntax': ['off'],
  },
};