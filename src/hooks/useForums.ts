import { useGilder } from 'src/hooks/useGilder';
import { useCustomSWR } from './useCustomSWR';

export default function useForums() {
	const { getAllCommunities } = useGilder();

	return useCustomSWR('getAllCommunities', getAllCommunities);
}
