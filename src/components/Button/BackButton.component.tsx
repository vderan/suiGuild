import { useNavigate } from 'react-router-dom';
import { ICustomButtonProps } from './Button.types';
import { SecondaryButton } from './SecondaryButton.component';
import { useDevice } from 'src/hooks/useDevice';

export const BackButton = ({ ...props }: ICustomButtonProps) => {
	const navigate = useNavigate();
	const { iMid } = useDevice();

	return (
		<>
			<SecondaryButton
				startIcon="chevronLeft"
				size="small"
				onClick={e => (props.onClick ? props.onClick(e) : navigate(-1))}
				sx={props.sx}
			>
				{!iMid && props.children}
			</SecondaryButton>
		</>
	);
};
