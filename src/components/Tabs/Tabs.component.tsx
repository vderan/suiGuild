import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import { Icon } from 'src/components/Icon';
import { ButtonMediumText, H3Title } from 'src/components/Typography';
import { CountBadge } from 'src/components/Badge';
import { ICustomTabsProps, ITabs } from './Tabs.types';
import { BUTTON_ICON_SIZE } from 'src/constants/theme.constants';
import { useDevice } from 'src/hooks/useDevice';
import { useLocation } from 'react-router-dom';

export const CustomTabs = ({ tabs, isTertiary = false, tabsChildren }: ICustomTabsProps) => {
	const { iMd } = useDevice();
	const { hash } = useLocation();
	const tabIndex = tabs.findIndex(i => i.hash === hash) || 0;
	const defaultTab = tabIndex > 0 ? tabIndex : 0;
	const [value, setValue] = React.useState(defaultTab);

	const updateHash = (newHash: string) => {
		if (newHash !== hash) window.location.hash = newHash;
	};

	const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
		updateHash(tabs[newValue].hash || '');
	};

	return (
		<Box
			sx={theme => ({
				width: '100%',
				'& .MuiTab-root': {
					textTransform: 'none',
					color: theme.palette.text.primary,
					padding: 0,
					'&.Mui-selected': {
						color: theme.palette.text.primary
					}
				},
				'& .swiper-wrapper': {
					width: 'auto'
				},
				'& .MuiTabScrollButton-root.Mui-disabled': {
					display: 'none'
				}
			})}
		>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					gap: 2
				}}
			>
				<Tabs
					value={value}
					onChange={handleChange}
					variant="scrollable"
					allowScrollButtonsMobile={iMd && true}
					sx={{
						minHeight: '40px',
						'& .MuiTabs-indicator': {
							background: theme => (isTertiary ? theme.palette.gradient2.main : theme.palette.text.primary),
							height: theme => theme.spacing(0.125),
							borderBottom: 'none'
						}
					}}
				>
					{tabs.map((tab, index) => (
						<Tab
							key={index}
							label={
								<TabContent
									startIcon={tab.startIcon}
									endIcon={tab.endIcon}
									label={tab.label}
									countNum={tab.countNum}
									isTertiary={isTertiary}
									isActive={value === index}
								/>
							}
							sx={{
								borderBottom: theme =>
									isTertiary
										? `${theme.spacing(0.125)} solid ${theme.palette.border.subtle}`
										: `${theme.spacing(0.125)} solid ${theme.palette.border.default}`,
								minHeight: '40px'
							}}
						/>
					))}
				</Tabs>
				{tabsChildren}
			</Box>

			{tabs.map((tab, index) => (
				<TabPanel key={index} value={value} index={index} isTertiary={isTertiary}>
					{tab.children}
				</TabPanel>
			))}
		</Box>
	);
};

const TabContent = ({ isTertiary, ...props }: ITabs & { isTertiary: boolean }) => {
	return (
		<Box
			sx={{
				display: 'flex',
				alignItems: 'center',
				gap: theme => theme.spacing(1),
				padding: isTertiary ? theme => theme.spacing(2, 1.5) : theme => theme.spacing(1, 1.5, 1, 1)
			}}
		>
			{props.startIcon ? (
				<Icon
					icon={props.startIcon}
					fontSize="small"
					sx={{ color: theme => (props.isActive ? theme.palette.tertiary.main : theme.palette.border.highlight) }}
				/>
			) : props.startImage ? (
				<img src={props.startImage} alt="startImg" width={BUTTON_ICON_SIZE} height={BUTTON_ICON_SIZE} />
			) : (
				<></>
			)}

			{isTertiary ? (
				<H3Title
					sx={{
						opacity: props.isActive ? 1 : 0.3
					}}
				>
					{props.label}
				</H3Title>
			) : (
				<ButtonMediumText>{props.label}</ButtonMediumText>
			)}

			{props.endIcon ? (
				<Icon
					icon={props.endIcon}
					fontSize="small"
					sx={{ color: theme => (props.isActive ? theme.palette.tertiary.main : theme.palette.border.highlight) }}
				/>
			) : props.endImage ? (
				<img src={props.endImage} alt="endImg" width={BUTTON_ICON_SIZE} height={BUTTON_ICON_SIZE} />
			) : (
				<></>
			)}
			{props.countNum && <CountBadge count={props.countNum} />}
			{props.children}
		</Box>
	);
};

interface ITabPanelProps {
	index: number;
	value: number;
	children?: React.ReactNode;
	isTertiary?: boolean;
}

const TabPanel = (props: ITabPanelProps) => {
	const { children, value, index, isTertiary, ...other } = props;

	return (
		<Box
			role="tabpanel"
			hidden={value !== index}
			id={`tabpane-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box sx={{ marginTop: isTertiary ? { xs: 4, lg: 7.75 } : 0, width: isTertiary ? '100%' : 'auto' }}>
					{children}
				</Box>
			)}
		</Box>
	);
};
