import { styled } from '@mui/system';
import { Pagination, PaginationItem } from '@mui/material';
import { IPaginationProps } from './Pagination.types';
import { icons } from 'src/components/icons';
import { useScroll } from 'src/hooks';

export const CustomPagination = ({ count, page, onChange }: IPaginationProps) => {
	const { scrollToTop } = useScroll();

	const handlePagenationChange = (event: React.ChangeEvent<unknown>, value: number) => {
		onChange(value);
		scrollToTop();
	};

	return (
		<Pagination
			count={count}
			siblingCount={0}
			onChange={handlePagenationChange}
			page={page}
			renderItem={item => (
				<PaginationItemContainer slots={{ previous: icons.chevronLeft, next: icons.chevronRight }} {...item} />
			)}
		/>
	);
};

const PaginationItemContainer = styled(PaginationItem)(({ theme }) => ({
	width: theme.spacing(4.5),
	height: theme.spacing(4.5),
	display: 'flex',
	justifyContent: 'center',
	fontSize: theme.spacing(1.75),
	fontFamily: 'Clash Display',
	fontWeight: '600',
	padding: theme.spacing(1),
	border: `${theme.spacing(0.125)} solid ${theme.palette.border.subtle}`,
	background: theme.palette.surface.buttonBg,
	borderRadius: theme.spacing(1),
	color: theme.palette.text.primary,
	'&.Mui-selected': {
		border: 'none',
		background: theme.palette.gradient.secondary,
		color: theme.palette.buttonText.white
	},
	'& .MuiSvgIcon-root': {
		color: theme.palette.border.highlight
	}
}));
