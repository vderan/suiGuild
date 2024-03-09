import Typography, { TypographyProps } from '@mui/material/Typography';
import React, { PropsWithChildren } from 'react';
import { useProfile } from 'src/hooks/useProfile';
import { NavLink } from 'react-router-dom';
import { Link, Skeleton } from '@mui/material';
import { useCustomSWR } from 'src/hooks/useCustomSWR';
import { toast } from 'react-toastify';

export const HeaderLarge = ({ children, ...props }: PropsWithChildren<TypographyProps>) => {
	return (
		<Typography
			color="text.primary"
			variant="headerLarge"
			fontFamily="Clash Display"
			fontStyle="normal"
			lineHeight="120%"
			{...props}
		>
			{children}
		</Typography>
	);
};
export const HeaderMedium = ({ children, ...props }: PropsWithChildren<TypographyProps>) => {
	return (
		<Typography
			color="text.primary"
			variant="headerMedium"
			fontFamily="Clash Display"
			fontStyle="normal"
			lineHeight="120%"
			{...props}
		>
			{children}
		</Typography>
	);
};

export const HeaderSmall = ({ children, ...props }: PropsWithChildren<TypographyProps>) => {
	return (
		<Typography
			color="text.primary"
			variant="headerSmall"
			fontFamily="Clash Display"
			fontStyle="normal"
			lineHeight="120%"
			{...props}
		>
			{children}
		</Typography>
	);
};

export const H1Title = ({ children, ...props }: PropsWithChildren<TypographyProps>) => {
	return (
		<Typography
			color="text.primary"
			variant="h1"
			fontFamily="Clash Display"
			fontStyle="normal"
			lineHeight="130%"
			{...props}
		>
			{children}
		</Typography>
	);
};

export const H2Title = ({ children, ...props }: PropsWithChildren<TypographyProps>) => {
	return (
		<Typography
			color="text.primary"
			variant="h2"
			fontFamily="Clash Display"
			fontStyle="normal"
			lineHeight="130%"
			{...props}
		>
			{children}
		</Typography>
	);
};

export const H3Title = ({ children, ...props }: PropsWithChildren<TypographyProps>) => {
	return (
		<Typography
			color="text.primary"
			variant="h3"
			fontFamily="Clash Display"
			fontStyle="normal"
			lineHeight="130%"
			{...props}
		>
			{children}
		</Typography>
	);
};

export const H4Title = ({ children, ...props }: PropsWithChildren<TypographyProps>) => {
	return (
		<Typography
			color="text.primary"
			variant="h4"
			fontFamily="Clash Display"
			fontStyle="normal"
			lineHeight="130%"
			{...props}
		>
			{children}
		</Typography>
	);
};

export const Subtitle = ({ children, ...props }: PropsWithChildren<TypographyProps>) => {
	return (
		<Typography
			color="text.primary"
			variant="subtitle"
			fontFamily="Clash Display"
			fontStyle="normal"
			lineHeight="130%"
			{...props}
		>
			{children}
		</Typography>
	);
};

export const Paragraph1 = ({ children, ...props }: PropsWithChildren<TypographyProps>) => {
	return (
		<Typography
			color="text.primary"
			variant="p1"
			fontFamily="Work Sans"
			fontStyle="normal"
			lineHeight="140%"
			{...props}
		>
			{children}
		</Typography>
	);
};

export const Paragraph2 = ({ children, ...props }: PropsWithChildren<TypographyProps>) => {
	return (
		<Typography color="text.primary" variant="p2" fontFamily="Exo" fontStyle="normal" lineHeight="140%" {...props}>
			{children}
		</Typography>
	);
};

export const Paragraph3 = ({ children, ...props }: PropsWithChildren<TypographyProps>) => {
	return (
		<Typography color="text.primary" variant="p3" fontFamily="Exo" fontStyle="normal" lineHeight="140%" {...props}>
			{children}
		</Typography>
	);
};

export const PreTitle = ({ children, ...props }: PropsWithChildren<TypographyProps>) => {
	return (
		<Typography
			color="text.primary"
			variant="preTitle"
			fontFamily="Exo"
			fontStyle="normal"
			lineHeight="140%"
			{...props}
		>
			{children}
		</Typography>
	);
};

export const ButtonBigText = ({ children, ...props }: PropsWithChildren<TypographyProps>) => {
	return (
		<Typography
			color="text.primary"
			variant="buttonBigText"
			fontFamily="Clash Display"
			fontStyle="normal"
			lineHeight="24px"
			{...props}
		>
			{children}
		</Typography>
	);
};

export const ButtonMediumText = ({ children, ...props }: PropsWithChildren<TypographyProps>) => {
	return (
		<Typography
			color="text.primary"
			variant="buttonMediumText"
			fontFamily="Clash Display"
			fontStyle="normal"
			lineHeight="24px"
			{...props}
		>
			{children}
		</Typography>
	);
};

export const ButtonSmallText = ({ children, ...props }: PropsWithChildren<TypographyProps>) => {
	return (
		<Typography
			color="text.primary"
			variant="buttonSmallText"
			fontFamily="Clash Display"
			fontStyle="normal"
			lineHeight="20px"
			{...props}
		>
			{children}
		</Typography>
	);
};

export const Label = ({ children, ...props }: PropsWithChildren<TypographyProps>) => {
	return (
		<Typography
			color="text.primary"
			variant="label"
			fontFamily="Clash Display"
			fontStyle="normal"
			lineHeight="140%"
			{...props}
		>
			{children}
		</Typography>
	);
};

export const CTitle = ({ address }: { address: string }) => {
	const { getUserInfo } = useProfile();
	const { data: user, isLoading } = useCustomSWR('getUserInfo' + address, () => getUserInfo(address));

	const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
		if (user && !user.isActive) {
			event.preventDefault();
			toast.warning('This user was deactivated!', { theme: 'colored' });
		}
	};

	return isLoading ? (
		<Skeleton variant="text" height={16} width={60} />
	) : (
		<Link
			component={NavLink}
			to={`/profile/0x${address}`}
			overflow="hidden"
			noWrap
			onClick={handleClick}
			minWidth={user?.userInfo.some?.displayName ? '20px' : '0px'}
			lineHeight={1}
		>
			<Label noWrap title={user?.userInfo.some?.displayName}>
				{user?.userInfo.some?.displayName}
			</Label>
		</Link>
	);
};
