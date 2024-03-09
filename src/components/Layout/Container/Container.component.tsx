import { Box, Stack } from '@mui/material';
import { PropsWithChildren } from 'react';
import { useDevice } from 'src/hooks/useDevice';

export const Main = ({ children }: PropsWithChildren) => {
	const Gradient1 = () => (
		<Box
			sx={theme => ({
				position: 'fixed',
				width: theme.spacing(90),
				height: theme.spacing(90),
				left: 0,
				bottom: 0,
				background: 'radial-gradient(58.24% 70.81% at 0% 100%, #E44349 0%, rgba(2, 8, 33, 0) 100%)',
				zIndex: -1,
				opacity: 0.1
			})}
		/>
	);

	const Gradient2 = () => (
		<Box
			sx={theme => ({
				position: 'fixed',
				width: theme.spacing(90),
				height: theme.spacing(90),
				right: 0,
				top: 0,
				background: 'radial-gradient(58.24% 70.81% at 0% 100%, #8163F2 0%, rgba(2, 8, 33, 0) 100%)',
				opacity: 0.2,
				transform: 'rotate(180deg)',
				zIndex: -1
			})}
		/>
	);

	return (
		<Box
			component="main"
			sx={theme => ({
				display: 'grid',
				maxHeight: '100vh',
				gridTemplateColumns: 'auto minmax(100px,1fr)',
				[theme.breakpoints.down('lg')]: {
					display: 'flex',
					maxHeight: 'initial'
				}
			})}
		>
			<Gradient1 />
			<Gradient2 />
			{children}
		</Box>
	);
};

export const Column = ({ children }: PropsWithChildren) => {
	const { isDesktop } = useDevice();

	return (
		<Stack
			direction={isDesktop ? 'row' : 'column'}
			gap={2.5}
			sx={{
				'& > *': {
					flex: 1
				}
			}}
		>
			{children}
		</Stack>
	);
};
