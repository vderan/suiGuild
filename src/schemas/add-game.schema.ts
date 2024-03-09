import * as z from 'zod';

export const addGameSchema = z.object({
	selectedGames: z.array(z.number()).nonempty({ message: 'Select a game' })
});
