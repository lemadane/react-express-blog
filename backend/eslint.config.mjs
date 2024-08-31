import globals from 'globals'
import pluginJs from '@eslint/js'
import { rules } from '@eslint/js/src/configs/eslint-all'

export default [
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  {
    rules: {
      ...rules,
      semi: ['error', 'always'],
      singleQuote: ['error', 'always'],
      'no-unused-vars': [
        'error',
        { vars: 'all', args: 'after-used', ignoreRestSiblings: true },
      ],
    },
  },
]
