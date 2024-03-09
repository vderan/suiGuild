import { IPFS } from 'src/constants/xmpp.constants';

export const ipfsUrl = (url: string) => {
	return `${IPFS}/ipfs/${url}`;
};
