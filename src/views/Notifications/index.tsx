import { useContext } from 'react';
import { ButtonBase, Stack } from '@mui/material';
import { NotificationCard } from './components/NotificationCard';
import { H2Title } from 'src/components/Typography';
import { IconButton } from 'src/components/IconButton';
import { AuthContext, NotificationContext } from 'src/contexts';
import { NotFound } from 'src/components/NotFound';
import { markAllAsRead } from 'src/api/notification';
import { useNavigate } from 'react-router-dom';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useErrorHandler, useSnackbar } from 'src/hooks';

export const Notifications = () => {
	const navigate = useNavigate();
	const account = useCurrentAccount();
	const { profile } = useContext(AuthContext);
	const { notifications, getNotifications } = useContext(NotificationContext);
	const { warningSnackbar } = useSnackbar();
	const { errorProcess } = useErrorHandler();

	const markAllRead = async () => {
		if (!profile?.displayName) {
			warningSnackbar('You should have your own display name!');
			return;
		}
		try {
			await markAllAsRead(profile.displayName);
			await getNotifications();
		} catch (e) {
			errorProcess(e);
		}
	};

	const isNofificationsExists = Boolean(notifications.length);

	return (
		<Stack sx={{ pt: { xs: 2.5, lg: 5 }, maxWidth: '794px', mx: 'auto', gap: 2.5 }}>
			<Stack
				sx={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'align-items'
				}}
			>
				<H2Title> Notifications </H2Title>
				<Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 1 }}>
					{isNofificationsExists && (
						<ButtonBase
							onClick={markAllRead}
							sx={{
								fontSize: 12,
								fontFamily: 'Exo',
								color: theme => theme.palette.text.primary,
								'&:hover': {
									color: theme => theme.palette.text.secondary
								}
							}}
						>
							Mark all as read
						</ButtonBase>
					)}
					<IconButton
						icon="settings"
						iconSx={{ color: theme => theme.palette.text.secondary }}
						onClick={() => navigate(`/setting/${account?.address}/notification`)}
					/>
				</Stack>
			</Stack>
			<Stack sx={{ gap: 1.5 }}>
				{isNofificationsExists ? (
					notifications.map(notification => <NotificationCard notification={notification} key={notification._id} />)
				) : (
					<NotFound description="There is no notification" />
				)}
			</Stack>
		</Stack>
	);
};
