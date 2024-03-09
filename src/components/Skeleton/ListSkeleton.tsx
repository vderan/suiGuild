import { Stack, StackProps } from '@mui/material';
import React from 'react';

export const ListSkeleton = ({
	numberOfItems,
	children,
	...props
}: { numberOfItems: number; children: JSX.Element } & StackProps) => {
	return (
		<Stack {...props}>
			{Array(numberOfItems)
				.fill(1)
				.map((_, index) => React.cloneElement(children, { key: index }))}
		</Stack>
	);
};
