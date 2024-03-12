import { GAMES_API, GAMES_API_KEY } from 'src/constants/env.constants';

interface Games {
	results: {
		id: number;
		name: string;
		background_image: string;
	}[];
}

export const searchGames = async (query: string) => {
	const response = await fetch(
		`${GAMES_API}?key=${GAMES_API_KEY}&page_size=2000&search=${query}&search_precise=true&search_exact=true`
	);
	const data = await response.json();

	return data as Games;
};

export const getGameDetails = async (id: string) => {
	const response = await fetch(`${GAMES_API}/${id}?key=${GAMES_API_KEY}`);
	const data = await response.json();

	return data;
};
