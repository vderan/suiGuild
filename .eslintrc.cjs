module.exports = {
	env: { browser: true, es2020: true },
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:react-hooks/recommended'],
	parser: '@typescript-eslint/parser',
	parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
	plugins: ['react-refresh'],
	rules: {
		'react/jsx-uses-react': 'off',
		'react/react-in-jsx-scope': 'off',
		'react/no-children-prop': 'off',
		'no-mixed-spaces-and-tabs': 'off',
		'@typescript-eslint/no-empty-function': 'off',
		'linebreak-style': ['error', 'unix']
	}
};
