import { countries } from 'src/constants/country.constants';
import { SelectAutocomplete } from '../SelectAutocomplete';
import Box from '@mui/material/Box';

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
						src={`https://storage.googleapis.com/dycr-web/image/flags/${country.id.toLowerCase()}.png`}
						srcSet={`https://storage.googleapis.com/dycr-web/image/flags/${country.id.toLowerCase()}.png 2x`}
						alt={country.label}
					/>
					{country.label}
				</Box>
			)}
		/>
	);
};
