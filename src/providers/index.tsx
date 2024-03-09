import '@mysten/dapp-kit/dist/index.css';
import { PropsWithChildren } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { SocketProvider } from 'use-socket-io-react';
import { AuthProvider, ColorModeProvider, NotificationProvider, ChatProvider } from '../contexts';
import { RecoilRoot } from 'recoil';
import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './Theme.provider';
import { SnackbarProvider } from './Snackbar.provider';
import { networks } from 'src/constants/sui.constants';
// import { BACKEND_URL } from 'src/constants/api.constants';

const queryClient = new QueryClient();

export const Providers = ({ children }: PropsWithChildren) => {
	return (
		<QueryClientProvider client={queryClient}>
			<SuiClientProvider networks={networks} defaultNetwork="testnet">
				{/* TODO: add endpoint */}
				<SocketProvider uri={''}>
					<WalletProvider autoConnect>
						<RecoilRoot>
							<AuthProvider>
								<NotificationProvider>
									<ChatProvider>
										<ColorModeProvider>
											<ThemeProvider>
												<HelmetProvider>
													<SnackbarProvider>{children}</SnackbarProvider>
												</HelmetProvider>
											</ThemeProvider>
										</ColorModeProvider>
									</ChatProvider>
								</NotificationProvider>
							</AuthProvider>
						</RecoilRoot>
					</WalletProvider>
				</SocketProvider>
			</SuiClientProvider>
		</QueryClientProvider>
	);
};
