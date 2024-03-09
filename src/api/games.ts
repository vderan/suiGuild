interface Games {
	results: {
		id: number;
		name: string;
		background_image: string;
	}[];
}

export const searchGames = async (query: string) => {
	const response = await fetch(
		`https://api.rawg.io/api/games?key=f3f885192fc4478599efae1e6108e7bf&page_size=2000&search=${query}&search_precise=true&search_exact=true`
	);
	const data = await response.json();

	return data as Games;
};

export const getGameDetails = async (id: string) => {
	const response = await fetch(`https://api.rawg.io/api/games/${id}?key=f3f885192fc4478599efae1e6108e7bf`);
	const data = await response.json();

	return data;
};
