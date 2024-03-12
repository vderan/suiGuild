import { Box, ButtonBase, Collapse, Divider, Link, Skeleton, Stack, StackProps } from '@mui/material';
import { ButtonMediumText, ButtonSmallText, H3Title } from 'src/components/Typography';
import { sortForumsByKeyword } from 'src/helpers/sort.helpers';
import { useForums } from 'src/hooks';
import { useContext, useMemo, useState } from 'react';
import { ListSkeleton } from 'src/components/Skeleton';
import { ErrorMessage } from 'src/components/ErrorMessage';
import { NotFound } from 'src/components/NotFound';
import { AuthContext } from 'src/contexts';
import { Icon } from 'src/components/Icon';
import { LargeAvatar } from 'src/components/Avatar';
import { ipfsUrl } from 'src/helpers/ipfs.helpers';
import { NavLink } from 'react-router-dom';
import { CountBadge } from 'src/components/Badge';
import React from 'react';
import { LinkSecondaryButton, QuaternaryButton } from 'src/components/Button';
import { LoginModal } from '../Header';

export const SidebarCommunities = ({ isFullSize = true }: { isFullSize?: boolean }) => {
	const { followingCommunities, isLoggedIn } = useContext(AuthContext);
	const [isShowExpandableSection, setIsShowExpandableSection] = useState(true);
	const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

	const handleChange = () => {
		setIsShowExpandableSection(prev => !prev);
	};

	const { data: forums, isLoading, error: isError } = useForums();

	const topForums = useMemo(() => {
		const _forums = forums?.filter(forum =>
			isLoggedIn ? followingCommunities.includes(forum.idx) : !followingCommunities.includes(forum.idx)
		);
		return sortForumsByKeyword(_forums || [], 'posts').slice(0, 4);
	}, [followingCommunities, forums, isLoggedIn]);

	return (
		<>
			{!isFullSize && <Divider />}
			<Stack gap={2.5}>
				{isFullSize && (
					<Stack
						component={ButtonBase}
						sx={{
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'center',
							gap: 1,
							width: '100%'
						}}
						onClick={handleChange}
					>
						<H3Title noWrap>{isLoggedIn ? 'My communities' : 'Trendy communities'}</H3Title>
						<Icon
							icon={isShowExpandableSection ? 'chevronUp' : 'chevronDown'}
							sx={{ color: theme => theme.palette.border.highlight, opacity: 0.5 }}
							fontSize="large"
						/>
					</Stack>
				)}
				<Collapse in={!isFullSize || isShowExpandableSection} timeout={0}>
					<Box display="flex" flexDirection="column" gap={isFullSize ? 2.5 : 1}>
						{isError && isFullSize ? (
							<NoDataOrErrorBox>
								<ErrorMessage isSmall description="There was an error while loading" />
							</NoDataOrErrorBox>
						) : isLoading ? (
							<ListSkeleton numberOfItems={4} sx={{ gap: isFullSize ? 2.5 : 1 }}>
								<Stack direction="row" alignItems="center" justifyContent="space-between">
									<Stack direction="row" gap={1} alignItems="center" width="100%">
										<Skeleton variant="circular" height={32} width={32} />
										{isFullSize && <Skeleton variant="text" height={21} width="50%" />}
									</Stack>
									{isFullSize && <Skeleton variant="rounded" height={20} width={70} />}
								</Stack>
							</ListSkeleton>
						) : topForums.length ? (
							<>
								{topForums.map((forum, index) => (
									<React.Fragment key={forum.idx}>
										<Stack key={forum.idx} direction="row" alignItems="center" gap={2} justifyContent="space-between">
											<Link
												component={NavLink}
												to={`/forum/communityindividual/${forum.idx}`}
												sx={{
													display: 'flex',
													alignItems: 'center',
													gap: 1,
													overflow: 'hidden',
													maxWidth: '100%',
													width: 'max-content'
												}}
											>
												<LargeAvatar image={ipfsUrl(forum.avatar.some.url)} />
												{isFullSize && (
													<ButtonMediumText title={forum.title} noWrap>
														{forum.title}
													</ButtonMediumText>
												)}
											</Link>
											{isFullSize &&
												(isLoggedIn ? (
													<CountBadge count={`${forum.numPost} new`} />
												) : (
													<QuaternaryButton sx={{ whiteSpace: 'nowrap' }} onClick={() => setIsLoginModalOpen(true)}>
														+ JOIN
													</QuaternaryButton>
												))}
										</Stack>
										{index < topForums.length - 1 && isFullSize && <Divider />}
									</React.Fragment>
								))}
								{isFullSize && (
									<Link
										component={NavLink}
										to="/forum#communities"
										sx={{
											width: 'max-content'
										}}
									>
										<ButtonSmallText fontWeight={700} sx={{ opacity: 0.3 }}>
											See more
										</ButtonSmallText>
									</Link>
								)}
							</>
						) : (
							isFullSize && (
								<NoDataOrErrorBox gap={2}>
									<>
										<NotFound
											isSmall
											title="You're not in the communion"
											description="Join a community that is within your interests"
										/>
										<LinkSecondaryButton to="/forum#communities" startIcon="add">
											Add Communication
										</LinkSecondaryButton>
									</>
								</NoDataOrErrorBox>
							)
						)}
					</Box>
				</Collapse>
				<LoginModal open={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
			</Stack>
		</>
	);
};

const NoDataOrErrorBox = ({ children, ...props }: StackProps) => {
	return (
		<Stack
			{...props}
			sx={{
				padding: 3,
				border: theme => `${theme.spacing(0.125)} dashed ${theme.palette.border.subtle}`,
				borderRadius: 1,
				...props.sx
			}}
		>
			{children}
		</Stack>
	);
};
