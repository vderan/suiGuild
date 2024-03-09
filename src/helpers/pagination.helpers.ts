import { DEFAULT_PAGE_LIMIT } from 'src/constants/constants';

export const getPageCount = (itemsLength: number, pageLimit = DEFAULT_PAGE_LIMIT) => {
	const pageCount = itemsLength % pageLimit > 0 ? itemsLength / pageLimit + 1 : itemsLength / pageLimit;
	return Math.floor(pageCount) || 0;
};

export const getItemsPerPage = <T>(array: T[], pageNumber: number, pageLimit = DEFAULT_PAGE_LIMIT) => {
	const startIdx = (pageNumber - 1) * pageLimit;
	return array.slice(startIdx, startIdx + pageLimit);
};
