import { Stack, Box, ImageList, ImageListItem, Collapse, Skeleton } from '@mui/material';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import { SecondaryButton } from 'src/components/Button';
import { ErrorMessage } from 'src/components/ErrorMessage';
import { IconButton } from 'src/components/IconButton';
import { NotFound } from 'src/components/NotFound';
import { ListSkeleton } from 'src/components/Skeleton';
import { H2Title, Label } from 'src/components/Typography';
import { AuthContext, IGamingSetup } from 'src/contexts';
import { ipfsUrl } from 'src/helpers/ipfs.helpers';
import { useCustomSWR } from 'src/hooks/useCustomSWR';
import { useDevice } from 'src/hooks/useDevice';
import { useProfile } from 'src/hooks/useProfile';

export const gamingSetupCommunities = [
	'PC',
	'PlayStation 5',
	'Xbox Series X',
	'Nintendo Switch',
	'PlayStation 4',
	'Xbox One',
	'Nintendo Wii U',
	'PlayStation 3',
	'Xbox 360',
	'Nintendo Wii',
	'PlayStation 2',
	'Xbox',
	'Nintendo GameCube',
	'PlayStation',
	'Super Nintendo Entertainment System (SNES)',
	'Nintendo 64',
	'Sega Genesis',
	'Nintendo Entertainment System (NES)',
	'Atari 2600'
];

export const gamingSetupComponents = [
	'CPU',
	'GPU',
	'RAM',
	'Motherboard',
	'Storage',
	'Power Supply Unit',
	'Cooling System (Fans, Liquid Cooling)',
	'Case',
	'Monitor',
	'Keyboard',
	'Mouse',
	'Headset',
	'Speakers',
	'Console',
	'Microphone',
	'Webcam',
	'Graphics Card',
	'Network Card',
	'Wi-Fi Card',
	'Controller',
	'Battery Pack (for portable consoles)',
	'Controller Charging Dock',
	'Console Stand'
];

function getColsRows(index: number) {
	if (index % 8 == 0) {
		return { cols: 1, rows: 2, style: { height: 560 } };
	} else if (index % 8 == 1) {
		return { cols: 1, rows: 1, style: { height: 288 } };
	} else if (index % 8 == 2) {
		return { cols: 1, rows: 1, style: { height: 332 } };
	} else if (index % 8 == 3) {
		return { cols: 1, rows: 2 };
	} else if (index % 8 == 4) {
		return { cols: 1, rows: 1, style: { height: 193 } };
	} else if (index % 8 == 5) {
		return { cols: 1, rows: 1, style: { height: 257, marginTop: '-45px' } };
	} else if (index % 8 == 6) {
		return { cols: 1, rows: 1 };
	} else if (index % 8 == 7) {
		return { cols: 1, rows: 1, style: { height: 350, marginTop: '-140px' } };
	}
}

const Card = ({ index, item }: { index: number; item: IGamingSetup }) => {
	const { iMd } = useDevice();

	return (
		<ImageListItem {...getColsRows(iMd ? 1 : index)}>
			<Box
				sx={{
					width: '100%',
					height: '100%',
					background: `linear-gradient(180deg, rgba(0, 0, 0, 0) 23.05%, #000000 100%), url(${ipfsUrl(
						item.coverImage.url
					)})`,
					backgroundPosition: '50% 50%',
					backgroundRepeat: 'no-repeat',
					backgroundSize: 'cover',
					borderRadius: 1,
					position: 'relative'
				}}
			>
				<Stack
					sx={{
						width: '100%',
						overflow: 'hidden',
						position: 'absolute',
						bottom: theme => theme.spacing(3),
						px: 4
					}}
				>
					<Label noWrap>{item.name}</Label>
				</Stack>
			</Box>
		</ImageListItem>
	);
};

export const GamingSetup = ({ userId }: { userId?: string }) => {
	const { profile } = useContext(AuthContext);
	const { iMd } = useDevice();
	const navigate = useNavigate();
	const [isShowExpandableSection, setIsShowExpandableSection] = useState(false);
	const { getUserInfo } = useProfile();
	const { data: user, isLoading, error: isError } = useCustomSWR('getUserInfo' + userId, () => getUserInfo(userId));

	const gamingSetup = user?.games.some || [];

	const handleCollapseChange = () => {
		setIsShowExpandableSection(prev => !prev);
	};

	const itemsCount = iMd ? 1 : 5;

	return (
		<Stack direction="column" spacing={2.5}>
			<Stack direction="row" alignItems="center" gap={2}>
				<H2Title>My Setup</H2Title>
				{profile?.id === userId && (
					<IconButton icon="edit" onClick={() => navigate(`/profile/${profile?.id}/gaming-setup`)} />
				)}
			</Stack>
			{isError ? (
				<ErrorMessage description="There was an error while loading" />
			) : isLoading ? (
				<ListSkeleton numberOfItems={itemsCount} sx={{ gap: 2, flexDirection: 'row' }}>
					<Skeleton variant="rounded" height={200} width="100%" />
				</ListSkeleton>
			) : gamingSetup.length ? (
				<ImageList cols={itemsCount} gap={16}>
					{gamingSetup.map((item, index) => index < 8 && <Card key={index} index={index} item={item} />)}
				</ImageList>
			) : (
				<NotFound description="No gaming tools" />
			)}
			{gamingSetup.length > 8 && (
				<Stack width="100%" gap={2}>
					<SecondaryButton sx={{ width: 'max-content', mx: 'auto' }} onClick={handleCollapseChange}>
						Show more
					</SecondaryButton>
					<Collapse in={isShowExpandableSection}>
						<ImageList cols={iMd ? 1 : 5} gap={16}>
							{gamingSetup.map((item, index) => index > 7 && <Card key={index} index={index} item={item} />)}
						</ImageList>
					</Collapse>
				</Stack>
			)}
		</Stack>
	);
};
