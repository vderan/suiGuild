import { useGilder } from 'src/hooks/useGilder';
import { useCustomSWR } from './useCustomSWR';
import { useProfile } from './useProfile';

export const useActiveUsers = () => {
	const { getUsernames } = useGilder();
	const { getUserByName } = useProfile();

	return useCustomSWR('getActiveUsers', async () => {
		const _usernames = await getUsernames();
		if (!_usernames) return [];
		const data = await Promise.all(_usernames?.map(username => getUserByName(username)));
		return data.flatMap(i => (i?.isActive ? i : []));
	});
};
