import React, { Suspense, useContext, useState } from 'react';
import Popover from '@mui/material/Popover';
import { IconButton } from '../IconButton';
import { ButtonBase, Stack } from '@mui/material';
import { Label } from '../Typography';
import { ErrorHandler } from 'src/helpers';
import { AuthContext, NotificationContext } from 'src/contexts';
import { markAllAsRead } from 'src/api/notification';
import { NotificationCard } from 'src/views/Notifications/components/NotificationCard';
import { PrimaryButton } from '../Button';
import { useNavigate } from 'react-router-dom';
import { NotFound } from '../NotFound';
import { toast } from 'react-toastify';

export const NotificationPopup = () => {
	const { notifications, getNotifications } = useContext(NotificationContext);

	const { profile } = useContext(AuthContext);
	const navigate = useNavigate();

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const isNofificationsExists = Boolean(notifications.length);

	const close = () => {
		setAnchorEl(null);
	};

	const markAllRead = async () => {
		if (!profile?.displayName) {
			toast.warning('You should have your own display name!', { theme: 'colored' });
			return;
		}
		try {
			await markAllAsRead(profile.displayName);
			await getNotifications();
		} catch (err) {
			ErrorHandler.process(err);
		}
	};

	return (
		<>
			<IconButton size="small" icon="notification" onClick={e => setAnchorEl(e.currentTarget)} />
			<Popover
				id="notification-popup"
				open={Boolean(anchorEl)}
				anchorEl={anchorEl}
				onClose={close}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'right'
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'right'
				}}
				PaperProps={{
					elevation: 0,
					sx: theme => ({
						width: 340,
						marginTop: 1,
						background: theme.palette.dark[500],
						border: `${theme.spacing(0.125)} solid ${theme.palette.border.default}`,
						borderRadius: 1,
						padding: 0.5,
						gap: 0.5,
						display: 'flex',
						flexDirection: 'column'
					})
				}}
			>
				<Suspense>
					<Stack
						sx={{
							justifyContent: 'space-between',
							flexDirection: 'row',
							alignItems: 'center',
							borderRadius: 1.5,
							padding: 1.5,
							gap: 1
						}}
					>
						<Label fontWeight={700}>Notifications</Label>
						<Stack
							sx={{
								flexDirection: 'row',
								alignItems: 'center',
								gap: 1.5
							}}
						>
							{isNofificationsExists && (
								<ButtonBase
									onClick={markAllRead}
									sx={{
										fontSize: 12,
										fontFamily: 'Exo',
										color: theme => theme.palette.text.secondary,
										transition: theme =>
											theme.transitions.create('color', {
												duration: theme.transitions.duration.standard
											}),
										'&:hover': {
											color: theme => theme.palette.text.primary
										}
									}}
								>
									Mark all as read
								</ButtonBase>
							)}
							<IconButton
								size="large"
								icon="settings"
								onClick={() => {
									close();
									setTimeout(() => {
										navigate(`/setting/${profile?.id}/notification`);
									}, 500);
								}}
							/>
						</Stack>
					</Stack>
					{isNofificationsExists ? (
						<>
							<Stack sx={{ gap: 0.5 }}>
								{notifications.slice(0, 3).map(notification => {
									return <NotificationCard notification={notification} key={notification._id} />;
								})}
							</Stack>
							<PrimaryButton
								size="small"
								sx={{ width: '100%' }}
								onClick={() => {
									close();
									setTimeout(() => {
										navigate('/notifications');
									}, 500);
								}}
							>
								View all
							</PrimaryButton>
						</>
					) : (
						<NotFound sx={{ pb: 1.5 }} description="No notifications" />
					)}
				</Suspense>
			</Popover>
		</>
	);
};
