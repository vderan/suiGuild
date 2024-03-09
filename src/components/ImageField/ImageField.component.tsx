import { Box } from '@mui/material';
import { Controller } from 'react-hook-form';
import { ipfsUrl } from 'src/helpers/ipfs.helpers';

const images = [
	'QmPVcTPgoRJTUx9EBne7S4o2r8FkRJBEiKChH2gQtA8Hem',
	'QmVqHFNjsUccP9H42FbYT9WTzX6qXAno4BHLmBZNxSbYxT',
	'QmbnmpCCzkKK9qMT1wZHuoskQaueNDSNfV6HdKG82RsB3Y',
	'QmduBEfemGYvw8q53nezsRc3pbPMxFqkZtdyNru7ogh5Ee',
	'QmXg9z5zXpqVKiWuTkN7GpF4rZZCECbCRJfGsqSrHNrYFS',
	'QmPA1Pvn6TEhAfbuSepw1X2JFFEJkZ8uoU2drhaWrk9PEf',
	'QmXFAwhoxciL5fQFTSSRft8Qi1Yq1cwgbrwYNMpi22ZJVt',
	'QmaFHe6mNhRQAj45eYBqswd6BoNfLyLkTqjx9KSiUF7fCR',
	'QmfED6tGW7PQgSpcCiyUQku85m3ckY7FXAoaGvdca5pvSW',
	'QmTwTcLa7yQ6zjJXgmTBwm2mHWb3re6AjbUjX1mFFNViVH',
	'QmcGFWn2ZZKVcQ8LyCr3eSi1YeWsSUBhBvJ148NMPkoYDH',
	'QmSTLkRJVcCSv1WH9GQEBGK9wZUzrppwMLcdw5PAKFXKzk',
	'QmdvvbVjYhdPrnVcRnATsXBCh9sunX2uNxfCNRuMhkYc12',
	'QmcxKPDxoumWGfK46SU5YR6HcRf3KideAmGA9vHxehLzNT'
];

export const ImageField = ({ name, disabled = false }: { name: string; disabled?: boolean }) => {
	return (
		<Controller
			name={name}
			render={({ field }) => {
				return (
					<Box
						sx={{
							display: 'flex',
							flexWrap: 'wrap',
							gap: theme => ({ xs: theme.spacing(1.5, 0.75), sm: theme.spacing(1.5, 1.125) })
						}}
					>
						{images.map(i => {
							const image = ipfsUrl(i);
							return (
								<Box
									key={i}
									component="img"
									src={image}
									sx={theme => ({
										width: theme.spacing(4),
										height: theme.spacing(4),
										borderRadius: 1,
										opacity: disabled ? 0.5 : 1,
										cursor: disabled ? 'default' : 'pointer',
										objectFit: 'cover',
										outline:
											field.value === image ? `${theme.spacing(0.25)} solid ${theme.palette.primary[900]}` : 'none',
										border: field.value === image ? 'none' : `${theme.spacing(0.125)} solid ${theme.palette.dark[500]}`
									})}
									onClick={() => !disabled && field.onChange(image)}
								/>
							);
						})}
					</Box>
				);
			}}
		/>
	);
};
