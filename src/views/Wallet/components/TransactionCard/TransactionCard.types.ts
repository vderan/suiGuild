export interface ITransactionProps {
	type: 'receive' | 'send';
	address: string;
	price: string;
}
