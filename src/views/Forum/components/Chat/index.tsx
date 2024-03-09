import { useContext, useEffect } from 'react';
import { styled } from '@mui/system';
import { Box, Grid } from '@mui/material';
import { ChatContext } from 'src/contexts';
import { ChatCard } from './ChatCard/ChatCard';
import { GroupChats } from './GroupChats';
import { H1Title } from 'src/components/Typography';
import { GroupInfoCard } from './GroupInfoCard/GroupInfoCard';
import { useUserVCard } from 'src/hooks/useRoomAvatar';

export const ChatOneToMany = () => {
	const { activeJid, setActiveJid, isMobileChat, sideBarOpen, setSideBarOpen } = useContext(ChatContext);

	useEffect(() => {
		setActiveJid('');
	}, [setActiveJid]);

	useUserVCard();

	return (
		<StyledBox>
			<Grid
				container
				sx={{
					alignItems: 'flex-start'
				}}
			>
				{!(isMobileChat && activeJid) && (
					<Grid item lg={3} md={12} sm={12} xs={12} className="chatCardsHeader-wrp">
						<GroupChats />
					</Grid>
				)}
				{activeJid ? (
					<>
						<Grid item xl={sideBarOpen ? 6 : 9} lg={sideBarOpen ? 5.5 : 9} md={12} sm={12} xs={12}>
							{isMobileChat && sideBarOpen ? null : (
								<ChatCard
									sideBarOpen={sideBarOpen}
									onSideBarToggle={() => {
										setSideBarOpen(!sideBarOpen);
									}}
								/>
							)}
						</Grid>
						{sideBarOpen ? (
							<Grid item xl={3} lg={3.5} md={12} sm={12} xs={12}>
								<GroupInfoCard />
							</Grid>
						) : null}
					</>
				) : (
					!isMobileChat && (
						<Grid
							item
							lg={9}
							md={12}
							sm={12}
							xs={12}
							sx={{
								mt: theme => theme.spacing(10),
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center'
							}}
						>
							<H1Title>Select a chat</H1Title>
						</Grid>
					)
				)}
			</Grid>
		</StyledBox>
	);
};

const StyledBox = styled(Box)(({ theme }) => ({
	width: '100%',
	padding: theme.spacing(5, 0, 2),
	[theme.breakpoints.down('lg')]: {
		padding: theme.spacing(3, 0, 2)
	}
}));
