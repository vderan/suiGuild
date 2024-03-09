import { styled } from '@mui/system';
import { Pagination, PaginationItem } from '@mui/material';
import { IPaginationProps } from './Pagination.types';
import { icons } from 'src/components/icons';

export const CustomPagination = ({ count, page, onChange }: IPaginationProps) => {
	const handlePagenationChange = (event: React.ChangeEvent<unknown>, value: number) => {
		onChange(value);
		window.scrollTo(0, 0);
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
	border: `${theme.spacing(0.125)} solid ${theme.palette.border.default}`,
	borderRadius: theme.spacing(1),
	backdropFilter: `blur(${theme.spacing(2.75)})`,
	'&.Mui-selected': {
		border: 'none',
		background: theme.palette.gradient2.main
	},
	'& .MuiSvgIcon-root': {
		color: theme.palette.tertiary.main
	}
}));
