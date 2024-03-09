import { useState, useRef, useMemo, useContext } from 'react';
import { Box } from '@mui/material';
import { InputField } from '../InputField';
import { PrimaryButton, SecondaryButton } from '../Button';
import { EditorProps } from './TextEditor.types';
import { Form } from '../Form';
import { Checkbox } from '../Checkbox';
import { useGilder } from 'src/hooks/useGilder';
import { uploadAttachment } from 'src/helpers/upload.helpers';
import { createPostSchema } from 'src/schemas/create-post.schema';
import { ipfsUrl } from 'src/helpers/ipfs.helpers';
import { useForums } from 'src/hooks';
import { AuthContext } from 'src/contexts';
import { toast } from 'react-toastify';
import { Controller } from 'react-hook-form';
import { EditorField } from '../EditorField';
import { useProfile } from 'src/hooks/useProfile';
import { useCustomSWR } from 'src/hooks/useCustomSWR';
import { MediumAvatar } from '../Avatar';
import { differenceDate } from 'src/helpers/date.helpers';
import { Paragraph2, PreTitle } from '../Typography';
import { ErrorHandler } from 'src/helpers';

interface CreatePostForm {
	title: string;
	content: string;
	notify: boolean;
}

export interface IPostData {
	cId: number;
	title: string;
	content: string;
	isDraft: boolean;
}

export const PrimaryEditor = ({
	readOnly,
	communityIndex,
	post,
	readContent,
	numberLinesToDisplay,
	isSaveDraftBtnShown = true,
	title,
	content,
	onClose,
	onCreate,
	onSubmitStart,
	onSubmitEnd,
	editorSx
}: EditorProps) => {
	const { getUserInfo } = useProfile();
	const { createPost, editPost } = useGilder();
	const [urls, setUrls] = useState<string[]>([]);
	const formRef = useRef<null | HTMLFormElement>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { data: forums } = useForums();
	const { profile } = useContext(AuthContext);
	const isDraftRef = useRef<boolean>(false);
	const isEditPost = Boolean(post?.idx);
	const { data: user } = useCustomSWR(post ? 'getUserInfo' + post.creatorInfo : null, () =>
		getUserInfo(post?.creatorInfo)
	);

	const forum = useMemo(
		() => forums?.find(forum => Number(forum.idx) === Number(communityIndex)),
		[forums, communityIndex]
	);

	const handleCreate = async (data: CreatePostForm) => {
		if (communityIndex === undefined) {
			toast.warning('You need to choose the community!', { theme: 'colored' });
			return;
		}
		//  TODO: create a function to get the address with 0x
		const isFollowing = forum?.followers.some(follower => `0x${follower}` === profile?.id);
		if (isFollowing) {
			onSubmitStart?.();
			setIsSubmitting(true);
			try {
				let html = data.content;

				if (urls.length) {
					await Promise.all(
						urls.map(async url => {
							const regex = new RegExp(url);
							if (regex.test(data.content)) {
								const tmpUrl = await uploadAttachment(url, 'file');
								html = html.replace(url, ipfsUrl(tmpUrl));
							}
						})
					);
				}

				const postData = {
					cId: communityIndex,
					title: data.title,
					content: html,
					isDraft: isDraftRef.current
				};

				const pId = Number(post?.idx) || 0;

				if (isEditPost) {
					await editPost({ pId, postData });
				} else {
					await createPost(postData);
				}
				formRef.current?.reset();
				onCreate?.();
				onClose?.();
			} catch (err) {
				ErrorHandler.process(err);
			}
			setIsSubmitting(false);
			onSubmitEnd?.();
		} else {
			toast.warning('You can not post about communities you do not follow!', { theme: 'colored' });
		}
	};

	return (
		<Form<CreatePostForm>
			action={handleCreate}
			defaultValues={{
				title: title || '',
				content: content || '',
				notify: false
			}}
			myRef={formRef}
			schema={createPostSchema}
		>
			<Box
				sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
			>
				{!readOnly && (
					<InputField
						name="title"
						maxLength={100}
						placeholder="Title"
						disabled={isSubmitting}
						boxSx={{ marginBottom: 1 }}
					/>
				)}

				<Controller
					name="content"
					render={({ field, fieldState }) => (
						<EditorField
							readOnly={readOnly}
							value={field.value}
							readContent={readContent}
							editorSx={editorSx}
							disabled={isSubmitting}
							imageModalFooter={
								<>
									{post && user && (
										<Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
											<Paragraph2 whiteSpace="nowrap" color="text.secondary">
												Posted by
											</Paragraph2>
											<Box sx={{ display: 'flex', gap: 1, alignItems: 'center', overflow: 'hidden' }}>
												<MediumAvatar
													image={user?.userInfo.some?.avatar.url ? ipfsUrl(user?.userInfo.some?.avatar.url) : ''}
												/>
												<PreTitle noWrap>{user?.userInfo.some?.displayName}</PreTitle>
											</Box>
											<Paragraph2 whiteSpace="nowrap" color="text.secondary">
												{differenceDate(Number(post.createdAt))}
											</Paragraph2>
										</Box>
									)}
								</>
							}
							numberLinesToDisplay={numberLinesToDisplay}
							onChange={value => field.onChange(value)}
							onUploadVideo={value => {
								urls.push(value);
								setUrls(urls);
							}}
							onUploadImage={value => {
								urls.push(value);
								setUrls(urls);
							}}
							errorMessage={fieldState.error?.message}
						/>
					)}
				/>
				{!readOnly && (
					<Box
						sx={theme => ({
							marginTop: 3,
							width: '100%',
							backgroundColor: theme.palette.dark[500],
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'flex-start',
							padding: 1.5,
							border: `${theme.spacing(0.125)} solid ${theme.palette.border.subtle}`,
							borderRadius: 1.5
						})}
					>
						<Box
							sx={theme => ({
								width: '100%',
								display: 'flex',
								justifyContent: 'flex-start',
								alignItems: 'center',
								gap: 1,
								paddingBottom: 1.5,
								borderBottom: `${theme.spacing(0.125)} solid ${theme.palette.border.subtle}`
							})}
						>
							<PrimaryButton
								loading={isSubmitting}
								onClick={() => {
									isDraftRef.current = false;
									formRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
								}}
							>
								{isEditPost && !isSaveDraftBtnShown ? 'Edit' : 'Create'}
							</PrimaryButton>
							{isSaveDraftBtnShown && (
								<SecondaryButton
									disabled={isSubmitting}
									onClick={() => {
										isDraftRef.current = true;
										formRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
									}}
								>
									Save draft
								</SecondaryButton>
							)}
						</Box>
						<Box
							sx={{
								marginTop: 1.5,
								width: '100%'
							}}
						>
							<Checkbox disabled={isSubmitting} name="notify" label="Notify me about replies by email" />
						</Box>
					</Box>
				)}
			</Box>
		</Form>
	);
};
