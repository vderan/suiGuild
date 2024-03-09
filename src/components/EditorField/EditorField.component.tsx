import { useState, useEffect } from 'react';
import { Box, ButtonBase, Fade, FormHelperText, Stack, styled } from '@mui/material';
import { EditorFieldProps } from './EditorField.types';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import { IDomEditor, IEditorConfig, IToolbarConfig, i18nChangeLanguage, SlateElement } from '@wangeditor/editor';
import '@wangeditor/editor/dist/css/style.css';
import { toast } from 'react-toastify';
import { isValidFileSize } from 'src/helpers/file.helpers';
import { MAX_FILE_SIZE } from 'src/constants/constants';
import { ButtonMediumText, Label } from '../Typography';
import MuiDialog from '@mui/material/Dialog';
import React from 'react';
import { TransitionProps } from '@mui/material/transitions';
import { IconButton } from '../IconButton';
import { useDevice } from 'src/hooks/useDevice';

i18nChangeLanguage('en');

type InsertImageType = (url: string, alt: string, href: string) => void;
type InsertVideoType = (url: string, poster: string) => void;
type ImageType = SlateElement & { id: string; src: string };

const StyledEditor = styled(Editor)<{ isReadonly?: boolean; numberLinesToDisplay?: number; editorHeight?: string }>(
	({ theme, isReadonly, numberLinesToDisplay, editorHeight }) => ({
		height: isReadonly ? '100%' : editorHeight,
		'& .w-e-text-placeholder': {
			fontStyle: 'normal',
			color: theme.palette.text.primary
		},
		'& .w-e-text-container': {
			backgroundColor: 'transparent',
			color: theme.palette.text.primary,
			fontFamily: isReadonly ? 'Work Sans' : 'Exo',
			fontSize: isReadonly ? theme.spacing(2) : theme.spacing(1.75),
			wordBreak: isReadonly ? 'break-word' : 'initial',
			'& .w-e-image-container': {
				maxWidth: '100%',
				height: 'auto!important'
			},
			'& .w-e-modal': {
				backgroundColor: theme.palette.dark[700],
				color: theme.palette.text.primary,
				fontSize: theme.spacing(1.75),
				border: `${theme.spacing(0.125)} solid ${theme.palette.dark[500]}`,
				height: theme.spacing(37.5),
				borderRadius: `${theme.spacing(1.5)}px`,
				left: `${theme.spacing(0)} !important`,
				right: `${theme.spacing(0)} !important`,
				top: `${theme.spacing(1.125)} !important`,
				'& .babel-container input': {
					backgroundColor: theme.palette.dark[500],
					border: 'none',
					color: theme.palette.text.primary,
					fontFamily: 'Exo',
					fontSize: theme.spacing(1.75)
				},
				'& .button-container button': {
					backgroundColor: theme.palette.dark[500],
					border: `${theme.spacing(0.125)} solid ${theme.palette.dark[700]}`,
					color: theme.palette.text.primary,
					fontFamily: 'Exo',
					fontSize: theme.spacing(1.75)
				},
				'& .btn-close svg': {
					fill: theme.palette.text.primary
				}
			},
			'& .w-e-max-length-info': {
				bottom: theme.spacing(-4),
				fontSize: theme.spacing(1.5)
			},
			'& a': {
				color: theme.palette.primary[900],
				textDecoration: 'none'
			},
			'& .w-e-textarea-video-container': {
				border: 'none',
				borderRadius: 0,
				backgroundImage: 'none',
				margin: '0 !important',
				padding: '0 !important',
				'& video': {
					width: '100%'
				}
			}
		},
		...(isReadonly && {
			'& .open-in-full-button': {
				position: 'absolute',
				top: theme.spacing(1),
				right: theme.spacing(1),
				border: 0,
				background: 'transparent',
				color: theme.palette.text.primary,
				cursor: 'pointer',
				display: 'flex',
				'&--top': {
					top: 0,
					right: 0
				},
				'&:hover': {
					color: theme.palette.primary[900]
				}
			},
			'& .w-e-text-container .w-e-max-length-info': {
				display: 'none'
			},
			'& .w-e-text-container [data-slate-editor]': {
				padding: 0,
				'& .w-e-image-container': {
					position: 'relative'
				},
				'& p': {
					margin: `${theme.spacing(1)} 0`
				},
				'& img': {
					cursor: 'pointer',
					position: 'relative'
				}
			},
			'& [role="textarea"]': {
				display: '-webkit-inline-box',
				WebkitBoxOrient: 'vertical',
				WebkitLineClamp: `${numberLinesToDisplay}`,
				overflow: 'hidden',
				width: '100%',
				padding: 0
			},
			'& a': {
				cursor: 'pointer'
			}
		})
	})
);

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
	'& .w-e-toolbar': {
		backgroundColor: theme.palette.dark[500],
		borderRadius: `${theme.shape.borderRadius}px`,
		border: `${theme.spacing(0.125)} solid ${theme.palette.border.subtle}`,
		width: 'fit-content',
		'& .w-e-bar-item:focus': {
			'&:focus': {
				backgroundColor: theme.palette.dark[500],
				borderRadius: theme.spacing(0.5)
			}
		},
		'& .w-e-bar-item button': {
			'&:hover': {
				backgroundColor: theme.palette.dark[500],
				borderRadius: theme.spacing(0.5)
			},
			'& svg': {
				fill: theme.palette.text.primary
			},
			'& .title': {
				marginBottom: 0
			}
		},
		'& .w-e-bar-item .w-e-drop-panel': {
			top: theme.spacing(0.625),
			backgroundColor: theme.palette.dark[900],
			border: `${theme.spacing(0.125)} solid ${theme.palette.dark[500]}`,
			borderRadius: `${theme.shape.borderRadius}px`,
			'& .w-e-panel-content-emotion': {
				width: theme.spacing(23),
				height: theme.spacing(31.25),
				overflowY: 'auto',
				'& li': {
					padding: theme.spacing(0.5),
					'&:hover': {
						backgroundColor: theme.palette.dark[500]
					}
				}
			}
		},
		'& .w-e-bar-item button.active': {
			backgroundColor: theme.palette.dark[900],
			borderRadius: theme.spacing(1)
		},
		'& .w-e-bar-item-group .w-e-bar-item-menus-container': {
			backgroundColor: theme.palette.dark[700],
			border: `${theme.spacing(0.125)} solid ${theme.palette.dark[500]}`,
			borderRadius: `${theme.shape.borderRadius}px`,
			'& button': {
				color: theme.palette.text.primary,
				fontFamily: 'Exo',
				fontSize: theme.spacing(1.75)
			}
		}
	}
}));

const Transition = React.forwardRef(function Transition(
	props: TransitionProps & {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		children: React.ReactElement<any, any>;
	},
	ref: React.Ref<unknown>
) {
	return <Fade ref={ref} {...props} />;
});

const createOpenInFullButton = (elem?: HTMLElement | null) => {
	const button = document.createElement('button');
	const rect = elem?.getClientRects()[0];
	const isImageLessThanBtn = rect?.width && rect.width < 40;
	const size = isImageLessThanBtn ? 20 : 24;

	button.setAttribute('class', `open-in-full-button ${isImageLessThanBtn ? 'open-in-full-button--top' : ''}`);

	button.innerHTML = `
	<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M3.5 20.5V13.5H4.5V18.8115L18.8115 4.5H13.5V3.5H20.5V10.5H19.5V5.18848L5.18848 19.5H10.5V20.5H3.5Z"
			fill="currentColor"
		/>
	</svg>
	`;
	return button;
};

export const EditorField = ({
	readOnly,
	value,
	readContent,
	numberLinesToDisplay,
	errorMessage,
	label,
	isNeedVideoUpload = true,
	isNeedImageUpload = true,
	disabled = false,
	placeholder = 'What do you want to discuss?',
	editorHeight = '320px',
	maxLength = 10000,
	maxReadMoreLength = 300,
	onChange,
	onUploadImage,
	onUploadVideo,
	editorSx,
	imageModalFooter
}: EditorFieldProps) => {
	const [editor, setEditor] = useState<IDomEditor | null>(null);
	const [isReadMoreClicked, setIsReadMoreClicked] = useState(false);
	const [isImageModalOpen, setIsImageModalOpen] = useState(false);
	const [imageSrc, setImageSrc] = useState('');
	const { iMid } = useDevice();

	const toolbarConfig: Partial<IToolbarConfig> = {};

	toolbarConfig.toolbarKeys = [
		'italic',
		'bold',
		'underline',
		'through',
		'justifyLeft',
		'justifyCenter',
		'justifyRight',
		'bulletedList',
		'insertLink',
		'emotion',

		...(isNeedImageUpload ? ['uploadImage'] : []),
		...(isNeedVideoUpload ? ['uploadVideo'] : [])
	];

	const editorConfig: Partial<IEditorConfig> = {
		MENU_CONF: {}
	};

	editorConfig.placeholder = placeholder;
	editorConfig.maxLength = maxLength;
	editorConfig.readOnly = readOnly;
	editorConfig.autoFocus = !iMid;

	if (editor?.getConfig()) {
		editor.getConfig().hoverbarKeys = {};
	}

	if (editorConfig.MENU_CONF) {
		editorConfig.MENU_CONF['uploadImage'] = {
			async customUpload(file: File, insertFn: InsertImageType) {
				if (!isValidFileSize(file)) {
					toast.error(`You cannot upload an image exceeding ${MAX_FILE_SIZE} MB`, { theme: 'colored' });
					return;
				}
				const imgUrl = URL.createObjectURL(file);
				onUploadImage?.(imgUrl);
				insertFn(imgUrl, 'image', '');
			}
		};

		editorConfig.MENU_CONF['uploadVideo'] = {
			async customUpload(file: File, insertFn: InsertVideoType) {
				if (!isValidFileSize(file)) {
					toast.error(`You cannot upload a video exceeding ${MAX_FILE_SIZE} MB`, { theme: 'colored' });
					return;
				}
				const videoUrl = URL.createObjectURL(file);
				onUploadVideo?.(videoUrl);
				insertFn(videoUrl, 'gilder');
			}
		};
	}

	useEffect(() => {
		return () => {
			if (editor == null) return;
			editor.destroy();
			setEditor(null);
		};
	}, [editor]);

	const isNeedReadMore = readOnly && (readContent?.length || 0) > maxReadMoreLength && !numberLinesToDisplay;

	useEffect(() => {
		if (!readOnly) return;
		const images = editor?.getElemsByType('image') as ImageType[];
		images?.forEach(image => {
			const imgWrapper = document.getElementById(image.id);
			const openImage = (e: MouseEvent) => {
				e.preventDefault(), setImageSrc(image.src), setIsImageModalOpen(true);
			};
			const button = createOpenInFullButton(imgWrapper);
			button.onclick = openImage;
			imgWrapper?.firstChild?.appendChild(button);

			const imgElements = imgWrapper?.getElementsByTagName('img');
			if (imgElements) {
				[...imgElements].forEach(img => {
					img.onclick = openImage;
				});
			}
		});

		const links = editor?.getElemsByType('link');
		links?.forEach(link => {
			const _link = document.getElementById(link.id);
			const preventLink = (e: MouseEvent) => e.stopPropagation();
			if (_link) {
				_link.onclick = preventLink;
			}
		});
	}, [editor, isReadMoreClicked, readContent, readOnly]);

	const handleClose = (e: MouseEvent | React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault(), setIsImageModalOpen(false);
	};

	return (
		<Stack direction="column" spacing={1} sx={{ width: '100%' }}>
			{label ? <Label>{label}</Label> : null}
			<Box
				sx={{
					width: '100%',
					position: 'relative',
					padding: readOnly ? 0 : theme => theme.spacing(1.5, 1.5, 5),
					backgroundColor: 'transparent',
					border: readOnly ? 'none' : theme => `${theme.spacing(0.125)} solid ${theme.palette.border.subtle}`,
					borderRadius: readOnly ? 0 : 1,
					opacity: disabled ? 0.3 : 1,
					pointerEvents: disabled ? 'none' : 'initial'
				}}
			>
				{!readOnly && <StyledToolbar editor={editor} defaultConfig={toolbarConfig} />}
				<StyledEditor
					isReadonly={readOnly}
					numberLinesToDisplay={numberLinesToDisplay}
					defaultConfig={editorConfig}
					value={
						readOnly
							? isNeedReadMore && !isReadMoreClicked
								? `${readContent?.slice(0, maxReadMoreLength)}...`
								: readContent
							: value
					}
					onCreated={setEditor}
					onChange={editor => {
						onChange?.(editor.getHtml());
					}}
					mode="default"
					editorHeight={editorHeight}
					sx={editorSx}
				/>
				{isNeedReadMore && (
					<Box display="flex" justifyContent="flex-end">
						<ButtonBase
							sx={{
								width: 'max-content'
							}}
							onClick={e => {
								e.preventDefault();
								setIsReadMoreClicked(!isReadMoreClicked);
							}}
						>
							<ButtonMediumText
								sx={{
									background: theme => theme.palette.gradient1.main,
									WebkitBackgroundClip: 'text',
									backgroundClip: 'text',
									WebkitTextFillColor: 'transparent',
									WebkitBoxDecorationBreak: 'clone'
								}}
							>
								{isReadMoreClicked ? 'Show less' : 'Show more'}
							</ButtonMediumText>
						</ButtonBase>
					</Box>
				)}
			</Box>
			{errorMessage && <FormHelperText error>{errorMessage}</FormHelperText>}
			{readOnly && (
				<MuiDialog
					maxWidth="xl"
					open={isImageModalOpen}
					onClose={e => handleClose(e as MouseEvent)}
					aria-labelledby="dialog-image"
					TransitionComponent={Transition}
					fullWidth
					sx={theme => ({
						'& .MuiDialog-paper': {
							width: 'initial',
							border: 'none',
							borderRadius: 0,
							backgroundColor: 'transparent',
							boxShadow: 'none',
							gap: 2.5
						},
						[theme.breakpoints.down('md')]: {
							'& .MuiDialog-container': {
								alignItems: 'center'
							}
						}
					})}
				>
					<Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
						<img
							style={{ maxWidth: '100%', objectFit: 'contain', maxHeight: 'calc(100vh - 120px)' }}
							src={imageSrc}
							alt="image"
						/>
						<IconButton sx={{ position: 'absolute', top: 2.5, right: 2.5 }} icon="close" onClick={handleClose} />
					</Box>
					{imageModalFooter}
				</MuiDialog>
			)}
		</Stack>
	);
};
