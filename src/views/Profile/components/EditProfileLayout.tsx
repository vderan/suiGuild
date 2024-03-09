import { Box, ButtonBase, Stack, StackProps, SxProps, Theme, alpha } from '@mui/material';
import { PropsWithChildren, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { SecondaryButton } from 'src/components/Button';
import { Icon } from 'src/components/Icon';
import { ButtonSmallText, H4Title, Paragraph3 } from 'src/components/Typography';
import { ColorModeContext } from 'src/contexts';

export const EditProfileLayout = ({ children, header }: PropsWithChildren<{ header: JSX.Element }>) => {
	const navigate = useNavigate();

	return (
		<>
			<Stack
				gap={3.75}
				sx={{
					pt: { xs: 3, lg: 5 },
					maxWidth: '1084px',
					mx: 'auto'
				}}
			>
				<ButtonBase sx={{ gap: 0.5, width: 'max-content' }} onClick={() => navigate(-1)}>
					<Icon icon="chevronLeft" sx={{ color: theme => theme.palette.text.secondary }} />
					<ButtonSmallText color="text.secondary">Go back</ButtonSmallText>
				</ButtonBase>

				<Stack gap={3}>
					<Stack direction="row" justifyContent="space-between" alignItems="center">
						{header}
					</Stack>
					<Box>{children}</Box>
				</Stack>
			</Stack>
		</>
	);
};

export const EditProfileNoDataOrErrorLayout = ({
	children,
	onClick,
	buttonText
}: PropsWithChildren<{ onClick?: () => void; buttonText?: string }>) => {
	return (
		<>
			<Stack
				width="100%"
				alignItems="center"
				gap={3}
				sx={theme => ({
					borderRadius: 1,
					border: `${theme.spacing(0.125)} dashed ${theme.palette.border.default}`,
					padding: { xs: theme.spacing(10, 2), lg: theme.spacing(20, 2) }
				})}
			>
				{children}
				{onClick && buttonText && (
					<SecondaryButton startIcon="add" onClick={onClick}>
						{buttonText}
					</SecondaryButton>
				)}
			</Stack>
		</>
	);
};

export const EditCard = ({
	title,
	description,
	image,
	isDeleteBtnLoading,
	isDeleteBtnDisabled,
	onDelete,
	onEdit,
	imageSx,
	imageBoxChildren,
	titleElement,
	...props
}: {
	title: string;
	description?: string;
	image: string;
	isDeleteBtnLoading?: boolean;
	isDeleteBtnDisabled?: boolean;
	onDelete?: () => void;
	onEdit?: () => void;
	imageSx?: SxProps<Theme>;
	imageBoxChildren?: JSX.Element;
	titleElement?: JSX.Element;
} & StackProps) => {
	const { theme } = useContext(ColorModeContext);

	return (
		<Stack gap={1} className="edit-card" {...props}>
			<Box
				sx={{
					background: `url(${image})`,
					borderRadius: 1,
					width: '100%',
					height: { xs: theme.spacing(21.25), lg: theme.spacing(25.5) },
					backgroundPosition: '50% 50%',
					backgroundRepeat: 'no-repeat',
					backgroundSize: 'cover',
					position: 'relative',
					'.edit-card:hover &': {
						'&::after': {
							content: '""',
							position: 'absolute',
							inset: 0,
							padding: theme.spacing(0.125),
							borderRadius: theme.spacing(1),
							background: theme.palette.gradient2.main,
							WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
							WebkitMaskComposite: 'xor',
							maskComposite: 'exclude'
						}
					},
					[theme.breakpoints.down('lg')]: {
						'&::after': {
							content: '""',
							position: 'absolute',
							inset: 0,
							padding: theme.spacing(0.125),
							borderRadius: theme.spacing(1),
							background: theme.palette.gradient2.main,
							WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
							WebkitMaskComposite: 'xor',
							maskComposite: 'exclude'
						}
					},
					...imageSx
				}}
			>
				<Stack
					direction="row"
					gap={2}
					justifyContent="space-between"
					alignItems="flex-start"
					sx={{
						position: 'absolute',
						top: 0,
						left: 0,
						width: '100%',
						height: '100%',
						padding: 1.25,
						backgroundColor: imageBoxChildren ? 'initial' : theme => alpha(theme.palette.dark[900], 0.6),
						transition: 'opacity 0.2s ease-in-out',
						opacity: { xs: 1, lg: 0 },
						'.edit-card:hover &': {
							opacity: 1
						}
					}}
				>
					{onEdit && (
						<SecondaryButton
							startIcon="edit"
							size="small"
							onClick={onEdit}
							sx={{ zIndex: 1 }}
							disabled={isDeleteBtnLoading || isDeleteBtnDisabled}
						/>
					)}
					<SecondaryButton
						startIcon="close"
						size="small"
						onClick={onDelete}
						sx={{ zIndex: 1, ml: 'auto' }}
						disabled={isDeleteBtnDisabled}
						loading={isDeleteBtnLoading}
					/>
				</Stack>
				{imageBoxChildren}
			</Box>
			<Stack sx={{ gap: 0.5 }}>
				{titleElement || (
					<H4Title title={title} noWrap>
						{title}
					</H4Title>
				)}
				{description && (
					<Paragraph3 noWrap color="text.secondary">
						{description}
					</Paragraph3>
				)}
			</Stack>
		</Stack>
	);
};
