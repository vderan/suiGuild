import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Grid, ButtonBase } from '@mui/material';
import { styled } from '@mui/system';
import { H2Title, PreTitle, ButtonSmallText } from 'src/components/Typography';
import { useDevice } from 'src/hooks/useDevice';
import { Account } from './components/Account';
import { EditProfile } from './components/EditProfile';
import { Connections } from './components/Connections';
import { Notification } from './components/Notification';
import { TabButton } from 'src/components/Button/TabButton.component';
import { Icons } from 'src/components/icons';
import { Icon } from 'src/components/Icon';

enum SettingsTabs {
	account = '0',
	eprofile = '1',
	connection = '2',
	notification = '3'
}

type SettingTab = {
	value: SettingsTabs;
	label: string;
	startIcon: Icons;
};

const options: SettingTab[] = [
	{
		value: SettingsTabs.account,
		label: 'Account',
		startIcon: 'settings'
	},
	{ value: SettingsTabs.eprofile, label: 'Edit profile', startIcon: 'edit' },
	{ value: SettingsTabs.connection, label: 'Connections', startIcon: 'link2' },
	{
		value: SettingsTabs.notification,
		label: 'Notifications',
		startIcon: 'notification'
	}
];

export const Settings = () => {
	const { editProfile } = useParams();
	const navigate = useNavigate();
	const { iMid } = useDevice();
	const [tab, setTab] = useState(iMid ? '' : SettingsTabs.account);

	useEffect(() => {
		const key = SettingsTabs[editProfile as keyof typeof SettingsTabs] || SettingsTabs.account;
		setTab(key);
	}, [editProfile]);

	const onBackClick = () => {
		if (!iMid || !tab) {
			navigate(-1);
			return;
		}

		setTab('');
	};

	return (
		<StyledBox>
			<ButtonBase sx={{ gap: 0.5, width: 'max-content' }} onClick={onBackClick}>
				<Icon icon="chevronLeft" sx={{ color: theme => theme.palette.text.secondary }} />
				<ButtonSmallText color="text.secondary">Go back</ButtonSmallText>
			</ButtonBase>
			<Grid container spacing={7.5}>
				{(!iMid || (iMid && !tab)) && (
					<Grid item lg={3.147} xs={12}>
						<H2Title sx={{ marginBottom: { xs: 2, lg: 3 } }}>Settings</H2Title>
						<Box className="settingBtns">
							{options.map(option => (
								<TabButton
									key={option.value}
									startIcon={option.startIcon}
									onClick={() => setTab(option.value)}
									isFocused={tab === option.value}
									sx={{
										width: '100%'
									}}
								>
									<PreTitle>{option.label}</PreTitle>
								</TabButton>
							))}
						</Box>
					</Grid>
				)}
				<Grid item lg={8.853} xs={12}>
					<Box className="setting-container">
						{iMid && <H2Title>{options.find(option => option.value === tab)?.label}</H2Title>}
						{tab === SettingsTabs.account && <Account />}
						{tab === SettingsTabs.eprofile && <EditProfile />}
						{tab === SettingsTabs.connection && <Connections />}
						{tab === SettingsTabs.notification && <Notification />}
					</Box>
				</Grid>
			</Grid>
		</StyledBox>
	);
};

const StyledBox = styled(Box)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	gap: theme.spacing(4.375),
	paddingTop: theme.spacing(5),
	maxWidth: '1084px',
	margin: '0 auto',
	[theme.breakpoints.down('lg')]: {
		gap: theme.spacing(2),
		paddingTop: theme.spacing(3)
	},
	'& .settingBtns': {
		display: 'flex',
		flexDirection: 'column',
		gap: theme.spacing(1)
	},
	'& .setting-container': {
		display: 'flex',
		flexDirection: 'column',
		gap: theme.spacing(2),
		'& .setting-box': {
			border: `${theme.spacing(0.125)} solid ${theme.palette.dark[700]}`,
			borderRadius: `${theme.shape.borderRadius}px`,
			background: theme.palette.dark[700],
			backdropFilter: `blur(${theme.spacing(2.75)})`,
			padding: theme.spacing(4),
			display: 'flex',
			flexDirection: 'column',
			gap: theme.spacing(3),
			[theme.breakpoints.down('md')]: {
				padding: theme.spacing(3)
			},
			'& .column-box': {
				display: 'flex',
				flexDirection: 'column',
				gap: theme.spacing(1)
			}
		}
	}
}));
