import { useGilder } from 'src/hooks/useGilder';
import { useCustomSWR } from './useCustomSWR';

export default function useDrafts(userId: string) {
	const { getUserDrafts } = useGilder();

	return useCustomSWR(userId ? 'getUserDrafts' : null, () => getUserDrafts(userId));
}
