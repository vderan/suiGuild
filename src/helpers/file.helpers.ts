import { MessageAttachmentType } from 'src/types/Xmpp.types';

export function getFileBase64(file: File): Promise<string> {
	return new Promise<string>((resolve, reject) => {
		const reader = new FileReader();

		reader.onloadend = () => {
			const base64String = reader.result as string;
			const base64Data = base64String.split(',')[1]; // Extract base64 data from the result
			resolve(base64Data);
		};

		reader.onerror = error => {
			reject(error);
		};

		reader.readAsDataURL(file);
	});
}

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

export const stringToFile = async (dataUrl: string, filename: string): Promise<File> => {
	const response = await fetch(dataUrl);
	const responseArrayBuffer = await response.arrayBuffer();
	const file = new File([responseArrayBuffer], filename);

	return file;
};

// fileSize = 5 megabytes
export const isValidFileSize = (file: File, fileSize = 5) => {
	const maxSizeBytes = fileSize * 1024 * 1024;

	return file.size <= maxSizeBytes;
};
