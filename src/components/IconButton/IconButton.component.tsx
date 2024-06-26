import MUIIconButton from '@mui/material/IconButton';
import { Icon } from 'src/components/Icon';
import { CircularProgress } from 'src/components/Progress';
import { ICustomIconButtonProps } from './IconButton.types';
import { Paragraph3 } from '../Typography';

export const IconButton = ({
	icon,
	iconColor = 'default',
	loading = false,
	size = 'medium',
	iconSx,
	label,
	...props
}: ICustomIconButtonProps) => {
	return (
		<MUIIconButton
			{...props}
			disableRipple
			disabled={props.disabled || loading}
			sx={{
				padding: 0,
				gap: 1,
				'&:hover': {
					backgroundColor: 'transparent'
				},
				...props.sx
			}}
		>
			{loading ? (
				<CircularProgress />
			) : (
				<Icon
					icon={icon}
					fontSize={size}
					sx={{
						'.MuiIconButton-root:hover &': {
							'path[fill]': {
								fill: 'url(#svgGradient1)'
							},
							'path[stroke]': {
								stroke: 'url(#svgGradientStroke)'
							},
							'circle[fill]': {
								fill: 'url(#svgGradient1)'
							},
							'circle[stroke]': {
								stroke: 'url(#svgGradientStroke)'
							},
							'rect[fill]': {
								fill: 'url(#svgGradient1)'
							},
							'rect[stroke]': {
								stroke: 'url(#svgGradientStroke)'
							},
							opacity: 1
						},
						...(iconColor === 'text' && { color: theme => theme.palette.text.primary, opacity: 0.5 }),
						...iconSx
					}}
				/>
			)}
			{label && (
				<Paragraph3
					color="text.secondary"
					sx={{
						'.MuiIconButton-root:hover &': {
							fontWeight: 600,
							background: theme => theme.palette.gradient.main,
							WebkitBackgroundClip: 'text',
							backgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							WebkitBoxDecorationBreak: 'clone'
						}
					}}
				>
					{label}
				</Paragraph3>
			)}
		</MUIIconButton>
	);
};
