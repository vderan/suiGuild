import { Box, ButtonBase, Grid, Link, Stack, styled } from '@mui/material';
import { H3Title, Paragraph2 } from 'src/components/Typography';
import { IForum } from 'src/contexts';
import pluralize from 'pluralize';
import { PrimaryEditor } from 'src/components/TextEditor';
import { Dialog } from 'src/components/Dialog';
import { useRef, useState } from 'react';
import { Form } from 'src/components/Form';
import { communityAboutSchema } from 'src/schemas/community-social.schema';
import { ICommunitySocial, communitySocials } from 'src/constants/socials.constants';
import { InputField } from 'src/components/InputField';
import { useGilder } from 'src/hooks/useGilder';
import { Icon } from 'src/components/Icon';
import { Controller } from 'react-hook-form';
import { EditorField } from 'src/components/EditorField';
import { MembersModal } from './MembersModal';
import { ErrorHandler } from 'src/helpers';
import { SecondaryButton } from 'src/components/Button';

interface CommunityAboutForm {
	description: string;
	links: {
		twitter: string;
		discord: string;
		tiktok: string;
		twitch: string;
		medium: string;
		youtube: string;
		telegram: string;
		instagram: string;
		opensea: string;
		github: string;
	};
}

const DetailBlock = styled(Stack)(({ theme }) => ({
	gap: theme.spacing(0.5),
	overflow: 'hidden',
	flex: 1
}));

export const AboutCard = ({ forum, isOwner }: { forum: IForum; isOwner: boolean }) => {
	const [isModalShown, setIsModalShown] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const linkFormRef = useRef<null | HTMLFormElement>(null);
	const { editCommunity } = useGilder();
	const [isMembersModalShown, setIsMembersModalShown] = useState(false);

	const socials = (() => {
		if (!forum?.links) return {};

		return JSON.parse(forum.links);
	})();

	const connectedSocials: ICommunitySocial[] = Object.keys(socials).flatMap(key => {
		const social = communitySocials.find(social => social.id === key);
		const url = socials[key];
		if (!social || !url) return [];
		return {
			id: social.id,
			icon: social.icon,
			label: social.label,
			url
		};
	});

	const handleEditCommunityAbout = async (data: CommunityAboutForm) => {
		setIsSubmitting(true);
		try {
			await editCommunity({
				idx: Number(forum.idx),
				communityData: {
					avatar: forum.avatar.some.url,
					cover: forum.coverImage.some.url,
					title: forum.title,
					description: data.description,
					rules: forum.rules,
					links: JSON.stringify(data.links),
					resources: forum.resources
				}
			});
			setIsModalShown(false);
		} catch (err) {
			ErrorHandler.process(err);
		}
		setIsSubmitting(false);
	};

	return (
		<>
			<Stack gap={2}>
				<Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
					<H3Title> About </H3Title>
					{isOwner && <SecondaryButton startIcon="edit" size="small" onClick={() => setIsModalShown(true)} />}
				</Stack>
				<Stack gap={1.5}>
					<PrimaryEditor
						editorSx={{ '.w-e-text-container [data-slate-editor] p': { margin: 0 } }}
						readOnly
						readContent={forum?.description}
					/>
					<Stack direction="row" sx={{ gap: 2, justifyContent: 'space-around' }}>
						<DetailBlock>
							<H3Title noWrap title={forum?.numPost}>
								{forum?.numPost}
							</H3Title>
							<Paragraph2 color="text.secondary">{pluralize('post', Number(forum?.numPost))}</Paragraph2>
						</DetailBlock>
						<ButtonBase
							sx={{ alignItems: 'flex-start', flexDirection: 'column', gap: 0.5, overflow: 'hidden', flex: 1 }}
							onClick={() => setIsMembersModalShown(true)}
						>
							<H3Title noWrap title={String(forum?.followers.length)} width="100%" textAlign="left">
								{forum?.followers.length || 0}
							</H3Title>
							<Paragraph2 color="text.secondary">{pluralize('member', forum?.followers.length)}</Paragraph2>
						</ButtonBase>
						<DetailBlock>
							<H3Title noWrap title={forum?.numComment}>
								{forum?.numComment}
							</H3Title>
							<Paragraph2 color="text.secondary">{pluralize('comment', Number(forum?.numComment))}</Paragraph2>
						</DetailBlock>
					</Stack>
					{connectedSocials.length ? (
						<Box display="flex" gap={1} flexWrap="wrap">
							{connectedSocials.map(social => (
								<Link
									href={social.url}
									key={social.url}
									target="_blank"
									className="social-link"
									sx={{
										display: 'flex',
										textDecoration: 'none',
										lineHeight: 'normal'
									}}
								>
									<Icon
										icon={social.icon}
										fontSize="large"
										sx={{
											'.social-link:hover &': {
												'path[fill]': {
													fill: 'url(#svgGradient1)'
												},
												'path[stroke]': {
													stroke: 'url(#svgGradientStroke)'
												}
											}
										}}
									/>
								</Link>
							))}
						</Box>
					) : (
						<></>
					)}
				</Stack>
			</Stack>

			<Dialog
				title="About us"
				open={isModalShown}
				onClose={() => setIsModalShown(false)}
				onConfirmText="Save"
				onCancelText="Cancel"
				onConfirm={() => linkFormRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))}
				isConfirmLoading={isSubmitting}
				isCancelDisabled={isSubmitting}
			>
				<Form<CommunityAboutForm>
					action={handleEditCommunityAbout}
					defaultValues={{
						description: forum?.description,
						links: {
							twitter: socials.twitter,
							discord: socials.discord,
							tiktok: socials.tiktok,
							twitch: socials.twitch,
							medium: socials.medium,
							youtube: socials.youtube,
							telegram: socials.telegram,
							instagram: socials.instagram,
							opensea: socials.opensea,
							github: socials.github
						}
					}}
					schema={communityAboutSchema}
					myRef={linkFormRef}
				>
					<Controller
						name="description"
						render={({ field, fieldState }) => (
							<EditorField
								placeholder="Description"
								maxLength={500}
								value={field.value}
								editorHeight="150px"
								onChange={value => field.onChange(value)}
								errorMessage={fieldState.error?.message}
								isNeedImageUpload={false}
								isNeedVideoUpload={false}
								disabled={isSubmitting}
							/>
						)}
					/>
					<Grid container spacing={2}>
						{communitySocials.map(social => (
							<Grid item xs={6} key={social.icon}>
								<InputField
									name={`links.${social.id}`}
									label={social.label}
									placeholder={social.url}
									disabled={isSubmitting}
								/>
							</Grid>
						))}
					</Grid>
				</Form>
			</Dialog>
			<MembersModal forum={forum} isOpen={isMembersModalShown} onClose={() => setIsMembersModalShown(false)} />
		</>
	);
};
