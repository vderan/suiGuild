export const FORM_ERRORS = {
	required: 'Please fill out this field',
	minChars: (min: number) => `Please provide at least ${min} characters`,
	maxChars: (min: number) => `Please provide at most ${min} characters`,
	file: 'Please provide a file',
	image: 'Please provide an image',
	minSelection: (min: number) => `Please select at least ${min} option`,
	selection: 'Please select an option',
	alphaNumeric: 'Please provide an alphanumeric value',
	url: 'Please provide a valid URL',
	email: 'Please provide a valid email address'
};
