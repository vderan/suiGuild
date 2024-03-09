import { Box, ButtonBase } from '@mui/material';
import React from 'react';
import { useState } from 'react';
import { ButtonMediumText } from '../Typography';

export const ReadMore = ({ children, maxLength = 300 }: { children: JSX.Element; maxLength?: number }) => {
	const [isReadMoreClicked, setIsReadMoreClicked] = useState(false);
	const text = children.props.children;

	const isNeedReadMore = text.length > maxLength;
	return (
		<Box>
			{React.cloneElement(children, {
				children: isNeedReadMore && !isReadMoreClicked ? `${text.slice(0, maxLength)}...` : text
			})}

			{isNeedReadMore && (
				<ButtonBase
					sx={{
						width: 'max-content',
						marginLeft: 0.5
					}}
					onClick={() => setIsReadMoreClicked(!isReadMoreClicked)}
				>
					<ButtonMediumText
						sx={{
							background: theme => theme.palette.gradient1.main,
							WebkitBackgroundClip: 'text',
							backgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							WebkitBoxDecorationBreak: 'clone',
							lineHeight: 'inherit'
						}}
					>
						{isReadMoreClicked ? 'Show less' : 'Show more'}
					</ButtonMediumText>
				</ButtonBase>
			)}
		</Box>
	);
};
