import { countries } from 'src/constants/country.constants';
import { SelectAutocomplete } from '../SelectAutocomplete';
import Box from '@mui/material/Box';
import { FLAGS_API } from 'src/constants/env.constants';

export const CountrySelector = () => {
	return (
		<SelectAutocomplete
			options={countries.map(country => ({
				id: country.code,
				label: country.label
			}))}
			label="Country"
			name="country"
			placeholder="Choose a country"
			renderOption={(props, country) => (
				<Box component="li" sx={{ '& > img': { mr: 1, flexShrink: 0 } }} {...props}>
					<img
						loading="lazy"
						width="20"
						src={`${FLAGS_API}/${country.id.toLowerCase()}.png`}
						srcSet={`${FLAGS_API}/${country.id.toLowerCase()}.png 2x`}
						alt={country.label}
					/>
					{country.label}
				</Box>
			)}
		/>
	);
};
