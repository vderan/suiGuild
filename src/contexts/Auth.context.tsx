import { createContext, useCallback, PropsWithChildren, useEffect, useState } from 'react';
import { useCurrentWallet, useDisconnectWallet, useCurrentAccount, useWallets } from '@mysten/dapp-kit';
import { IGilder, IVideo, ITeam, IGamingSetup, IAward, IAchievement } from './types';
import { useProfile } from 'src/hooks/useProfile';
import { useNavigate } from 'react-router-dom';
import { avatarUrl, coverUrl } from 'src/constants/images.constants';
import { Xmpp } from 'src/api/xmpp';
import { LOCAL_STORAGE } from 'src/constants/api.constants';
import { api } from 'src/api';
import { joinedRoomsState } from 'src/recoil/joinedRooms';
import { useSetRecoilState } from 'recoil';
import { CircularProgress } from 'src/components/Progress';
import { Box } from '@mui/material';
import { toast } from 'react-toastify';

interface IAuthClient {
	signOut: () => Promise<void>;
	loadUserInfo: () => Promise<IGilder | null | void>;
	initChat: (username?: string) => Promise<void>;
	profile: IGilder | null;
	followingCommunities: string[];
	teams: ITeam[];
	gameSummaries: string[];
	achievements: IAchievement[];
	videos: IVideo[];
	awards: IAward[];
	gamingSetup: IGamingSetup[];
	jid: string;
	isUsernameVisible: boolean;
	isLoggedIn: boolean;
	changeUsernameModalVisible: () => void;
}

export const AuthContext = createContext<IAuthClient>({
	signOut: () => Promise.resolve(),
	loadUserInfo: () => Promise.resolve(),
	initChat: () => Promise.resolve(),
	profile: null,
	followingCommunities: [],
	teams: [],
	gameSummaries: [],
	achievements: [],
	videos: [],
	awards: [],
	gamingSetup: [],
	jid: '',
	isUsernameVisible: false,
	isLoggedIn: false,
	changeUsernameModalVisible: () => {}
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
	const navigate = useNavigate();
	const [profile, setUser] = useState<IGilder | null>(null);
	const [isLoaded, setIsLoaded] = useState(false);
	const [followingCommunities, setFollowingCommunities] = useState<string[]>([]);
	const [teams, setTeams] = useState<ITeam[]>([]);
	const [gameSummaries, setGameSummaries] = useState<string[]>([]);
	const [achievements, setAchievements] = useState<IAchievement[]>([]);
	const [videos, setVideos] = useState<IVideo[]>([]);
	const [awards, setAwards] = useState<IAward[]>([]);
	const [gamingSetup, setGamingSetup] = useState<IGamingSetup[]>([]);
	const [jid, setJid] = useState<string>('');
	const [isUsernameVisible, setIsUsernameVisible] = useState(false);
	const wallet = useCurrentWallet();
	const account = useCurrentAccount();
	const wallets = useWallets();
	const { mutateAsync: disconnect } = useDisconnectWallet();
	const setJoinedRooms = useSetRecoilState(joinedRoomsState);
	const { getUserInfo } = useProfile();
	const changeUsernameModalVisible = () => {
		setIsUsernameVisible(false);
	};

	const handleOnXmppLogin = async (username: string, password: string) => {
		const { token } = await api.xmppAuth({
			username,
			password
		});
		localStorage.setItem(LOCAL_STORAGE.JWT, token);

		await new Promise<void>(resolve => {
			Xmpp.connect(username, password);

			Xmpp.onStatus();
			Xmpp.onClose();
			Xmpp.onOnline(jid => {
				setJid(jid.toString());
				resolve();
			});

			Xmpp.start();
		});
	};
	const initChat = useCallback(
		async (name?: string) => {
			const username = name || profile?.displayName;
			// Account exits on SUI and display name is not empty, login to XMPP
			if (username && account?.address) {
				try {
					await handleOnXmppLogin(username, account.address);
				} catch (error) {
					const err = error as Error;

					if (err.name === 'Unauthorized') {
						await api.xmppSignUp({
							username,
							wallet: account.address
						});

						await handleOnXmppLogin(username, account.address);
					}
				}
			}
		},
		[account?.address, profile?.displayName]
	);

	useEffect(() => {
		setIsUsernameVisible(Boolean(!profile?.displayName && profile?.id));
	}, [profile?.displayName, profile?.id]);

	const signOut = useCallback(async () => {
		try {
			if (wallet.isConnected) {
				await disconnect();
			}

			await Xmpp.signOut();
			setJid('');
			setUser(null);
			setJoinedRooms([]);
			navigate('/');
		} catch (e) {
			console.log('Error signing message', e);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [wallet.isConnected]);

	const loadUserInfo = useCallback(async () => {
		if (account?.address) {
			const data = await getUserInfo(account.address);
			if (data && !data.isActive) {
				toast.warning('Your account was deactivated!', { theme: 'colored' });
				signOut();
			} else {
				const postNum = data?.userPosts?.some?.length || 0;
				const profile = {
					id: account?.address || '',
					name: data?.userInfo?.some?.name || '',
					avatar: data?.userInfo?.some?.avatar.url || avatarUrl,
					postNum: postNum,
					commentNum: '0',
					coverImage: data?.userInfo?.some?.coverImage.url || coverUrl,
					displayName: data?.userInfo?.some?.displayName || '',
					email: data?.userInfo?.some?.email || '',
					bio: data?.userInfo?.some?.bio || '',
					nation: data?.userInfo?.some?.nation || '',
					language: data?.userInfo?.some?.language || '',
					website: data?.userInfo?.some?.website || '',
					socialLinks: data?.userInfo?.some?.socialLinks || '',
					joinedAt: data?.joinedAt || new Date(),
					friends: data?.friends || [],
					receivedRequests: data?.receivedRequests || [],
					sentRequests: data?.sentRequests || []
				};
				setUser(profile);

				setFollowingCommunities(data?.followingCommunity?.some || []);
				setAchievements(data?.achievement?.some || []);
				setTeams(data?.teams?.some || []);
				setVideos(data?.videos?.some || []);
				setAwards(data?.award?.some || []);
				setGamingSetup(data?.games?.some || []);
				setGameSummaries(data?.gameSummary?.some || []);

				return profile;
			}
		} else {
			setUser(null);
		}
	}, [account?.address, getUserInfo, signOut]);

	useEffect(() => {
		async function init() {
			const store = JSON.parse(localStorage?.getItem('sui-dapp-kit:wallet-connection-info') || '{}');
			const isWalletExsits = wallets.find(i => i.name === store?.state.lastConnectedWalletName);
			if (store?.state.lastConnectedAccountAddress && !account?.address && isWalletExsits && !wallet.isConnected) {
				setUser(null);
				return;
			}
			try {
				const profile = await loadUserInfo();

				await initChat(profile?.displayName);
			} catch (e) {
				toast.error(String(e), { theme: 'colored' });
			}
			setIsLoaded(true);
		}

		init();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [account?.address, loadUserInfo, wallets, wallet.isConnected]);

	return (
		<>
			{isLoaded ? (
				<AuthContext.Provider
					value={{
						signOut,
						loadUserInfo,
						initChat,
						profile,
						followingCommunities,
						teams,
						gameSummaries,
						achievements,
						videos,
						awards,
						gamingSetup,
						jid,
						isUsernameVisible,
						isLoggedIn: Boolean(profile),
						changeUsernameModalVisible
					}}
				>
					{children}
				</AuthContext.Provider>
			) : (
				<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
					<CircularProgress size={60} />
				</Box>
			)}
		</>
	);
};
