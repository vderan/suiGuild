import { useGilder } from 'src/hooks/useGilder';
import { useCustomSWR } from './useCustomSWR';

export default function usePosts() {
	const { getPosts } = useGilder();

	return useCustomSWR('getPosts', getPosts);
}
