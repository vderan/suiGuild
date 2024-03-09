import { useState } from 'react';
import { Box, ButtonBase, Collapse, Stack } from '@mui/material';
import { Label, Paragraph3 } from 'src/components/Typography';
import { Icon } from 'src/components/Icon';

export const RuleCollapseCard = ({ title, content }: { title: string; content: string }) => {
	const [isShowExpandableSection, setIsShowExpandableSection] = useState(false);
	const handleChange = () => {
		setIsShowExpandableSection(prev => !prev);
	};

	return (
		<Box
			sx={theme => ({
				background: theme.palette.dark[700],
				borderRadius: 1,
				padding: 1.5
			})}
		>
			<Stack
				component={ButtonBase}
				sx={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
					gap: 1,
					width: '100%'
				}}
				onClick={handleChange}
			>
				<Label title={title} noWrap>
					{title}
				</Label>
				<Icon icon={isShowExpandableSection ? 'chevronUp' : 'chevronDown'} fontSize="small" />
			</Stack>
			<Collapse in={isShowExpandableSection}>
				<Box sx={{ marginTop: theme => theme.spacing(1) }}>
					<Paragraph3 sx={{ wordBreak: 'break-word' }}>{content}</Paragraph3>
				</Box>
			</Collapse>
		</Box>
	);
};
