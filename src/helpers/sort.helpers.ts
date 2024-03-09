import { IPost, IForum, INotification } from 'src/contexts';

export const sortPostsByKeyword = (data: IPost[], key: string | null, order: 'asc' | 'desc' = 'desc') => {
	if (key && data.length) {
		const filteredData = data.sort((a, b) => {
			const newKey = key === 'new';

			const itemSort =
				Number(newKey ? b.createdAt : key === 'votes' ? b.vote : b.comments?.length) -
				Number(newKey ? a.createdAt : key === 'votes' ? a.vote : a.comments?.length);
			return order === 'desc' && !newKey ? itemSort || Number(b.createdAt) - Number(a.createdAt) : itemSort;
		});
		return filteredData;
	} else {
		return data.sort((a, b) => Number(b.createdAt) - Number(a.createdAt));
	}
};

export const sortForumsByKeyword = (data: IForum[], key: string | null, order: 'asc' | 'desc' = 'desc') => {
	if (key && data?.length) {
		const filteredData = data.sort((a, b) => {
			const newKey = key === 'new';

			const itemSort =
				Number(
					newKey ? b.createdAt : key === 'posts' ? b.numPost : key === 'comments' ? b.numComment : b.followers.length
				) -
				Number(
					newKey ? a.createdAt : key === 'posts' ? a.numPost : key === 'comments' ? a.numComment : a.followers.length
				);
			return order === 'desc' && !newKey ? itemSort || Number(b.createdAt) - Number(a.createdAt) : itemSort;
		});
		return filteredData;
	} else {
		return data.sort((a, b) => Number(b.createdAt) - Number(a.createdAt));
	}
};

export const sortNotificationsByDate = (notifications: INotification[]) => {
	const data = notifications.sort((a, b) => {
		return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
	});

	return data;
};
