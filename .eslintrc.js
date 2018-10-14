module.exports = {
    extends: ['airbnb', 'prettier'],
    plugins: ['import', 'prettier'],
    rules: {
        indent: ['error', 4],
        semi: 0,
        'linebreak-style': 0,
        'prettier/prettier': ['error'],
        'arrow-body-style': ['error', 'never'],
    },
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 6,
        ecmaFeatures: {
            experimentalObjectRestSpread: true,
        },
    },
}
