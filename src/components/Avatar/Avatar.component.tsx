import { useContext } from 'react';
import { Avatar, Link, Skeleton } from '@mui/material';
import { ColorModeContext } from 'src/contexts';
import { IAvatarProps } from './Avatar.types';
import { useProfile } from 'src/hooks/useProfile';
import { ipfsUrl } from 'src/helpers/ipfs.helpers';
import { avatarUrl } from 'src/constants/images.constants';
import { useCustomSWR } from 'src/hooks/useCustomSWR';
import { SxProps, Theme } from '@mui/system';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';

export const CustomAvatar = ({ image, ...props }: IAvatarProps) => {
	return (
		<Avatar src={image} alt="avatarImage" sx={{ ...props.sx }}>
			{props.children}
		</Avatar>
	);
};

export const HeaderAvatar = ({ image, ...props }: IAvatarProps) => {
	const { theme } = useContext(ColorModeContext);
	return (
		<Avatar
			src={image}
			alt="avatarImage"
			sx={{
				...props.sx,
				width: theme => theme.spacing(3),
				height: theme => theme.spacing(3),
				border: `${theme.spacing(0.125)} solid ${theme.palette.primary[900]}`
			}}
		/>
	);
};

export const AccAvatar = ({ image, ...props }: IAvatarProps) => {
	const { theme } = useContext(ColorModeContext);
	return (
		<Avatar
			src={image}
			alt="avatarImage"
			sx={{
				...props.sx,
				width: theme => theme.spacing(8),
				height: theme => theme.spacing(8),
				border: `${theme.spacing(0.25)} solid ${theme.palette.primary[900]}`
			}}
		/>
	);
};

export const TeamAvatar = ({ image, ...props }: IAvatarProps) => {
	return (
		<Avatar
			src={image}
			alt="avatarImage"
			sx={{
				...props.sx,
				width: theme => theme.spacing(7),
				height: theme => theme.spacing(7)
			}}
		/>
	);
};

export const LargeAvatar = ({ image, ...props }: IAvatarProps) => {
	return (
		<Avatar
			src={image}
			alt="avatarImage"
			sx={{
				width: theme => theme.spacing(4),
				height: theme => theme.spacing(4),
				...props.sx
			}}
		>
			{props.children}
		</Avatar>
	);
};

export const MediumAvatar = ({ image, ...props }: IAvatarProps) => {
	return (
		<Avatar
			src={image}
			alt="avatarImage"
			sx={{
				width: theme => theme.spacing(3),
				height: theme => theme.spacing(3),
				...props.sx
			}}
		>
			{props.children}
		</Avatar>
	);
};

export const SmallAvatar = ({ image, ...props }: IAvatarProps) => {
	return (
		<Avatar
			src={image}
			alt="avatarImage"
			sx={{
				width: theme => theme.spacing(2.5),
				height: theme => theme.spacing(2.5),
				...props.sx
			}}
		/>
	);
};

export const CAvatar = ({
	address,
	sx,
	skeletonWidth = 24
}: {
	address: string;
	sx?: SxProps<Theme>;
	skeletonWidth?: number;
}) => {
	const { getUserInfo } = useProfile();
	const { data: user, isLoading } = useCustomSWR('getUserInfo' + address, () => getUserInfo(address));

	const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
		if (user && !user.isActive) {
			event.preventDefault();
			toast.warning('This user was deactivated!', { theme: 'colored' });
		}
	};

	return isLoading ? (
		<Skeleton variant="circular" height={skeletonWidth} width={skeletonWidth} />
	) : (
		<Link component={NavLink} to={`/profile/0x${address}`} onClick={handleClick}>
			<MediumAvatar sx={sx} image={ipfsUrl(user?.userInfo.some?.avatar.url ?? avatarUrl)} />
		</Link>
	);
};
