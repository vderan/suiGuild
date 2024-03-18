import { MessageAttachmentType } from 'src/types/Xmpp.types';

export const getAttachmentType = (file: File): MessageAttachmentType => {
	return getAttachmentTypeByMimeType(file.type);
};

export const getAttachmentTypeByMimeType = (mimeType: string): MessageAttachmentType => {
	const type = mimeType;

	switch (type) {
		case 'image/jpeg':
		case 'image/png':
		case 'image/gif':
			return 'image';
		case 'video/mp4':
		case 'video/webm':
		case 'video/ogg':
			return 'video';
		case 'audio/mpeg':
		case 'audio/ogg':
		case 'audio/wav':
			return 'audio';
		default:
			return 'file';
	}
};

// fileSize = 5 megabytes
export const isValidFileSize = (file: File, fileSize = 5) => {
	const maxSizeBytes = fileSize * 1024 * 1024;

	return file.size <= maxSizeBytes;
};
