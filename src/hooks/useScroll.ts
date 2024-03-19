import { useDevice } from './useDevice';

export const useScroll = () => {
	const { iMid } = useDevice();
	const container = iMid ? document.documentElement : document.getElementById('main-container');

	const scrollToTop = () => {
		container?.scrollTo(0, 0);
	};
	return { scrollToTop };
};
