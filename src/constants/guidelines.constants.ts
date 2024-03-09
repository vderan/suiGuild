interface IGuideLine {
	id: string;
	title: string;
	content: string;
}

export const guidelines: IGuideLine[] = [
	{
		id: '1',
		title: 'Respect everyone',
		content: 'No harassment or hate speech'
	},
	{
		id: '2',
		title: 'Keep it clean',
		content: 'No NSFW or graphic content'
	},
	{
		id: '3',
		title: 'Be honest',
		content: 'No deceptive practices like spoofing or phishing'
	},
	{
		id: '4',
		title: 'Avoid scams',
		content: 'Report any scammy behavior'
	},
	{
		id: '5',
		title: 'No hate speech',
		content: "Don't incite violence or hatred"
	}
];
