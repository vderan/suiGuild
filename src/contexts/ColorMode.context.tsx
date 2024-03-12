import { createTheme, CustomThemeOptions, PaletteOptions, Theme, ThemeOptions } from '@mui/material/styles';
import { TypographyOptions } from '@mui/material/styles/createTypography';
import React, { PropsWithChildren } from 'react';
import { useLocalStorage } from 'src/hooks/useLocalStorage';

// add new custom Typography's variant
declare module '@mui/material/styles' {
	interface TypographyVariants {
		p1: React.CSSProperties;
		p2: React.CSSProperties;
		p3: React.CSSProperties;
		subtitle: React.CSSProperties;
		headerLarge: React.CSSProperties;
		headerMedium: React.CSSProperties;
		headerSmall: React.CSSProperties;
		buttonBigText: React.CSSProperties;
		buttonMediumText: React.CSSProperties;
		buttonSmallText: React.CSSProperties;
		label: React.CSSProperties;
		preTitle: React.CSSProperties;
	}
	// allow configuration using `createTheme`
	interface TypographyVariantsOptions {
		p1?: React.CSSProperties;
		p2?: React.CSSProperties;
		p3?: React.CSSProperties;
		subtitle?: React.CSSProperties;
		headerLarge: React.CSSProperties;
		headerMedium: React.CSSProperties;
		headerSmall: React.CSSProperties;
		buttonBigText: React.CSSProperties;
		buttonMediumText: React.CSSProperties;
		buttonSmallText: React.CSSProperties;
		label: React.CSSProperties;
		preTitle: React.CSSProperties;
	}

	interface Palette {
		dark: {
			900: string;
			700: string;
			500: string;
			400: string;
		};
		light: {
			300: string;
			200: string;
			100: string;
		};
		blue: {
			900: string;
			700: string;
			500: string;
			300: string;
		};
		purple: {
			900: string;
			700: string;
			500: string;
			300: string;
		};
		surface: { background: string; buttonBg: string; iconBtn: string; container: string };
		system: { default: string; icon: string };
		link: {
			main: string;
		};
		buttonText: {
			white: string;
		};
		gradient: {
			main: string;
			secondary: string;
		};
		shadow: {
			main: string;
			secondary: string;
		};
		border: {
			subtle: string;
			default: string;
			highlight: string;
		};
	}

	interface PaletteOptions {
		dark: {
			900: string;
			700: string;
			500: string;
			400: string;
		};
		light: {
			300: string;
			200: string;
			100: string;
		};
		blue: {
			900: string;
			700: string;
			500: string;
			300: string;
		};
		purple: {
			900: string;
			700: string;
			500: string;
			300: string;
		};
		surface: { background: string; buttonBg: string; iconBtn: string; container: string };
		system: { default: string; icon: string };
		link: {
			main: string;
		};
		buttonText: {
			white: string;
		};
		gradient: {
			main: string;
			secondary: string;
		};
		shadow: {
			main: string;
			secondary: string;
		};
		border: {
			subtle: string;
			default: string;
			highlight: string;
		};
	}
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
	interface TypographyPropsVariantOverrides {
		p1: true;
		p2: true;
		p3: true;
		subtitle: true;
		headerLarge: true;
		headerMedium: true;
		headerSmall: true;
		buttonBigText: true;
		buttonMediumText: true;
		buttonSmallText: true;
		label: true;
		preTitle: true;
	}
}

interface CustomTheme extends Theme {
	status: {
		dark: string;
		light: string;
		blue: string;
		purple: string;
		buttonText: string;
		link: string;
		surface: string;
		system: string;
		gradient: string;
		shadow: string;
		border: string;
	};
}

declare module '@mui/material/SvgIcon' {
	interface SvgIconPropsSizeOverrides {
		extraSmall: true;
		extraLarge: true;
	}
}
declare module '@mui/material/IconButton' {
	interface IconButtonPropsSizeOverrides {
		extraSmall: true;
	}
}

declare module 'notistack' {
	interface VariantOverrides {
		toast: {
			type?: 'error' | 'success' | 'info' | 'warning';
			headerMsg?: string;
		};
	}
}

declare module '@mui/material/styles' {
	interface BreakpointOverrides {
		xs: true; // removes the `xs` breakpoint
		sm: true;
		md: true;
		lg: true;
		xl: true;
		mobile: true;
		tablet: true;
		laptop: true;
		desktop: true;
		dialogSmall: true;
		dialogMedium: true;
		dialogLarge: true;
		dialogExtraSmall: true;
	}
	// allow configuration using `createTheme`
	interface CustomThemeOptions extends ThemeOptions {
		status?: {
			dark: string;
			light: string;
			blue: string;
			buttonText: string;
			purple: string;
			link: string;
			surface: string;
			system: string;
			gradient: string;
			shadow: string;
			border: string;
		};
	}
	export function createTheme(options?: CustomThemeOptions): CustomTheme;
}

//custom typographies
const TYPOGRAPHY: Readonly<TypographyOptions> = {
	fontFamily: ['Clash Display', 'Exo', 'Work Sans'].join(','),
	headerLarge: {
		fontSize: '64px',
		fontWeight: 700
	},
	headerMedium: {
		fontSize: '56px',
		fontWeight: 700
	},
	headerSmall: {
		fontSize: '48px',
		fontWeight: 600
	},
	h1: {
		fontSize: '32px',
		fontWeight: 700
	},
	h2: {
		fontSize: '24px',
		fontWeight: 700
	},
	h3: {
		fontSize: '20px',
		fontWeight: 600
	},
	h4: {
		fontSize: '16px',
		fontWeight: 600
	},
	subtitle: {
		fontSize: '18px',
		fontWeight: 600
	},
	p1: {
		fontSize: '16px',
		fontWeight: 400
	},
	p2: {
		fontSize: '14px',
		fontWeight: 400
	},
	p3: {
		fontSize: '12px',
		fontWeight: 400
	},
	preTitle: {
		fontSize: '14px',
		fontWeight: 700
	},
	buttonBigText: {
		fontSize: '16px',
		fontWeight: 600
	},
	buttonMediumText: {
		fontSize: '14px',
		fontWeight: 600
	},
	buttonSmallText: {
		fontSize: '12px',
		fontWeight: 600
	},
	label: {
		fontSize: '14px',
		fontWeight: 600
	}
};

const SHARED: Readonly<Partial<CustomThemeOptions>> = {
	breakpoints: {
		values: {
			xs: 360,
			sm: 540,
			md: 768,
			lg: 1024,
			xl: 1366,
			mobile: 450,
			tablet: 640,
			laptop: 890,
			desktop: 1500,
			dialogExtraSmall: 360,
			dialogSmall: 462,
			dialogMedium: 500,
			dialogLarge: 686
		}
	},
	typography: TYPOGRAPHY,
	shape: {
		borderRadius: 8
	},
	components: {
		MuiCssBaseline: {
			styleOverrides: theme => ({
				'&::-webkit-scrollbar': {
					width: '8px'
				},
				'&::-webkit-scrollbar-thumb': {
					border: '3px solid rgba(0, 0, 0, 0)',
					borderTop: 'none',
					borderBottom: 'none',
					backgroundClip: 'padding-box',
					backgroundColor: theme.palette.border.highlight
				},
				'.notistack-SnackbarContainer': {
					zIndex: 9999
				}
			})
		},
		MuiModal: {
			styleOverrides: {
				root: {
					zIndex: 1500
				}
			}
		},
		MuiAutocomplete: {
			styleOverrides: {
				popper: {
					zIndex: 1600
				}
			}
		},
		MuiButton: {
			defaultProps: {
				disableRipple: true
			}
		},
		MuiButtonBase: {
			defaultProps: {
				disableRipple: true
			}
		},
		MuiDialog: {
			styleOverrides: {
				root: {
					zIndex: 1500
				},
				paper: ({ theme }) => ({
					background: theme.palette.dark[700],
					border: `1px solid ${theme.palette.border.subtle}`,
					borderRadius: theme.spacing(1),
					margin: theme.spacing(2),
					maxHeight: `calc(100% - ${theme.spacing(4)})`,
					width: `calc(100% - ${theme.spacing(4)})`
				}),
				container: ({ theme }) => ({
					backdropFilter: 'blur(22px)',
					[theme.breakpoints.down('md')]: {
						alignItems: 'flex-end'
					}
				})
			}
		},
		MuiDialogTitle: {
			styleOverrides: {
				root: ({ theme }) => ({
					padding: theme.spacing(4)
				})
			}
		},
		MuiDialogContent: {
			styleOverrides: {
				root: ({ theme }) => ({
					padding: theme.spacing(4),
					paddingTop: 0
				})
			}
		},
		MuiDialogActions: {
			styleOverrides: {
				root: ({ theme }) => ({
					borderTop: `1px solid ${theme.palette.border.subtle}`,
					background: theme.palette.dark[500],
					padding: theme.spacing(2, 4)
				})
			}
		},
		MuiList: {
			styleOverrides: {
				root: {
					padding: 0
				}
			}
		},
		MuiListItemText: {
			styleOverrides: {
				primary: {
					fontSize: 14
				}
			}
		},
		MuiMenu: {
			styleOverrides: {
				paper: ({ theme }) => ({
					color: theme.palette.text.primary,
					marginTop: theme.spacing(0.375),
					border: `1px solid ${theme.palette.border.subtle}`,
					backgroundColor: theme.palette.surface.container
				})
			}
		},
		MuiMenuItem: {
			defaultProps: {
				disableRipple: true
			},
			styleOverrides: {
				root: ({ theme }) => ({
					fontSize: 14,
					padding: theme.spacing(1, 1.5),
					'&:hover': {
						background: theme.palette.gradient.main,
						color: theme.palette.buttonText.white
					},
					'&.Mui-selected': {
						background: theme.palette.gradient.main,
						color: theme.palette.buttonText.white
					}
				})
			}
		},
		MuiInputBase: {
			styleOverrides: {
				root: ({ theme }) => ({
					paddingTop: '9px',
					paddingBottom: '9px',
					paddingLeft: '12px',
					paddingRight: '12px',
					fontSize: 14,
					minHeight: 40,
					borderRadius: '8px !important',
					backgroundColor: 'transparent',
					lineHeight: 'initial',
					fieldset: {
						borderColor: theme.palette.border.subtle,
						borderWidth: 1
					},
					'&:hover fieldset': {
						borderColor: `${theme.palette.blue[300]} !important`
					},
					'&.Mui-focused fieldset': {
						borderColor: `${theme.palette.border.default} !important`,
						borderWidth: '1px !important'
					},
					'& .MuiInputAdornment-root': {
						height: 'initial',
						maxHeight: 'initial'
					},
					'&.Mui-disabled': {
						opacity: 0.7,
						'& fieldset': {
							borderColor: `${theme.palette.border.subtle} !important`
						}
					},
					'.MuiInputBase-input': {
						padding: '0px',
						margin: 'auto 0',
						'&.Mui-disabled': {
							opacity: 0.7,
							WebkitTextFillColor: theme.palette.text.primary
						},
						'&::placeholder': {
							color: theme.palette.text.primary,
							opacity: 0.5
						}
					},
					'&.Mui-error fieldset': {
						borderColor: `${theme.palette.error.main} !important`
					}
				})
			}
		},
		MuiFormHelperText: {
			styleOverrides: {
				root: ({ theme }) => ({
					marginLeft: 'auto !important',
					fontSize: 12,
					marginTop: `${theme.spacing(1)} !important`
				})
			}
		},
		MuiSkeleton: {
			defaultProps: {
				animation: 'wave'
			}
		},
		MuiLink: {
			styleOverrides: {
				root: {
					textDecoration: 'none'
				}
			}
		},
		MuiDivider: {
			styleOverrides: {
				root: ({ theme }) => ({
					borderColor: theme.palette.border.subtle
				})
			}
		},
		MuiSvgIcon: {
			variants: [
				{
					props: { fontSize: 'extraSmall' },
					style: {
						width: '16px',
						height: '16px',
						fontSize: '16px'
					}
				},
				{
					props: { fontSize: 'extraLarge' },
					style: {
						width: '36px',
						height: '36px',
						fontSize: '36px'
					}
				}
			],
			styleOverrides: {
				fontSizeSmall: {
					width: '20px',
					height: '20px',
					fontSize: '20px'
				},
				fontSizeMedium: {
					width: '22px',
					height: '22px',
					fontSize: '22px'
				},
				fontSizeLarge: {
					width: '24px',
					height: '24px',
					fontSize: '24px'
				}
			}
		}
	}
};

// Declare Light Mode
const FRONT_COLORS_LIGHT: Readonly<PaletteOptions> = {
	primary: {
		main: '#5987FF'
	},
	secondary: {
		main: '#8E59FF'
	},
	success: {
		main: '#4EA50B'
	},
	error: {
		main: '#D23D3D'
	},
	warning: {
		main: '#DAAF3F'
	},
	surface: { background: '#F1F1F1', buttonBg: '#FFFFFF', iconBtn: '#E5D9FF', container: '#FFFFFF' },
	system: { default: '#E5D9FF', icon: '#606060' },
	text: {
		primary: '#131313',
		secondary: '#606060'
	},
	buttonText: {
		white: '#FFFFFF'
	},
	link: {
		main: '#4176FF'
	},
	gradient: {
		main: 'linear-gradient(89.1deg, #8E59FF 0%, #5987FF 100%)',
		secondary: 'linear-gradient(267.57deg, #E84242 2.62%, #8063F3 98.59%)'
	},
	shadow: {
		main: '#3C6CE780',
		secondary: '#A988FD33'
	},
	border: {
		subtle: '#60606026',
		default: '#6060604D',
		highlight: '#60606080'
	},
	background: {
		default: '#F1F1F1'
	},
	dark: {
		900: '#131313',
		700: '#1F1F1F',
		500: '#242426',
		400: '#606060'
	},
	light: {
		300: '#D5D5D5',
		200: '#F1F1F1',
		100: '#FFFFFF'
	},
	blue: {
		900: '#4176FF',
		700: '#5987FF',
		500: '#9EB9FF',
		300: '#D5E1FF'
	},
	purple: {
		900: '#713DE0',
		700: '#8E59FF',
		500: '#B693FF',
		300: '#E5D9FF'
	}
};

const LIGHT_THEME: Readonly<CustomThemeOptions> = {
	palette: {
		mode: 'light',
		...FRONT_COLORS_LIGHT
	},
	...SHARED
};

//declare Dark Mode
const FRONT_COLORS_DARK: Readonly<PaletteOptions> = {
	primary: {
		main: '#5987FF'
	},
	secondary: {
		main: '#8E59FF'
	},
	success: {
		main: '#4EA50B'
	},
	error: {
		main: '#D23D3D'
	},
	warning: {
		main: '#DAAF3F'
	},
	surface: { background: '#131313', buttonBg: '#131313', iconBtn: '#E5D9FF', container: '#1F1F1F' },
	system: { default: '#E5D9FF', icon: '#E5D9FF' },
	text: {
		primary: '#FFFFFF',
		secondary: '#E5D9FF'
	},
	background: {
		default: '#131313'
	},
	buttonText: {
		white: '#FFFFFF'
	},
	link: {
		main: '#5987FF'
	},
	gradient: {
		main: 'linear-gradient(89.79deg, #713DE0 -2.54%, #4176FF 99.87%)',
		secondary: 'linear-gradient(269.83deg, #E84242 0.13%, #8063F3 99.84%)'
	},
	shadow: {
		main: '#3C6CE780',
		secondary: '#A988FD33'
	},
	border: {
		subtle: '#FFFFFF26',
		default: '#FFFFFF4D',
		highlight: '#FFFFFF80'
	},
	dark: {
		900: '#131313',
		700: '#1F1F1F',
		500: '#242426',
		400: '#606060'
	},
	light: {
		300: '#D5D5D5',
		200: '#F1F1F1',
		100: '#FFFFFF'
	},
	blue: {
		900: '#4176FF',
		700: '#5987FF',
		500: '#9EB9FF',
		300: '#D5E1FF'
	},
	purple: {
		900: '#713DE0',
		700: '#8E59FF',
		500: '#B693FF',
		300: '#E5D9FF'
	}
};
const DARK_THEME: Readonly<CustomThemeOptions> = {
	palette: {
		mode: 'dark',
		...FRONT_COLORS_DARK
	},
	...SHARED
};

interface ColorModeContextInterface {
	theme: CustomTheme;
	toggleColorMode: () => void;
	isDarkMode: boolean;
}

export const ColorModeContext = React.createContext<ColorModeContextInterface>({
	theme: {} as CustomTheme,
	toggleColorMode: () => {},
	isDarkMode: false
});

export type ColorMode = 'light' | 'dark';

export const ColorModeProvider = ({ children }: PropsWithChildren) => {
	const [mode, setMode] = useLocalStorage<ColorMode>('colorMode', 'dark');
	const { toggleColorMode } = React.useMemo(
		() => ({
			toggleColorMode: () => {
				setMode(mode === 'light' ? 'dark' : 'light');
			}
		}),

		// eslint-disable-next-line react-hooks/exhaustive-deps
		[mode]
	);

	const colorModeTheme = React.useMemo(() => {
		const theme = mode === 'dark' ? createTheme(DARK_THEME) : createTheme(LIGHT_THEME);
		return theme;
	}, [mode]);

	return (
		<ColorModeContext.Provider
			value={{
				theme: colorModeTheme,
				toggleColorMode,
				isDarkMode: colorModeTheme.palette.mode === 'dark'
			}}
		>
			{children}
		</ColorModeContext.Provider>
	);
};
