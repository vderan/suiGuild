import MUICircularProgress, { CircularProgressProps } from '@mui/material/CircularProgress';
import { CIRCULAR_PROGRESS_SIZE } from 'src/constants/theme.constants';

export const CircularProgress = ({ size = CIRCULAR_PROGRESS_SIZE, ...props }: CircularProgressProps) => {
	return <MUICircularProgress size={size} {...props} />;
};
