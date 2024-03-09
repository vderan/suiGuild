import { SxProps, Theme } from '@mui/system';

export interface EditorFieldProps {
	readOnly?: boolean;
	value?: string;
	numberLinesToDisplay?: number;
	maxLength?: number;
	maxReadMoreLength?: number;
	errorMessage?: string;
	placeholder?: string;
	editorHeight?: string;
	label?: string;
	readContent?: string;
	onChange?: (val: string) => void;
	onUploadImage?: (val: string) => void;
	onUploadVideo?: (val: string) => void;
	isNeedVideoUpload?: boolean;
	isNeedImageUpload?: boolean;
	disabled?: boolean;
	imageModalFooter?: JSX.Element;
	editorSx?: SxProps<Theme>;
}
