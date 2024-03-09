import MUIIconButton from '@mui/material/IconButton';
import { Icon } from 'src/components/Icon';
import { CircularProgress } from 'src/components/Progress';
import { ICustomIconButtonProps } from './IconButton.types';
import { Paragraph3 } from '../Typography';

export const IconButton = ({
	icon,
	loading = false,
	size = 'medium',
	iconSx,
	label,
	...props
}: ICustomIconButtonProps) => {
	return (
		<MUIIconButton
			{...props}
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
							}
						},
						...iconSx
					}}
				/>
			)}
			{label && (
				<Paragraph3
					color="text.secondary"
					sx={{
						'.MuiIconButton-root:hover &': {
							background: theme => theme.palette.gradient1.main,
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
