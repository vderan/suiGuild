import '@mysten/dapp-kit/dist/index.css';
import { PropsWithChildren } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { SocketProvider } from 'use-socket-io-react';
import { AuthProvider, NotificationProvider, ChatProvider } from '../contexts';
import { RecoilRoot } from 'recoil';
import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SnackbarProvider } from './Snackbar.provider';
import { networks } from 'src/constants/sui.constants';
import { SUI_CHAIN } from 'src/constants/env.constants';

const queryClient = new QueryClient();

export const Providers = ({ children }: PropsWithChildren) => {
	return (
		<QueryClientProvider client={queryClient}>
			<SuiClientProvider networks={networks} defaultNetwork={SUI_CHAIN}>
				{/* TODO: add endpoint and remove auto connect */}
				<SocketProvider uri={''} config={{ autoConnect: false }}>
					<WalletProvider autoConnect>
						<RecoilRoot>
							<SnackbarProvider>
								<NotificationProvider>
									<AuthProvider>
										<ChatProvider>
											<HelmetProvider>{children}</HelmetProvider>
										</ChatProvider>
									</AuthProvider>
								</NotificationProvider>
							</SnackbarProvider>
						</RecoilRoot>
					</WalletProvider>
				</SocketProvider>
			</SuiClientProvider>
		</QueryClientProvider>
	);
};
