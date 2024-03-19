import { IPFS_API } from 'src/constants';

export const ipfsUrl = (url: string) => {
	return `${IPFS_API}/ipfs/${url}`;
};
