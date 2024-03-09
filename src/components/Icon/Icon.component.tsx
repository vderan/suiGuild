import { useContext } from 'react';
import { ColorModeContext } from 'src/contexts';
import { icons } from 'src/components/icons';
import { Tooltip } from 'src/components/Tooltip';
import { IIconProps } from './Icon.types';

export const Icon = ({ spacingLeft, spacingRight, icon, label, ...props }: IIconProps) => {
	const IconComponent = icons[icon as keyof typeof icons];
	const { theme } = useContext(ColorModeContext);

	return (
		<Tooltip label={label}>
			<IconComponent
				{...props}
				sx={{
					ml: spacingLeft ? 2 : 0,
					mr: spacingRight ? 2 : 0,
					color: theme.palette.tertiary.main,
					...props.sx
				}}
			/>
		</Tooltip>
	);
};
