import { Box, BoxProps } from '@mui/material';
import { useContext } from 'react';
import logoImg from 'src/assets/icons/logo.svg';
import logoLightImg from 'src/assets/icons/logo-light.svg';
import { ColorModeContext } from 'src/contexts';

export const Logo = ({ ...props }: BoxProps) => {
	const { isDarkMode } = useContext(ColorModeContext);

	return <Box component="img" src={isDarkMode ? logoImg : logoLightImg} {...props} />;
};
