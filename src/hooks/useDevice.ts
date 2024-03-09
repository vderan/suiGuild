import { useMediaQuery } from '@mui/material';

export const useDevice = () => {
	const iSm = useMediaQuery('(max-width: 539px)');
	const iMd = useMediaQuery('(max-width: 768px)');
	const iMid = useMediaQuery('(max-width: 1023px)');
	const iLg = useMediaQuery('(max-width: 1099px)');
	const iXLg = useMediaQuery('(max-width: 1366px)');
	const isSidebarFullShown = useMediaQuery('(min-width: 1300px)');
	const isDesktop = useMediaQuery('(min-width: 992px)');
	const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 991px)');

	return {
		iSm: iSm,
		iMd: iMd,
		iMid: iMid,
		iLg: iLg,
		iXLg: iXLg,
		isDesktop: isDesktop,
		isTablet: isTablet,
		isSidebarFullShown
	};
};
