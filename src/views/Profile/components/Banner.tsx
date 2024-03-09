import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { coverUrl } from 'src/constants/images.constants';
import { ipfsUrl } from 'src/helpers/ipfs.helpers';

export const Banner = ({ cover, isLoading }: { cover?: string; isLoading?: boolean }) => {
	return (
		<Box
			sx={theme => ({
				width: { xs: `calc(100% + ${theme.spacing(4)})`, sm: `calc(100% + ${theme.spacing(6)})` },
				height: theme.spacing(31),
				marginLeft: { xs: -2, sm: -3 }
			})}
		>
			{isLoading ? (
				<Skeleton
					variant="rectangular"
					sx={{
						width: '100%',
						height: '100%'
					}}
				/>
			) : (
				<Box
					component="img"
					src={ipfsUrl(cover ?? coverUrl)}
					alt="Banner"
					sx={{
						width: '100%',
						height: '100%',
						objectFit: 'cover'
					}}
				/>
			)}
		</Box>
	);
};
