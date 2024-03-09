import * as z from 'zod';
import { isValidSuiAddress } from '@mysten/sui.js/utils';

export const sendTokenSchema = (calculatedAmount: number, userBallance: number) =>
	z.object({
		amount: z
			.string()
			.refine(val => Number(val) > 0, { message: 'Crypto amount should be greater than 0' })
			.refine(() => userBallance >= calculatedAmount, { message: 'Insufficient balance' }),
		receipent: z.string().refine(isValidSuiAddress, {
			message: 'Invalid receipent address'
		})
	});
