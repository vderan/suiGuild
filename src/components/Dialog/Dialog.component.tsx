import MuiDialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Fade from '@mui/material/Fade';
import { TransitionProps } from '@mui/material/transitions';
import React, { PropsWithChildren } from 'react';
import { IDialogProps } from './Dialog.types';
import slugify from 'slugify';
import DialogActions from '@mui/material/DialogActions';
import { PrimaryButton, SecondaryButton } from '../Button';
import Stack from '@mui/material/Stack';
import { H3Title, H4Title } from '../Typography';
import { Box } from '@mui/material';

const Transition = React.forwardRef(function Transition(
	props: TransitionProps & {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		children: React.ReactElement<any, any>;
	},
	ref: React.Ref<unknown>
) {
	return <Fade ref={ref} {...props} />;
});

export const Dialog = ({
	open,
	title,
	width = 'dialogLarge',
	onClose,
	onConfirmText,
	onCancelText,
	isConfirmDisabled,
	isConfirmLoading,
	isCancelDisabled,
	isCancelLoading,
	onConfirm,
	children,
	nofooter = false,
	isConfirmation = false,
	sx,
	actions
}: PropsWithChildren<IDialogProps>) => {
	const Title = isConfirmation ? H4Title : H3Title;
	const dialogTitle = title || '';
	return (
		<MuiDialog
			open={open}
			onClose={onClose}
			aria-labelledby={`dialog-${slugify(dialogTitle)}`}
			aria-describedby={`dialog-description-${slugify(dialogTitle)}`}
			TransitionComponent={Transition}
			fullWidth
			maxWidth={width}
			sx={{
				...(children && {
					'& .MuiDialogTitle-root': {
						paddingBottom: 3
					}
				}),
				...sx
			}}
		>
			{dialogTitle ? (
				<DialogTitle
					component={Box}
					id="dialog-title"
					sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'center' }}
				>
					<Title sx={{ wordBreak: 'break-word' }}>{title}</Title>
					<SecondaryButton sx={{ mb: 'auto' }} size="small" startIcon="close" onClick={onClose} />
				</DialogTitle>
			) : (
				<SecondaryButton
					sx={{ position: 'absolute', top: theme => theme.spacing(2.5), right: theme => theme.spacing(2.5) }}
					size="small"
					startIcon="close"
					onClick={onClose}
				/>
			)}
			{children && (
				<DialogContent
					sx={{
						pt: dialogTitle ? 0 : 4,
						'::-webkit-scrollbar': {
							width: theme => theme.spacing(0.25)
						},
						'::-webkit-scrollbar-track': {
							boxShadow: theme => theme.palette.secondary[900],
							webkitBoxShadow: theme => theme.palette.secondary[900]
						},
						'::-webkit-scrollbar-thumb': {
							backgroundColor: theme => theme.palette.light[700]
						}
					}}
				>
					{children}
				</DialogContent>
			)}
			{!nofooter && (
				<DialogActions
					sx={{
						justifyContent: 'flex-start'
					}}
				>
					{actions ? (
						actions
					) : (
						<Stack direction="row" spacing={1} flex={{ xs: 1, sm: 'initial' }}>
							{onConfirm && onConfirmText ? (
								<PrimaryButton
									sx={{ flex: 'inherit' }}
									onClick={onConfirm}
									loading={isConfirmLoading}
									disabled={isConfirmDisabled}
								>
									{onConfirmText}
								</PrimaryButton>
							) : null}
							{onCancelText ? (
								<SecondaryButton
									sx={{ flex: 1 }}
									loading={isCancelLoading}
									onClick={onClose}
									disabled={isCancelDisabled}
								>
									{onCancelText}
								</SecondaryButton>
							) : null}
						</Stack>
					)}
				</DialogActions>
			)}
		</MuiDialog>
	);
};
