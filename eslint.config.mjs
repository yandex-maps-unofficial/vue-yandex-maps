import StylisticPlugin from '@stylistic/eslint-plugin';
import pluginImport from 'eslint-plugin-import-x';
import pluginVue from 'eslint-plugin-vue';
import pluginTypescript from '@typescript-eslint/eslint-plugin';
import parserTs from '@typescript-eslint/parser';
import * as parserVue from 'vue-eslint-parser';

const baseRules = {
    'stylistic/semi': [
        'warn',
        'always',
    ],
    curly: [
        'error',
        'multi-line',
    ],
    'stylistic/template-curly-spacing': [
        'warn',
        'always',
    ],
    'stylistic/object-curly-spacing': [
        'warn',
        'always',
    ],
    'no-console': 'off',
    'no-void': ['error', { allowAsStatement: true }],
    'no-debugger': 'off',
    'stylistic/quotes': [
        'error',
        'single',
        {
            allowTemplateLiterals: true,
            avoidEscape: true,
        },
    ],
    'stylistic/brace-style': [
        'error',
        'stroustrup',
    ],
    'stylistic/no-multi-spaces': [
        'error',
    ],
    'no-new': 'off',
    'stylistic/comma-dangle': [
        'error',
        'always-multiline',
    ],
    'stylistic/max-len': 'off',
    'stylistic/indent': [
        'error',
        4,
        {
            SwitchCase: 1,
        },
    ],
    'import/named': 'off',
    'import/no-mutable-exports': 'off',
    'prefer-const': ['error', { destructuring: 'all' }],
    camelcase: ['off'],
    'stylistic/func-call-spacing': 'error',
    'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
    'import/exports-last': 'off',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/order': 'off',
    'stylistic/array-bracket-newline': ['error', 'consistent'],
    'stylistic/array-bracket-spacing': 'error',
    'stylistic/array-element-newline': ['error', 'consistent'],
    'stylistic/arrow-parens': ['error', 'as-needed'],
    'stylistic/arrow-spacing': 'error',
    'stylistic/block-spacing': 'error',
    'stylistic/comma-spacing': 'error',
    'stylistic/comma-style': 'error',
    'stylistic/computed-property-spacing': 'error',
    'stylistic/dot-location': ['error', 'property'],
    'stylistic/eol-last': 'error',
    'stylistic/function-call-argument-newline': ['error', 'consistent'],
    'stylistic/function-paren-newline': ['error', 'consistent'],
    'stylistic/implicit-arrow-linebreak': 'error',
    'stylistic/key-spacing': 'error',
    'stylistic/keyword-spacing': 'error',
    'stylistic/linebreak-style': 'error',
    'stylistic/lines-between-class-members': 'error',
    'stylistic/multiline-ternary': ['error', 'always-multiline'],
    'stylistic/no-extra-semi': 'error',
    'stylistic/no-mixed-operators': 'error',
    'stylistic/no-mixed-spaces-and-tabs': 'error',
    'stylistic/no-multiple-empty-lines': 'error',
    'stylistic/no-trailing-spaces': 'error',
    'stylistic/no-whitespace-before-property': 'error',
    'stylistic/object-curly-newline': [
        'error', {
            multiline: true,
            consistent: true,
        },
    ],
    'stylistic/object-property-newline': [
        'error', {
            allowAllPropertiesOnSameLine: true,
        },
    ],
    'stylistic/one-var-declaration-per-line': 'error',
    'stylistic/operator-linebreak': 'error',
    'stylistic/padded-blocks': ['error', 'never'],
    'stylistic/quote-props': ['error', 'as-needed'],
    'stylistic/rest-spread-spacing': 'error',
    'stylistic/semi-spacing': 'error',
    'stylistic/semi-style': 'error',
    'stylistic/space-before-blocks': 'error',
    'stylistic/space-before-function-paren': ['error', {
        anonymous: 'never',
        named: 'never',
        asyncArrow: 'always',
    }],
    'stylistic/space-in-parens': 'error',
    'stylistic/space-infix-ops': 'error',
    'stylistic/space-unary-ops': 'error',
    'stylistic/spaced-comment': 'error',
    'stylistic/switch-colon-spacing': 'error',
    'stylistic/type-annotation-spacing': 'error',
    'stylistic/type-generic-spacing': 'error',
    'stylistic/type-named-tuple-spacing': 'error',
    'stylistic/wrap-iife': 'error',
    'stylistic/member-delimiter-style': 'error',
    'vue/component-name-in-template-casing': [
        'error', 'kebab-case', {
            registeredComponentsOnly: false,
        },
    ],
    'vue/script-indent': [
        'warn', 4, {
            baseIndent: 0,
            switchCase: 1,
            ignores: [],
        },
    ],
    'vue/html-indent': [
        'warn', 4,
    ],
    'vue/html-closing-bracket-newline': [
        'error', {
            singleline: 'never',
            multiline: 'always',
        },
    ],
    'vue/no-unused-components': 'warn',
    'vue/no-unused-vars': 'warn',
    'vue/no-unused-properties': [
        'error', {
            groups: ['setup', 'data', 'computed', 'methods'],
        },
    ],
    'vue/no-unused-refs': 'error',
    'vue/no-v-html': 'off',
    'vue/require-default-prop': 'off',
    'vue/html-closing-bracket-spacing': [
        'error', {
            startTag: 'never',
            endTag: 'never',
            selfClosingTag: 'never',
        },
    ],
    'vue/attributes-order': ['warn', { alphabetical: true }],
    'vue/valid-v-slot': [
        'error', {
            allowModifiers: true,
        },
    ],
    'vue/html-self-closing': 'error',
    'vue/component-options-name-casing': 'error',
    'vue/custom-event-name-casing': 'error',
    'vue/match-component-import-name': 'error',
    'vue/next-tick-style': 'error',
    'vue/no-duplicate-attr-inheritance': 'error',
    'vue/no-potential-component-option-typo': [
        'error', {
            presets: ['all'],
        },
    ],
    'vue/no-empty-component-block': 'error',
    'vue/no-ref-object-reactivity-loss': 'error',
    'vue/no-setup-props-reactivity-loss': 'error',
    'vue/no-multiple-objects-in-class': 'error',
    'vue/no-static-inline-styles': 'error',
    'vue/no-useless-mustaches': 'error',
    'vue/no-useless-v-bind': 'error',
    'vue/prefer-define-options': 'error',
    'vue/require-direct-export': 'off',
    'vue/no-this-in-before-route-enter': 'error',
    'vue/no-v-text': 'error',
    'vue/padding-line-between-blocks': 'error',
    'vue/no-required-prop-with-default': 'error',
    'vue/prefer-true-attribute-shorthand': 'error',
    'vue/v-for-delimiter-style': 'error',
    'vue/block-lang': [
        'error', {
            script: {
                lang: 'ts',
            },
        },
    ],
    'vue/block-order': [
        'error', {
            order: ['template', 'script', 'style'],
        },
    ],
    'vue/block-tag-newline': 'error',
    'vue/require-emit-validator': 'error',
    'vue/require-name-property': 'error',
    'vue/require-explicit-emits': 'error',
    'vue/v-on-event-hyphenation': [
        'error', 'never', {
            autofix: true,
        },
    ],
    'vue/no-mutating-props': [
        'error', {
            shallowOnly: true,
        },
    ],
    'vue/require-macro-variable-name': [
        'error', {
            defineProps: 'props',
            defineEmits: 'emit',
            defineSlots: 'slots',
            useSlots: 'slots',
            useAttrs: 'attrs',
        },
    ],
    'vue/require-typed-ref': 'error',
    'vue/no-use-v-else-with-v-for': 'error',
    'vue/require-typed-object-prop': 'error',
    'vue/no-deprecated-model-definition': 'error',
    'vue/match-component-file-name': [
        'error', {
            extensions: ['vue'],
            shouldMatchCase: true,
        },
    ],
    'vue/define-emits-declaration': 'off',
    'vue/define-macros-order': [
        'error', {
            order: ['defineOptions', 'defineProps', 'defineEmits', 'defineSlots'],
            defineExposeLast: true,
        },
    ],
    'vue/valid-define-options': ['error'],
    'vue/html-button-has-type': ['error'],
    'vue/html-comment-content-newline': ['warn'],
    'vue/html-comment-content-spacing': ['warn'],
    'vue/no-unused-emit-declarations': ['error'],
    'vue/prefer-prop-type-boolean-first': ['error'],
    'vue/prefer-separate-static-class': ['warn'],
    'vue/require-explicit-slots': ['error'],
    'vue/block-spacing': ['error'],
    'vue/brace-style': ['error', 'stroustrup'],
    'vue/comma-dangle': [
        'error',
        'always-multiline',
    ],
    'vue/eqeqeq': ['error'],
    'vue/key-spacing': ['error'],
    'vue/keyword-spacing': ['error'],
    'vue/no-console': ['error'],
    'vue/no-useless-concat': ['error'],
    'vue/object-curly-spacing': [
        'warn',
        'always',
        {
            arraysInObjects: false,
            objectsInObjects: true,
        },
    ],
    'vue/template-curly-spacing': ['error', 'always'],
    'vue/order-in-components': ['error', {
        order: [
            'el',
            'name',
            'key',
            'parent',
            'functional',
            ['delimiters', 'comments'],
            ['components', 'directives', 'filters'],
            'extends',
            'mixins',
            ['provide', 'inject'],
            'ROUTER_GUARDS',
            'layout',
            'middleware',
            'validate',
            'scrollToTop',
            'transition',
            'loading',
            'inheritAttrs',
            'model',
            ['props', 'propsData'],
            'emits',
            'slots',
            'setup',
            'asyncData',
            'data',
            'fetch',
            'head',
            'computed',
            'watch',
            'watchQuery',
            'LIFECYCLE_HOOKS',
            'methods',
            ['template', 'render'],
            'renderError',
        ],
    }],
    'vue/max-attributes-per-line': ['error', {
        multiline: {
            max: 1,
        },
    }],
    'no-async-promise-executor': 'off',
};
const tsRules = {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
        'error',
        {
            args: 'none',
            caughtErrorsIgnorePattern: '^ignore',
            vars: 'local',
        },
    ],
    '@typescript-eslint/no-var-requires': 'error',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-useless-constructor': 'off',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-useless-constructor': [
        'error',
    ],
    '@typescript-eslint/naming-convention': [
        'error',
        {
            selector: 'variableLike',
            format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
            leadingUnderscore: 'allow',
            trailingUnderscore: 'allow',
        },
        {
            selector: 'variable',
            modifiers: ['destructured'],
            format: null,
        },
        {
            selector: 'parameter',
            modifiers: ['destructured'],
            format: null,
        },
        { selector: 'class', format: ['PascalCase'] },
        { selector: 'variable', modifiers: ['destructured'], format: null },
        { selector: 'typeParameter', format: null },
        { selector: 'enumMember', format: null },
        { selector: 'interface', format: null },
        { selector: 'property', format: null },
    ],
    'no-redeclare': 'off',
    '@typescript-eslint/no-redeclare': ['error'],
    'no-dupe-class-members': 'off',
    '@typescript-eslint/no-dupe-class-members': ['error'],
    'no-cond-assign': 'off',
    '@typescript-eslint/no-import-type-side-effects': 'error',
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/ban-ts-comment': [
        'error', {
            'ts-nocheck': false,
        },
    ],
};

export default [
    StylisticPlugin.configs['recommended-flat', 'disable-legacy'],
    ...pluginVue.configs['flat/recommended'],
    {
        plugins: {
            stylistic: StylisticPlugin,
            import: pluginImport,
            vue: pluginVue,
            '@typescript-eslint': pluginTypescript,
        },
        languageOptions: {
            parser: parserTs,
        },
        files: ['**/*.js', '**/*.mjs', '**/*.cjs', '**/*.ts'],
        rules: baseRules,
    },
    {
        plugins: {
            stylistic: StylisticPlugin,
            import: pluginImport,
            vue: pluginVue,
            '@typescript-eslint': pluginTypescript,
        },
        languageOptions: {
            parser: parserTs,
        },
        files: ['**/*.ts'],
        rules: tsRules,
    },
    {
        plugins: {
            stylistic: StylisticPlugin,
            import: pluginImport,
            vue: pluginVue,
            '@typescript-eslint': pluginTypescript,
        },
        languageOptions: {
            parser: parserVue,
            parserOptions: {
                parser: '@typescript-eslint/parser',
                sourceType: 'module',
            },
        },
        files: ['**/*.vue'],
        rules: { ...baseRules, ...tsRules },
    },
    {
        files: [
            '**/pages/**/*.vue', '**/layouts/**/*.vue', '**/app.vue', '**/error.vue',
        ],
        rules: {
            'vue/match-component-file-name': 'off',
        },
    },
    {
        files: [
            '**/examples/**/*.vue',
        ],
        rules: {
            'vue/require-explicit-slots': 'off',
        },
    },
    {
        files: [
            '**/*.ts',
        ],
        rules: {
            'vue/no-ref-object-reactivity-loss': 'off',
        },
    },
    {
        ignores: ['**/nuxt2-plugin.js'],
    },
];