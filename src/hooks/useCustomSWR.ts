/* eslint-disable @typescript-eslint/no-explicit-any */
import useSWR from 'swr';
import { BareFetcher, SWRConfiguration, Key } from 'swr';

export const useCustomSWR = <Data = any>(
	key: Key,
	fetcher: BareFetcher<Data> | null,
	options: SWRConfiguration = {}
) => {
	const defaultOptions = {
		refreshInterval: 2000,
		...options
	};

	return useSWR(key, fetcher, defaultOptions);
};
