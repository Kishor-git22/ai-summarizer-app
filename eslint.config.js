import js from '@eslint/js'
import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import globals from 'globals'
import eslintConfigPrettier from 'eslint-config-prettier'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import reactRefreshPlugin from 'eslint-plugin-react-refresh'

export default [
  // Base configuration with ignores
  {
    ignores: ['node_modules/', '.github/']
  },

  // JavaScript configuration
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        },
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node
      }
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'react-refresh': reactRefreshPlugin,
      '@typescript-eslint': tsPlugin
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    rules: {
      ...js.configs.recommended.rules,
      // Basic rules (delegate formatting to Prettier)
      'no-console': 'warn',
      'no-debugger': 'warn',
      // Turn off stylistic rules handled by Prettier to avoid conflicts
      semi: 'off',
      quotes: 'off',
      indent: 'off',
      'no-trailing-spaces': 'off',
      'no-multiple-empty-lines': 'off',
      'comma-dangle': 'off',
      'max-len': 'off',
      'no-unused-vars': 'off',
      'no-prototype-builtins': 'off',
      'no-constant-condition': ['error', { checkLoops: false }],
      'no-underscore-dangle': 'off',
      'no-param-reassign': 'off',
      'class-methods-use-this': 'off',
      'no-plusplus': 'off',
      'no-continue': 'off',
      'no-await-in-loop': 'off',
      'no-restricted-syntax': 'off',
      'consistent-return': 'off',
      'no-nested-ternary': 'off',
      'default-case': 'off',
      camelcase: 'off',
      'prefer-const': 'warn',
      'global-require': 'off',
      'no-var': 'off',
      'vars-on-top': 'off',
      'no-redeclare': 'warn',
      'no-dupe-keys': 'warn',
      'no-duplicate-imports': 'warn',
      'no-unused-expressions': 'warn',
      'no-use-before-define': 'off',
      'no-void': 'off',
      'no-useless-constructor': 'off',
      'no-empty': ['warn', { allowEmptyCatch: true }],
      'no-empty-function': ['warn', { allow: ['constructors'] }],
      'prefer-promise-reject-errors': 'off',
      'prefer-rest-params': 'warn',
      'prefer-spread': 'warn',
      'prefer-template': 'warn',
      'require-await': 'warn',
      'require-atomic-updates': 'warn',
      'require-unicode-regexp': 'off',
      'require-yield': 'warn'
    }
  },

  // TypeScript configuration
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node
      }
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true
        }
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-var-requires': 'off'
    }
  },

  // Test files configuration
  {
    files: ['**/*.test.js', '**/*.spec.js', '**/*.test.ts', '**/*.spec.ts'],
    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.node,
        ...globals.es2021
      }
    },
    rules: {
      'no-unused-expressions': 'off'
    }
  },
  // Add eslint-config-prettier last to disable conflicting ESLint formatting rules
  eslintConfigPrettier
]
