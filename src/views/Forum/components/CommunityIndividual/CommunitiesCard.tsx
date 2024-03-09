import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, BoxProps, ButtonBase, Collapse, Skeleton, Stack } from '@mui/material';
import { LargeAvatar } from 'src/components/Avatar';
import { ButtonMediumText, H4Title } from 'src/components/Typography';
import { StandaloneInputField } from 'src/components/InputField';
import { useForums } from 'src/hooks';
import { ipfsUrl } from 'src/helpers/ipfs.helpers';
import { useDevice } from 'src/hooks/useDevice';
import { SecondaryButton } from 'src/components/Button';
import { sortForumsByKeyword } from 'src/helpers/sort.helpers';
import { NotFound } from 'src/components/NotFound';
import { ErrorMessage } from 'src/components/ErrorMessage';
import { ListSkeleton } from 'src/components/Skeleton';

export const CommunitiesCard = ({ sx, ...props }: BoxProps) => {
	const { id: communityId } = useParams();
	const navigate = useNavigate();
	const { data: forums, isLoading, error: isError } = useForums();
	const [searchValue, setSearchValue] = useState('');
	const { iXLg, iMid } = useDevice();
	const [isShowExpandableSection, setIsShowExpandableSection] = useState(iXLg && !iMid ? false : true);

	const filteredForums = useMemo(() => {
		if (!forums) return [];
		const tmpForums = forums.filter(forum => forum.title.toLowerCase().includes(searchValue));
		return sortForumsByKeyword(tmpForums, 'popular').slice(0, 15);
	}, [forums, searchValue]);

	useEffect(() => {
		function handleResize() {
			if (!iXLg) return;
			setIsShowExpandableSection(iMid);
		}

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, [iXLg, iMid]);

	const toggleCollapse = () => {
		setIsShowExpandableSection(prev => !prev);
	};

	const isExandableCanShown = !iXLg || iMid;

	const isBlockHidden = (isError || !filteredForums.length) && !isExandableCanShown && !isLoading;

	return (
		<Box
			{...props}
			sx={{
				position: 'relative',
				height: 'fit-content',
				background: theme => theme.palette.dark[500],
				borderRadius: 1,
				py: 2,
				display: isBlockHidden ? 'none' : 'flex',
				width: { xs: 'max-content', lg: 'initial' },
				'& .MuiCollapse-wrapperInner': {
					width: '100%'
				},
				...sx
			}}
		>
			<Collapse in={isShowExpandableSection} orientation="horizontal" collapsedSize="64px">
				<>
					{isExandableCanShown && (
						<Stack
							sx={{
								padding: theme => theme.spacing(0, 2),
								gap: 1,
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'space-between'
							}}
						>
							{isShowExpandableSection && (
								<H4Title maxWidth={{ xs: 'initial', lg: '130px' }}> Popular Communities </H4Title>
							)}
							<SecondaryButton
								size="small"
								onClick={toggleCollapse}
								startIcon={isShowExpandableSection ? 'chevronLeft' : 'chevronRight'}
							/>
						</Stack>
					)}
					{isShowExpandableSection && (
						<Box px={2} mt={2.5}>
							<StandaloneInputField
								name="search"
								startIcon="search"
								value={searchValue}
								placeholder="Search"
								onChange={e => setSearchValue(e.target.value)}
							/>
						</Box>
					)}
					<Stack
						gap={1}
						sx={{
							maxWidth: { xs: 'initial', lg: '233px' },
							width: { xs: 'calc(100vw - 37px)', sm: 'calc(100vw - 48px)', lg: '233px' },
							mt: (isError || !filteredForums.length || !isExandableCanShown) && !isShowExpandableSection ? 0 : 2.5
						}}
					>
						{isError && isShowExpandableSection ? (
							<ErrorMessage description="There was an error while loading" />
						) : isLoading ? (
							<ListSkeleton numberOfItems={4} gap={1.5}>
								<Stack direction="row" padding={theme => theme.spacing(0, 2)} gap={1} alignItems="center">
									<Skeleton variant="circular" width={32} height={32} />
									{isShowExpandableSection && <Skeleton variant="text" width="100%" height={25} />}
								</Stack>
							</ListSkeleton>
						) : filteredForums.length ? (
							filteredForums.map(forum => {
								const isActive = forum.idx === communityId;
								return (
									<ButtonBase
										key={forum.idx}
										sx={theme => ({
											overflow: 'hidden',
											justifyContent: 'flex-start',
											alignItems: 'center',
											gap: 1,
											padding: theme.spacing(0.5, 2),
											position: 'relative'
										})}
										onClick={() => {
											navigate(`/forum/communityindividual/${forum.idx}`, {
												state: { isComunityIndividualPage: true }
											});
										}}
									>
										<LargeAvatar
											image={ipfsUrl(forum.avatar.some.url)}
											sx={{
												'&::after': {
													content: '""',
													position: 'absolute',
													inset: 0,
													padding: theme => theme.spacing(0.125),
													borderRadius: '50%',
													WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
													WebkitMaskComposite: 'xor',
													background: isActive ? theme => theme.palette.gradient2.main : 'transparent',
													maskComposite: 'exclude'
												}
											}}
										/>
										{isShowExpandableSection && (
											<ButtonMediumText
												sx={{
													'.MuiButtonBase-root:hover &': {
														color: theme => theme.palette.text.secondary
													}
												}}
												noWrap
											>
												{forum.title}
											</ButtonMediumText>
										)}
										{isActive && (
											<Box
												sx={theme => ({
													width: theme.spacing(0.25),
													position: 'absolute',
													background: theme.palette.gradient1.main,
													height: '100%',
													left: 0,
													top: 0
												})}
											/>
										)}
									</ButtonBase>
								);
							})
						) : isShowExpandableSection ? (
							<NotFound description="No communities" />
						) : (
							<></>
						)}
					</Stack>
				</>
			</Collapse>
		</Box>
	);
};
