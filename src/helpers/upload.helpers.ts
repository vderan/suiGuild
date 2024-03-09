import { IPFS } from 'src/constants/xmpp.constants';

export const uploadAttachment = async (blob: File | string, name: string): Promise<string> => {
	const formData = new FormData();

	if (typeof blob === 'string') {
		const response = await fetch(blob);
		const data = await response.arrayBuffer();
		const file = new File([data], name);

		formData.append('file', file);
	} else {
		formData.append('file', blob);
	}

	const response = await fetch(`${IPFS}/api/v0/add`, {
		method: 'POST',
		body: formData,
		mode: 'cors'
	});

	const data = await response.json();
	return data.Hash;
};
