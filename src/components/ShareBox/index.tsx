import React from 'react';
import { Popover, Box, Modal, Stack } from '@mui/material';
import { IShareBoxProps } from './ShareBox.types';
import { H3Title, Paragraph2 } from '../Typography';
import { useClipboard } from 'src/hooks/useClipboard';
import { IconButton } from '../IconButton';
import { icons } from '../icons';
import { SecondaryButton } from '../Button';

export const ShareBox = ({ size = 'small', label, ...props }: IShareBoxProps) => {
	const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
	const isOpen = Boolean(anchorEl);
	const id = isOpen ? 'simple-popover' : undefined;
	const { copy } = useClipboard();

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<>
			{props.element ? (
				React.cloneElement(props.element, { onClick: handleClick })
			) : props.secondary ? (
				<SecondaryButton size={size} startIcon="share" onClick={handleClick}>
					{label}
				</SecondaryButton>
			) : (
				<IconButton icon="share" onClick={handleClick} size={size} label={label} />
			)}
			{props.isModal ? (
				<Modal
					sx={theme => ({
						backdropFilter: `blur(${theme.spacing(1)})`,
						height: '100vh',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						[theme.breakpoints.down('md')]: {
							alignItems: 'flex-end'
						}
					})}
					open={isOpen}
					onClose={handleClose}
				>
					<Stack
						sx={theme => ({
							position: 'relative',
							width: 'calc(100% - 32px)',
							maxWidth: '575px',
							margin: 2,
							padding: 4,
							maxHeight: 'calc(100% - 32px)',
							boxSizing: 'border-box',
							background: theme.palette.dark[700],
							border: `${theme.spacing(0.125)} solid ${theme.palette.border.subtle}`,
							borderRadius: 1.5,
							[theme.breakpoints.down('md')]: {
								flexDirection: 'column',
								maxHeight: '90%',
								height: 'auto'
							}
						})}
					>
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								gap: theme => theme.spacing(2),
								justifyContent: 'space-between',
								marginBottom: theme => theme.spacing(2)
							}}
						>
							<H3Title>Share</H3Title>
							<SecondaryButton size="small" startIcon="close" onClick={handleClose} />
						</Box>
						<Box
							sx={{
								gap: theme => theme.spacing(1),
								display: 'flex',
								flexDirection: 'column',
								overflow: 'auto',
								pr: 0.5
							}}
						>
							{props.links?.map((i, index) => {
								const ShareIcon = icons[i.icon];

								return (
									<Box
										component="button"
										key={index}
										sx={{
											borderRadius: 1,
											background: 'transparent',
											padding: theme => theme.spacing(2.5, 4),
											display: 'flex',
											alignItems: 'center',
											gap: theme => theme.spacing(3),
											width: '100%',
											cursor: 'pointer',
											border: 'none',
											boxSizing: 'border-box',
											color: theme => theme.palette.text.primary,
											position: 'relative',
											'&::after': {
												content: '""',
												position: 'absolute',
												inset: 0,
												padding: theme => theme.spacing(0.125),
												borderRadius: theme => theme.spacing(1),
												background: theme => theme.palette.border.subtle,
												WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
												WebkitMaskComposite: 'xor',
												maskComposite: 'exclude'
											},
											'&:hover': {
												'&::after': {
													background: theme => theme.palette.gradient2.main
												}
											}
										}}
										onClick={() => copy(i.href)}
									>
										<ShareIcon sx={{ width: '32px', height: '32px', color: theme => theme.palette.tertiary.main }} />
										<H3Title>{i.title}</H3Title>
									</Box>
								);
							})}
						</Box>
					</Stack>
				</Modal>
			) : (
				<Popover
					id={id}
					open={isOpen}
					anchorEl={anchorEl}
					onClose={handleClose}
					anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
				>
					<Box
						sx={{
							display: 'flex',
							width: '200px',
							flexDirection: 'column',
							alignItems: 'flex-start',
							flexShrink: 0,
							borderRadius: 1,
							border: theme => `${theme.spacing(0.125)} solid ${theme.palette.border.default}`,
							background: theme => theme.palette.dark[500]
						}}
					>
						{props.links?.map((i, index) => {
							const ShareIcon = icons[i.icon];

							return (
								<Box
									component="button"
									key={index}
									sx={{
										padding: 1,
										display: 'flex',
										alignItems: 'center',
										gap: 1,
										width: '100%',
										cursor: 'pointer',
										color: theme => theme.palette.text.primary,
										backgroundColor: 'transparent',
										border: 'none',
										'&:hover': {
											color: theme => theme.palette.primary[700]
										}
									}}
									onClick={() => copy(i.href)}
								>
									<ShareIcon fontSize="small" sx={{ color: theme => theme.palette.text.secondary }} />
									<Paragraph2 sx={{ color: 'inherit' }}>{i.title}</Paragraph2>
								</Box>
							);
						})}
					</Box>
				</Popover>
			)}
		</>
	);
};

export default ShareBox;
