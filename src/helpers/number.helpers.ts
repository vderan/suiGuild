export const formatNumber = (number: number, decimals = 2, useGrouping = true) => {
	return new Intl.NumberFormat('en-US', {
		minimumFractionDigits: 0,
		maximumFractionDigits: decimals,
		useGrouping
	}).format(number);
};

export const getPlacements = () => {
	// Get array of string of placements eg 1st, 2nd, 3rd. Up to 10th and then after that show 10+
	const placements: { id: number; label: string }[] = [];

	for (let i = 1; i <= 10; i++) {
		if (i === 1) {
			placements.push({
				id: i,
				label: `${i}st`
			});
		} else if (i === 2) {
			placements.push({
				id: i,
				label: `${i}nd`
			});
		} else if (i === 3) {
			placements.push({
				id: i,
				label: `${i}rd`
			});
		} else {
			placements.push({
				id: i,
				label: `${i}th`
			});
		}
	}

	placements.push({
		id: 0,
		label: '10th +'
	});

	return placements;
};

export const normalizeDecimalPrecision = (value: string, trailingDigits?: number) => {
	if (trailingDigits === undefined) {
		return value;
	}
	if (trailingDigits === 0 && value) {
		const firstOccurrenceIndex = value.search(/\./);
		return ~firstOccurrenceIndex ? value.substr(0, firstOccurrenceIndex) : value;
	}

	const precision = trailingDigits ?? 0;
	let result = value;
	if (precision) {
		const decimalsLongerThanPrecisionRe = new RegExp(`(?:\\.|,)\\d{${precision + 1},}$`);
		if (decimalsLongerThanPrecisionRe.test(value)) {
			const truncateExtraDecimalsRe = new RegExp(`((?:\\.|,)\\d{${precision}})\\d*`);
			result = value.replace(truncateExtraDecimalsRe, '$1');
		}
	}
	return result;
};

export const normalizeRange = (value: string, max = '', min = '') => {
	let result = value;
	if (max && Number(value) > Number(max)) {
		result = max;
	}

	if (min && Number(value) < Number(min)) {
		result = min;
	}

	return result;
};
