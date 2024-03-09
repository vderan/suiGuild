import { SxProps, Theme } from '@mui/system';
import { IPost } from 'src/contexts';

export interface EditorProps {
	readOnly?: boolean;
	communityIndex?: number;
	post?: IPost;
	numberLinesToDisplay?: number;
	readContent?: string;
	isSaveDraftBtnShown?: boolean;
	title?: string;
	content?: string;
	onClose?: () => void;
	onCreate?: () => void;
	onSubmitEnd?: () => void;
	onSubmitStart?: () => void;
	editorSx?: SxProps<Theme>;
}
