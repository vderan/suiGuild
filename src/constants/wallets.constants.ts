export interface IWalletProps {
	name: string;
	downloadUrl: string;
}

export const suiWallets: IWalletProps[] = [
	{
		name: 'Ethos Wallet',
		downloadUrl: 'https://chromewebstore.google.com/detail/ethos-sui-wallet/mcbigmjiafegjnnogedioegffbooigli'
	},
	{
		name: 'Sui Wallet',
		downloadUrl: 'https://chromewebstore.google.com/detail/opcgpfmipidbgpenhmajoajpbobppdil'
	},
	{
		name: 'Suiet',
		downloadUrl: 'https://chromewebstore.google.com/detail/suiet-sui-wallet/khpkpbbcccdmmclmpigdgddabeilkdpd'
	},
	{
		name: 'Fewcha Move Wallet',
		downloadUrl: 'https://chromewebstore.google.com/detail/fewcha-move-wallet/ebfidpplhabeedpnhjnobghokpiioolj'
	},
	{
		name: 'GlassWallet',
		downloadUrl: 'https://chromewebstore.google.com/detail/glass-wallet-sui-wallet/loinekcabhlmhjjbocijdoimmejangoa'
	},
	{
		name: 'Morphis Wallet',
		downloadUrl: 'https://chromewebstore.google.com/detail/morphis-wallet/heefohaffomkkkphnlpohglngmbcclhi'
	}
];
