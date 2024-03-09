import { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Stack, Divider, Link, Skeleton } from '@mui/material';
import { useSocketEmit } from 'use-socket-io-react';
import { H1Title, Paragraph1, Paragraph2, PreTitle } from 'src/components/Typography';
import { MediumAvatar } from 'src/components/Avatar';
import { readableDate } from 'src/helpers/date.helpers';
import { PrimaryButton, SecondaryButton } from 'src/components/Button';
import { Achievements } from './components/Achievements';
import { Banner } from './components/Banner';
import { GameSummary } from './components/GameSummary';
import { Teams } from './components/Teams';
import { Videos } from './components/Videos';
import { GamingSetup } from './components/GamingSetup';
import { Connect } from './components/Connect';
import { AuthContext, UserInfo } from 'src/contexts';
import { Awards } from './components/Awards';
import { countries, langs } from 'src/constants/country.constants';
import { CustomTabs, ITabs } from 'src/components/Tabs';
import { useDevice } from 'src/hooks/useDevice';
import { ProfilePosts } from './components/ProfilePosts';
import { ipfsUrl } from 'src/helpers/ipfs.helpers';
import { avatarUrl } from 'src/constants/images.constants';
import { useProfile } from 'src/hooks/useProfile';
import ShareBox from 'src/components/ShareBox';
import { profileTabsHashes } from 'src/constants/tab.constants';
import { Icons } from 'src/components/icons';
import { useCustomSWR } from 'src/hooks/useCustomSWR';
import { useGilder } from 'src/hooks/useGilder';
import { toast } from 'react-toastify';
import { Friends } from './components/Friends';
import { Requests } from './components/Requests';
import { ListSkeleton } from 'src/components/Skeleton';
import { ErrorMessage } from 'src/components/ErrorMessage';
import { ErrorHandler } from 'src/helpers';

const flagUrl = 'https://flagcdn.com/w40';

export const Profile = () => {
	const { profile } = useContext(AuthContext);
	const navigate = useNavigate();
	const { id } = useParams();
	const { iMid } = useDevice();
	const { getUserInfo } = useProfile();
	const { data: user, isLoading, error: isError } = useCustomSWR('getUserInfo' + id, () => getUserInfo(id));
	const nation = countries.find(nation => nation.code === user?.userInfo.some?.nation);
	const language = langs.find(lang => lang.code === user?.userInfo.some?.language);

	const isOwner = profile?.id === id;

	const userSocialsLinks = user?.userInfo?.some?.socialLinks ? JSON.parse(user.userInfo.some.socialLinks) : {};

	const userLinks = [
		{
			title: 'Copy URL',
			href: `${window.location.origin}/profile/${profile?.id}`,
			icon: 'link' as Icons
		},
		...(userSocialsLinks.twitter
			? [
					{
						title: 'X',
						href: userSocialsLinks.twitter,
						icon: 'twitter' as Icons
					}
			  ]
			: []),
		...(userSocialsLinks.youtube
			? [
					{
						title: 'Youtube',
						href: userSocialsLinks.youtube,
						icon: 'youtube' as Icons
					}
			  ]
			: []),
		...(userSocialsLinks.twitch
			? [
					{
						title: 'Twitch',
						href: userSocialsLinks.twitch,
						icon: 'twitch' as Icons
					}
			  ]
			: []),
		...(userSocialsLinks.tiktok
			? [
					{
						title: 'TikTok',
						href: userSocialsLinks.tiktok,
						icon: 'tiktok' as Icons
					}
			  ]
			: []),
		...(userSocialsLinks.instagram
			? [
					{
						title: 'Instagram',
						href: userSocialsLinks.instagram,
						icon: 'instagram' as Icons
					}
			  ]
			: []),
		...(userSocialsLinks.facebook
			? [
					{
						title: 'Facebook',
						href: userSocialsLinks.facebook,
						icon: 'facebook' as Icons
					}
			  ]
			: [])
	];

	const tabs: ITabs[] = [
		{
			hash: profileTabsHashes.summary,
			label: 'Summary',
			children: (
				<Stack gap={{ xs: 4, lg: 7.75 }}>
					<AboutMe user={user} isLoading={isLoading} />
					<GameSummary userId={id} />
					<Achievements userId={id} />
					<Teams userId={id} />
					<Divider />
					<Connect userId={id} />
				</Stack>
			)
		},
		{
			hash: profileTabsHashes.friends,
			label: 'Friends',
			children: (
				<Stack gap={{ xs: 4, lg: 7.75 }}>
					<Friends userId={id} />
					<Divider />
					<Connect userId={id} />
				</Stack>
			)
		},
		...(isOwner
			? [
					{
						hash: profileTabsHashes.requests,
						label: 'Requests',
						children: (
							<Stack gap={{ xs: 4, lg: 7.75 }}>
								<Requests />
								<Divider />
								<Connect userId={id} />
							</Stack>
						)
					}
			  ]
			: []),
		{
			hash: profileTabsHashes.videos,
			label: 'Videos',
			children: (
				<Stack gap={{ xs: 4, lg: 7.75 }}>
					<Videos userId={id} />
					<Divider />
					<Connect userId={id} />
				</Stack>
			)
		},
		{
			hash: profileTabsHashes.gaming,
			label: 'Gaming Setup',
			children: (
				<Stack gap={{ xs: 4, lg: 7.75 }}>
					<GamingSetup userId={id} />
					<Divider />
					<Connect userId={id} />
				</Stack>
			)
		},
		{
			hash: profileTabsHashes.awards,
			label: 'Awards',
			children: (
				<Stack gap={{ xs: 4, lg: 7.75 }}>
					<Awards userId={id} />
					<Divider />
					<Connect userId={id} />
				</Stack>
			)
		},
		{
			hash: profileTabsHashes.posts,
			label: 'Posts & Comments',
			children: (
				<Stack gap={{ xs: 4, lg: 7.75 }}>
					<ProfilePosts userId={id} />
					<Divider />
					<Connect userId={id} />
				</Stack>
			)
		}
	];

	return (
		<>
			<Box position="relative">
				<Banner isLoading={isLoading} cover={user?.userInfo.some?.coverImage.url} />

				{iMid && user && (
					<Stack
						direction="row"
						width="100%"
						justifyContent="flex-end"
						alignItems="center"
						spacing={1}
						sx={{ position: 'absolute', bottom: theme => theme.spacing(4.5), right: 0 }}
					>
						<FriendsButtons />
						{isOwner && <SecondaryButton startIcon="edit" onClick={() => navigate(`/setting/${id}/eprofile`)} />}
						<ShareBox links={userLinks} isModal secondary size="medium" />
					</Stack>
				)}
			</Box>
			<Stack spacing={{ xs: 2, lg: 8 }} sx={{ position: 'relative', mx: 'auto', maxWidth: '1202px' }}>
				{isError ? (
					<ErrorMessage description="There was an error while loading" />
				) : (
					<Stack
						direction={iMid ? 'column' : 'row'}
						alignItems="flex-start"
						justifyContent={iMid ? 'flex-start' : 'space-between'}
						spacing={iMid ? 3 : 4}
					>
						<Stack
							direction={{ xs: 'column', lg: 'row' }}
							gap={{ xs: 2, lg: 4.5 }}
							overflow="hidden"
							width={{ xs: '100%', lg: 'initial' }}
						>
							<Box
								sx={{
									width: theme => ({ xs: theme.spacing(15), lg: theme.spacing(23.25) }),
									minWidth: theme => ({ xs: theme.spacing(15), lg: theme.spacing(23.25) }),
									height: theme => ({ xs: theme.spacing(6), lg: theme.spacing(12.5) })
								}}
							>
								<Box
									sx={{
										width: theme => ({ xs: theme.spacing(15), lg: theme.spacing(23.25) }),
										height: theme => ({ xs: theme.spacing(15), lg: theme.spacing(23.25) }),
										position: 'absolute',
										top: theme => ({ xs: theme.spacing(-9), lg: theme.spacing(-10.625) })
									}}
								>
									{isLoading ? (
										<Skeleton
											variant="rectangular"
											sx={{
												width: '100%',
												height: '100%',
												borderRadius: 1
											}}
										/>
									) : (
										<Box
											component="img"
											src={ipfsUrl(user?.userInfo.some?.avatar.url ?? avatarUrl)}
											alt="Profile"
											sx={{
												width: '100%',
												height: '100%',
												objectFit: 'cover',
												borderRadius: 1
											}}
										/>
									)}
								</Box>
							</Box>
							<Stack spacing={1} overflow="hidden" paddingTop={{ xs: 0, lg: 3.25 }}>
								<Box
									display="flex"
									gap={1}
									flexDirection={{ xs: 'column', sm: 'row' }}
									alignItems={{ xs: 'start', sm: 'center' }}
								>
									{isLoading ? (
										<Skeleton variant="text" height={40} width={200} />
									) : (
										<H1Title width={{ xs: '100%', md: 'initial' }} noWrap title={user?.userInfo.some?.displayName}>
											{user?.userInfo.some?.displayName}
										</H1Title>
									)}
									{!iMid && user && <FriendsButtons />}
								</Box>
							</Stack>
						</Stack>
						<Stack
							direction="column"
							spacing={2}
							paddingTop={{ xs: 0, lg: 4.5 }}
							overflow={nation?.label || language?.name ? 'hidden' : 'initial'}
							width={{ xs: '100%', lg: 'initial' }}
						>
							{isLoading ? (
								<ListSkeleton numberOfItems={2} direction="row" gap={5}>
									<Stack direction="row" alignItems="center" spacing={1.5} overflow="hidden">
										<Skeleton variant="circular" height={24} width={24} />
										<Skeleton variant="text" height={20} width={100} />
									</Stack>
								</ListSkeleton>
							) : (
								(nation?.label || language?.name) && (
									<Stack
										direction="row"
										alignItems="center"
										justifyContent={{ xs: 'flex-start', lg: 'flex-end' }}
										gap={5}
										overflow="hidden"
									>
										{nation?.label && (
											<Stack direction="row" alignItems="center" spacing={1.5} overflow="hidden">
												<MediumAvatar image={`${flagUrl}/${nation?.code.toLowerCase()}.png`} />
												<Paragraph1 noWrap>{nation?.label}</Paragraph1>
											</Stack>
										)}
										{language?.name && (
											<Stack direction="row" alignItems="center" spacing={1.5} overflow="hidden">
												<MediumAvatar image={`${flagUrl}/${language?.countryCode.toLowerCase()}.png`} />
												<Paragraph1 noWrap>{language?.name}</Paragraph1>
											</Stack>
										)}
									</Stack>
								)
							)}
							{isLoading ? (
								<Skeleton variant="text" height={20} width={200} sx={{ marginLeft: { xs: 0, lg: 'auto!important' } }} />
							) : (
								(user?.joinedAt || user?.userInfo?.some?.website) && (
									<Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', lg: 'flex-end' }, gap: 1.5 }}>
										<Paragraph2 whiteSpace="nowrap">
											Joined{' '}
											{readableDate(new Date(Number(user?.joinedAt)), {
												year: 'numeric',
												month: 'long',
												day: 'numeric'
											})}
										</Paragraph2>
										{user?.userInfo?.some?.website && (
											<Link
												noWrap
												href={user?.userInfo?.some?.website}
												target="_blank"
												sx={{
													textDecoration: 'none',
													lineHeight: 'normal',
													maxWidth: theme => ({ xs: 'none', lg: theme.spacing(25) }),
													width: 'fit-content',
													color: theme => theme.palette.primary[900]
												}}
											>
												<Paragraph2 color="inherit">{user?.userInfo?.some?.website}</Paragraph2>
											</Link>
										)}
									</Box>
								)
							)}
						</Stack>
					</Stack>
				)}
				<Stack direction="row" alignItems="center">
					<CustomTabs
						tabs={tabs}
						isTertiary
						tabsChildren={
							<>
								{!iMid && user && (
									<Stack direction="row" alignItems="center" gap={1}>
										{isOwner && (
											<SecondaryButton startIcon="edit" onClick={() => navigate(`/setting/${id}/eprofile`)}>
												Edit profile
											</SecondaryButton>
										)}
										<ShareBox links={userLinks} isModal secondary label="Share" size="medium" />
									</Stack>
								)}
							</>
						}
					/>
				</Stack>
			</Stack>
		</>
	);
};

const FriendsButtons = () => {
	const { id } = useParams();
	const { getUserInfo } = useProfile();

	const { profile, loadUserInfo } = useContext(AuthContext);
	const { emit } = useSocketEmit();
	const { sendFriendRequest, acceptFriendRequest, removeFriend } = useGilder();
	const { data: user } = useCustomSWR('getUserInfo' + id, () => getUserInfo(id));
	const [isSubmitting, setIsSubmitting] = useState(false);

	const isFriend = profile?.friends?.some(friend => friend === user?.userInfo?.some?.displayName);
	const isRequestSent = profile?.sentRequests?.some(friend => friend === user?.userInfo?.some?.displayName);
	const isRequestReceived = profile?.receivedRequests?.some(friend => friend === user?.userInfo?.some?.displayName);

	const handleAcceptOrSendFriendRequest = async () => {
		const friendname = user?.userInfo?.some?.displayName;
		const username = profile?.displayName;

		if (!username || !friendname) {
			toast.warning("Username or friendname doesn't exist", { theme: 'colored' });
			return;
		} else if (!user.isActive) {
			toast.warning('This account was deactivated!', { theme: 'colored' });
			return;
		}
		setIsSubmitting(true);
		try {
			if (isRequestReceived) {
				await acceptFriendRequest(friendname, username);
				emit('friend_request_approval', [{ from: username, to: friendname, type: 'friend-approval' }]);
			} else {
				await sendFriendRequest(friendname, username);
				emit('friend_request_sent', [{ from: username, to: friendname, type: 'friend-request' }]);
			}
			await loadUserInfo();
		} catch (err) {
			ErrorHandler.process(err);
		}
		setIsSubmitting(false);
	};

	const deleteFriend = async () => {
		const friendname = user?.userInfo?.some?.displayName || '';
		const username = profile?.displayName || '';

		if (!username || !friendname) {
			toast.warning("Username or friendname doesn't exist", { theme: 'colored' });
			return;
		}
		setIsSubmitting(true);
		try {
			await removeFriend(friendname, username);
			emit('friend_request_deletion', [{ from: username, to: friendname, type: 'friend-deletion' }]);
			await loadUserInfo();
		} catch (err) {
			ErrorHandler.process(err);
		}
		setIsSubmitting(false);
	};

	return (
		<>
			{isFriend && (
				<PrimaryButton
					size="small"
					onClick={deleteFriend}
					loading={isSubmitting}
					sx={{ minWidth: 'auto', height: { xs: '100%', lg: 'initial' } }}
				>
					Delete friend
				</PrimaryButton>
			)}
			{profile?.id !== id && !isFriend && (
				<PrimaryButton
					size="small"
					onClick={handleAcceptOrSendFriendRequest}
					disabled={isRequestSent}
					loading={isSubmitting}
					sx={{ minWidth: 'auto', height: { xs: '100%', lg: 'initial' } }}
				>
					{isRequestSent ? 'Pending' : isRequestReceived ? 'Accept request' : 'Add friend'}
				</PrimaryButton>
			)}
		</>
	);
};

const AboutMe = ({ user, isLoading }: { user?: UserInfo | null; isLoading?: boolean }) => {
	return isLoading ? (
		<Stack gap={2}>
			<Skeleton variant="text" width={100} height={20} />
			<Stack>
				<Skeleton variant="text" width="100%" height={20} />
				<Skeleton variant="text" width="100%" height={20} />
			</Stack>
		</Stack>
	) : (
		user?.userInfo.some?.bio && (
			<Stack gap={2}>
				<PreTitle>ABOUT ME</PreTitle>
				<Paragraph1>{user.userInfo.some?.bio}</Paragraph1>
			</Stack>
		)
	);
};
