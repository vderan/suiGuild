import { Box, ButtonBase, Grid, Skeleton, Stack } from '@mui/material';
import { PropsWithChildren, useContext } from 'react';
import { Icon } from 'src/components/Icon';
import { H2Title, H3Title, Paragraph2 } from 'src/components/Typography';
import { AuthContext } from 'src/contexts';
import { useCustomSWR } from 'src/hooks/useCustomSWR';
import { useProfile } from 'src/hooks/useProfile';
import { ISocial, socials } from 'src/constants/socials.constants';
import { NotFound } from 'src/components/NotFound';
import { useNavigate } from 'react-router-dom';
import { ErrorMessage } from 'src/components/ErrorMessage';
import { ListSkeleton } from 'src/components/Skeleton';

type Link = ISocial & { isShown: boolean; baseSocialUrl: string; tag: string };

export const Connect = ({ userId }: { userId?: string }) => {
	const { getUserInfo } = useProfile();
	const { profile } = useContext(AuthContext);
	const { data: user, isLoading, error: isError } = useCustomSWR('getUserInfo' + userId, () => getUserInfo(userId));
	const isOwner = profile?.id === userId;

	const userSocials = (() => {
		if (!user?.userInfo?.some?.socialLinks) return {};

		return JSON.parse(user.userInfo?.some.socialLinks);
	})();

	const userSocialsLinks: Link[] = socials.map(social => {
		const url = userSocials[social.id];
		const tagName = url?.split('/').pop();

		return {
			...social,
			tag: tagName || 'gamerxyz',
			isShown: isOwner || Boolean(url),
			url,
			baseSocialUrl: social.url
		};
	});

	return (
		<Stack gap={3}>
			<H2Title>Let's connect</H2Title>

			{isError ? (
				<ErrorMessage description="There was an error while loading" />
			) : isLoading ? (
				<Grid container spacing={{ lg: 15.5, xs: 3 }}>
					<Grid item xs={12} sm={12} md={12} lg={6}>
						<ListSkeleton numberOfItems={2} gap={2} sx={{ flexDirection: 'row' }}>
							<Skeleton variant="rounded" height={196} width="50%" />
						</ListSkeleton>
					</Grid>
					<Grid item xs={12} sm={12} md={12} lg={6}>
						<ListSkeleton numberOfItems={6} gap={1} sx={{ flexDirection: 'row', flexWrap: 'wrap' }}>
							<Skeleton variant="rounded" height={56} width={140} />
						</ListSkeleton>
					</Grid>
				</Grid>
			) : userSocialsLinks.every(social => social.isShown) ? (
				<Grid container spacing={{ lg: 15.5, xs: 3 }}>
					<Grid item xs={12} sm={12} md={12} lg={6}>
						<Stack
							sx={{
								height: '100%',
								display: 'grid',
								gridTemplateColumns: {
									xs: 'minmax(200px,1fr)',
									sm: 'minmax(200px,1fr) minmax(200px,1fr)'
								},
								gap: 2
							}}
						>
							{userSocialsLinks.map(social => {
								return social.isShown
									? ['steam', 'discord'].includes(social.id) && (
											<ConnectContainer key={social.id} url={social?.baseSocialUrl} isOwner={isOwner}>
												<Icon
													icon={social.icon}
													sx={{ width: theme => theme.spacing(5), height: theme => theme.spacing(5) }}
												/>

												<Box
													sx={{
														display: 'flex',
														gap: 0.25,
														flexDirection: 'column',
														alignItems: 'flex-start',
														width: '100%'
													}}
												>
													<H3Title>{social.label}</H3Title>
													<Paragraph2 color="text.secondary" noWrap width="100%">
														{social?.url}
													</Paragraph2>
												</Box>
											</ConnectContainer>
									  )
									: null;
							})}
						</Stack>
					</Grid>
					<Grid item xs={12} sm={12} md={12} lg={6}>
						<Stack direction="row" gap={1} flexWrap="wrap">
							{userSocialsLinks.map(social => {
								return social.isShown
									? !['steam', 'discord'].includes(social.id) && (
											<SocialsContainer key={social.id} url={social?.url} isOwner={isOwner}>
												<Icon fontSize="large" icon={social.icon} />
												<Paragraph2 color="text.secondary">{social.tag}</Paragraph2>
											</SocialsContainer>
									  )
									: null;
							})}
						</Stack>
					</Grid>
				</Grid>
			) : (
				<NotFound description="This user doesn't have socials" />
			)}
		</Stack>
	);
};

const SocialsContainer = ({ children, url, isOwner }: PropsWithChildren<{ url?: string; isOwner: boolean }>) => {
	const navigate = useNavigate();
	const { profile } = useContext(AuthContext);
	const handleUrl = () => {
		if (url) {
			window.open(url, '_blank');
		} else if (isOwner) {
			navigate(`/setting/${profile?.id}/connection`);
		}
	};

	return (
		<ButtonBase
			sx={{
				width: 'fit-content',
				borderRadius: 1,
				display: 'flex',
				alignItems: 'center',
				p: 2,
				gap: 1,
				backgroundColor: theme => theme.palette.dark[700]
			}}
			onClick={handleUrl}
		>
			{children}
		</ButtonBase>
	);
};

const ConnectContainer = ({ children, url, isOwner }: PropsWithChildren<{ url?: string; isOwner: boolean }>) => {
	const navigate = useNavigate();
	const { profile } = useContext(AuthContext);
	const handleUrl = () => {
		if (isOwner) {
			navigate(`/setting/${profile?.id}/connection`);
		} else if (url) {
			window.open(url, '_blank');
		}
	};

	return (
		<ButtonBase
			sx={{
				flexDirection: 'column',
				alignItems: 'flex-start',
				flex: 1,
				borderRadius: 1,

				padding: 3,
				gap: 7.5,
				backgroundColor: theme => theme.palette.dark[700]
			}}
			onClick={handleUrl}
		>
			{children}
		</ButtonBase>
	);
};
