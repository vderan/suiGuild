import dayjs from 'dayjs';

export const readableDate = (
	date: Date,
	options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: 'long'
	}
) => {
	return date.toLocaleDateString('en-us', options);
};

// List years from 1970 to current year
export const years = () => {
	const currentYear = new Date().getFullYear();
	const years = [];

	for (let i = 1970; i <= currentYear; i++) {
		years.push(i);
	}

	return years;
};

// List months with numbers from 1 to 12 as value and month name as label
export const months = () => {
	const months = [];

	for (let i = 0; i <= 11; i++) {
		months.push({
			value: i,
			label: new Date(0, i).toLocaleDateString('en-us', { month: 'long' })
		});
	}

	return months;
};

export const differenceDate = (stamp: number) => {
	const current = dayjs();
	const compare = dayjs(stamp);
	if (current.diff(compare, 'year') > 0) {
		return dayjs(compare).format('MMM DD YYYY');
	} else {
		if (current.diff(compare, 'day') > 6) {
			return dayjs(compare).format('MMM DD');
		} else {
			if (current.diff(compare, 'day') > 0) {
				return `${current.diff(compare, 'day')}d ago`;
			} else {
				if (current.diff(compare, 'hour') > 0) {
					return `${current.diff(compare, 'hour')}h ago`;
				} else {
					if (current.diff(compare, 'minute') > 0) {
						return `${current.diff(compare, 'minute')}m ago`;
					} else {
						return 'a few seconds ago';
					}
				}
			}
		}
	}
};

export const formatDate = (stamp: Date) => {
	const current = dayjs();
	const compare = dayjs(stamp);
	if (current.diff(compare, 'day') > 6) {
		return dayjs(compare).format('MMM DD, YYYY');
	} else {
		if (current.diff(compare, 'day') > 0) {
			if (current.diff(compare, 'day') === 1) {
				return 'Yesterday';
			} else {
				return `${current.diff(compare, 'day')}d ago`;
			}
		} else {
			return 'Today';
		}
	}
};

export const formatLatestRoomMessageDate = (date: Date | string) => {
	const current = dayjs();
	const compare = dayjs(typeof date === 'string' ? Number(date) : date);

	if (current.diff(compare, 'day') > 6) {
		return dayjs(compare).format('MMM DD');
	} else {
		if (current.diff(compare, 'day') > 0) {
			return `${current.diff(compare, 'day')}d`;
		} else {
			return dayjs(compare).format('HH:mm');
		}
	}
};
