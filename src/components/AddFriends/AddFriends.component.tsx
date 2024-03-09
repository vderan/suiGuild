import { Box } from '@mui/material';
import { useState } from 'react';
import { SecondaryButton } from 'src/components/Button';
import { H1Title, H3Title, Paragraph1, Paragraph2 } from 'src/components/Typography';
import friendsImg from 'src/assets/images/friends.png';
import { AddFriendsModal } from './AddFriendsModal.component';
import { useDevice } from 'src/hooks/useDevice';

export const AddFriends = () => {
	const [isOpen, setIsOpen] = useState(false);
	const { iMid } = useDevice();

	const Title = iMid ? H1Title : H3Title;
	const Description = iMid ? Paragraph2 : Paragraph1;
	return (
		<>
			<Box
				sx={theme => ({
					background: theme.palette.background.default,
					borderRadius: 1,
					position: 'relative',
					boxShadow: `0 30px 60px -20px ${theme.palette.shadow.secondary}`,
					overflow: 'hidden',
					'&::after': {
						content: '""',
						position: 'absolute',
						inset: 0,
						padding: theme.spacing(0.125),
						borderRadius: theme.spacing(1),
						background: theme.palette.gradient2.main,
						WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
						WebkitMaskComposite: 'xor',
						maskComposite: 'exclude'
					}
				})}
			>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						zIndex: 1,
						gap: 2,
						position: 'relative',
						alignItems: 'flex-start',
						padding: theme => ({ xs: theme.spacing(3, 3, 7.25), lg: theme.spacing(2.75, 2.5) })
					}}
				>
					<Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 0.5, lg: 1 } }}>
						<Title sx={{ maxWidth: { sm: 'initial', lg: '128px' } }}>Add friends</Title>
						<Description sx={{ textAlign: 'left', maxWidth: { sm: 'initial', lg: '122px' } }}>
							Invite friends and create chat groups
						</Description>
					</Box>
					<SecondaryButton size={iMid ? 'medium' : 'small'} onClick={() => setIsOpen(true)}>
						Add Friends
					</SecondaryButton>
				</Box>
				<Box
					component="img"
					src={friendsImg}
					alt="friends"
					sx={theme => ({
						position: 'absolute',
						bottom: 0,
						right: 0,
						width: '100%',
						maxWidth: { lg: '228px', xs: '239px' },
						[theme.breakpoints.down('lg')]: {
							right: theme.spacing(1.25),
							bottom: theme.spacing(-7.875)
						}
					})}
				/>
			</Box>
			<AddFriendsModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
		</>
	);
};
