import { Stack, SvgIconProps } from '@mui/material';
import NoDataIcon from '../Icons/NoDataIcon';
import { ButtonMediumText, H2Title, H3Title, Paragraph1, Paragraph2, Paragraph3 } from '../Typography';
import { useDevice } from 'src/hooks/useDevice';
import { ColorModeContext } from 'src/contexts';
import { useContext } from 'react';

export const ErrorMessage = ({
	title = '',
	description = '',
	iconProps,
	isSmall = false
}: {
	title?: string;
	description?: string;
	iconProps?: SvgIconProps;
	isSmall?: boolean;
}) => {
	const { iMid } = useDevice();
	const { isDarkMode } = useContext(ColorModeContext);

	const Title = isSmall ? ButtonMediumText : iMid ? H3Title : H2Title;
	const Description = isSmall ? Paragraph3 : iMid ? Paragraph2 : Paragraph1;
	return (
		<Stack direction="column" spacing={3} alignItems="center">
			<NoDataIcon
				{...iconProps}
				sx={{
					width: theme => (isSmall ? theme.spacing(19.75) : theme.spacing(27.5)),
					height: theme => (isSmall ? theme.spacing(11.625) : theme.spacing(16.25)),
					color: isDarkMode ? theme => theme.palette.surface.container : '#D4D4D4', // TODO: change color
					'.title': {
						fill: isDarkMode ? 'url(#title)' : 'url(#titleWhite)'
					},
					'.title-border': {
						fill: isDarkMode ? '#FFFFFF' : '#474747'
					},
					...iconProps?.sx
				}}
			/>

			<Stack sx={{ gap: 0.5, alignItems: 'center' }}>
				<Title textAlign="center">{title}</Title>
				<Description textAlign="center" color="text.secondary">
					{description}
				</Description>
			</Stack>
		</Stack>
	);
};
