import { Box } from '@mui/material';
import { useContext } from 'react';
import { useSocketEmit } from 'use-socket-io-react';
import { Icon } from 'src/components/Icon';
import { Paragraph3, Label } from 'src/components/Typography';
import { IconButton } from 'src/components/IconButton';
import { AuthContext, INotification, NotificationContext } from 'src/contexts';
import { differenceDate } from 'src/helpers/date.helpers';
import { PrimaryButton, SecondaryButton } from 'src/components/Button';
import { useGilder } from 'src/hooks/useGilder';
import { api } from 'src/api';
import { styled } from '@mui/system';
import { ErrorHandler } from 'src/helpers';

export const NotificationCard = ({ notification }: { notification: INotification }) => {
	const { emit } = useSocketEmit();
	const { loadUserInfo } = useContext(AuthContext);
	const { getNotifications } = useContext(NotificationContext);
	const { acceptFriendRequest, rejectFriendRequest } = useGilder();

	const markOneAsRead = async () => {
		try {
			await api.markAsRead(notification._id);
			await getNotifications();
		} catch (e) {
			ErrorHandler.process(e);
		}
	};

	const handleFriendRequest = async (isAccept: boolean) => {
		try {
			if (isAccept) {
				await acceptFriendRequest(notification.from, notification.to);
				await markOneAsRead();
				emit('friend_request_approval', [{ from: notification.to, to: notification.from, type: 'friend-approval' }]);
			} else {
				await rejectFriendRequest(notification.from, notification.to);
				await markOneAsRead();
				emit('friend_request_rejection', [{ from: notification.to, to: notification.from, type: 'friend-rejection' }]);
			}
			await loadUserInfo();
		} catch (err) {
			ErrorHandler.process(err);
		}
	};

	const Title = styled(Label)(() => ({
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis'
	}));

	const DateText = styled(Paragraph3)(({ theme }) => ({
		whiteSpace: 'nowrap',
		color: theme.palette.text.secondary
	}));

	const ContentText = styled(Paragraph3)(({ theme }) => ({
		color: theme.palette.text.secondary
	}));

	const ContentTextUsername = styled('span')(({ theme }) => ({
		fontSize: 'inherit',
		color: theme.palette.text.primary
	}));

	const HeaderBox = styled(Box)(({ theme }) => ({
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		gap: theme.spacing(1),
		gridArea: 'header'
	}));

	const ContentBox = styled(Box)(({ theme }) => ({
		gridArea: 'content',
		display: 'flex',
		flexDirection: 'column',
		gap: theme.spacing(1)
	}));

	const ButtonBox = styled(Box)(({ theme }) => ({
		display: 'flex',
		gap: theme.spacing(1)
	}));

	return (
		<Box
			sx={theme => ({
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'flex-start',
				background: theme.palette.dark[700],
				borderRadius: 1,
				padding: 1.5,
				gap: 1
			})}
		>
			<Box
				sx={theme => ({
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					padding: 2,
					background: theme.palette.dark[500],
					border: `${theme.spacing(0.125)} solid ${theme.palette.border.default}`,
					borderRadius: 0.5
				})}
			>
				<Icon fontSize="small" icon="friendRequest" />
			</Box>
			<Box
				sx={{
					width: '100%',
					display: 'grid',
					alignItems: 'center',
					gridTemplateColumns: 'minmax(100px, 1fr) 24px',
					gridTemplateAreas: `
						'header action'
						'content content'
					`,
					gap: theme => theme.spacing(0.5, 1)
				}}
			>
				{notification.type === 'friend-request' && (
					<>
						<HeaderBox>
							<Title>Received friend request</Title>
							<DateText>{differenceDate(new Date(notification.createdAt).getTime())}</DateText>
						</HeaderBox>
						<ContentBox>
							<ContentText>
								You received a friend invitation from
								<ContentTextUsername>{` @${notification.from}`}</ContentTextUsername>
							</ContentText>
							<ButtonBox>
								<SecondaryButton size="small" onClick={() => handleFriendRequest(false)}>
									Decline
								</SecondaryButton>
								<PrimaryButton size="small" onClick={() => handleFriendRequest(true)}>
									Accept
								</PrimaryButton>
							</ButtonBox>
						</ContentBox>
					</>
				)}
				{notification.type === 'friend-rejection' && (
					<>
						<HeaderBox>
							<Title>Friend request was declined</Title>
							<DateText>{differenceDate(new Date(notification.createdAt).getTime())}</DateText>
						</HeaderBox>
						<ContentText>
							A friend request was declined from
							<ContentTextUsername>{` @${notification.from}`}</ContentTextUsername>
						</ContentText>
					</>
				)}
				{notification.type === 'friend-approval' && (
					<>
						<HeaderBox>
							<Title>Friend request was accepted</Title>
							<DateText>{differenceDate(new Date(notification.createdAt).getTime())}</DateText>
						</HeaderBox>
						<ContentText>
							A friend request was accepted from
							<ContentTextUsername>{` @${notification.from}`}</ContentTextUsername>
						</ContentText>
					</>
				)}
				{notification.type === 'friend-deletion' && (
					<>
						<HeaderBox>
							<Title>You were removed from friend list</Title>
							<DateText>{differenceDate(new Date(notification.createdAt).getTime())}</DateText>
						</HeaderBox>
						<ContentText>
							You were removed from <ContentTextUsername>{` @${notification.from} `}</ContentTextUsername> friend list
						</ContentText>
					</>
				)}
				<Box sx={{ gridArea: 'action' }}>
					<IconButton
						icon="doneAll"
						size="large"
						iconSx={{ color: theme => theme.palette.success.main }}
						onClick={markOneAsRead}
					/>
				</Box>
			</Box>
		</Box>
	);
};
