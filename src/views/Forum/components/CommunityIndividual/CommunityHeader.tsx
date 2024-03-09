import { Box, ButtonBase, Skeleton, Stack, styled } from '@mui/material';
import pluralize from 'pluralize';
import { useContext, useState } from 'react';
import { CustomAvatar } from 'src/components/Avatar';
import { Icon } from 'src/components/Icon';
import { IconButton } from 'src/components/IconButton';
import { H2Title, H4Title } from 'src/components/Typography';
import { AuthContext, IForum } from 'src/contexts';
import { ipfsUrl } from 'src/helpers/ipfs.helpers';
import { useDevice } from 'src/hooks/useDevice';
import { CommunityActions } from './CommunityActions';
import { MembersModal } from './MembersModal';
import { EditCommunityModal } from './EditCommunityModal';

const Wrapper = styled(Box)(({ theme }) => ({
	display: 'flex',
	gap: theme.spacing(3),
	marginTop: theme.spacing(-5.25),
	overflow: 'hidden'
}));

export const CommunityHeader = ({ forum, isLoading = false }: { forum?: IForum; isLoading?: boolean }) => {
	const { profile } = useContext(AuthContext);
	const isOwner = `0x${forum?.creatorInfo}` === profile?.id;
	const { iMid, iSm } = useDevice();
	const [isMembersModalShown, setIsMembersModalShown] = useState(false);
	const [isEditCommunityModalShown, setIsEditCommunityModalShown] = useState(false);

	return isLoading ? (
		<SkeletonHeader />
	) : forum ? (
		<Wrapper>
			{forum?.avatar && (
				<CustomAvatar
					image={ipfsUrl(forum.avatar.some.url)}
					sx={{
						width: theme => theme.spacing(11),
						height: theme => theme.spacing(11),
						boxShadow: '0 0 3px #000000'
					}}
				/>
			)}
			<Box display="flex" flexDirection="column" gap={2.5} zIndex={100} overflow="hidden">
				<Box display="flex" gap={3} alignItems="flex-start">
					<Box display="flex" gap={1} alignItems="center" overflow="hidden">
						<H2Title noWrap sx={{ textShadow: '0 0 2px #000000' }}>
							{forum?.title}
						</H2Title>
						{isOwner && <IconButton size="small" icon="edit" onClick={() => setIsEditCommunityModalShown(true)} />}
					</Box>
					{!iMid && <CommunityActions forum={forum} />}
				</Box>
				<ButtonBase
					disableRipple
					sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'flex-start' }}
					onClick={() => setIsMembersModalShown(true)}
				>
					<Icon icon="people" />
					<H4Title>
						{forum.followers.length} {!iSm && pluralize('member', forum.followers.length)}
					</H4Title>
				</ButtonBase>
			</Box>

			<MembersModal forum={forum} isOpen={isMembersModalShown} onClose={() => setIsMembersModalShown(false)} />
			<EditCommunityModal
				forum={forum}
				isOpen={isEditCommunityModalShown}
				onClose={() => setIsEditCommunityModalShown(false)}
			/>
		</Wrapper>
	) : (
		<></>
	);
};

const SkeletonHeader = () => {
	return (
		<Wrapper alignItems="center">
			<Skeleton variant="circular" width={88} height={88} />
			<Stack gap={2}>
				<Skeleton variant="text" height={30} width={200} />
				<Skeleton variant="text" height={20} width={100} />
			</Stack>
		</Wrapper>
	);
};
