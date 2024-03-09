import { Stack } from '@mui/material';
import { INotFoundProps } from './NotFound.types';
import { ButtonMediumText, H2Title, H3Title, Paragraph1, Paragraph2, Paragraph3 } from '../Typography';
import NoDataIcon from '../Icons/NoDataIcon';
import { useDevice } from 'src/hooks/useDevice';

export const NotFound = ({ title = '', description = '', iconProps, isSmall = false, ...rest }: INotFoundProps) => {
	const { iMid } = useDevice();
	const Title = isSmall ? ButtonMediumText : iMid ? H3Title : H2Title;
	const Description = isSmall ? Paragraph3 : iMid ? Paragraph2 : Paragraph1;

	return (
		<Stack spacing={3} alignItems="center" {...rest}>
			<NoDataIcon
				{...iconProps}
				sx={{
					width: theme => (isSmall ? theme.spacing(19.75) : theme.spacing(27.5)),
					height: theme => (isSmall ? theme.spacing(11.625) : theme.spacing(16.25)),
					color: theme => theme.palette.dark[700],
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
