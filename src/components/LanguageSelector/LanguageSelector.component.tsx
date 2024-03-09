import { langs } from 'src/constants/country.constants';
import { SelectAutocomplete } from '../SelectAutocomplete';
import Box from '@mui/material/Box';

export const LanguageSelector = () => {
	return (
		<SelectAutocomplete
			options={langs.map(lang => ({
				id: lang.code,
				label: lang.name
			}))}
			label="Language"
			name="language"
			placeholder="Choose a language"
			renderOption={(props, lang) => {
				const countryCode = langs.find(i => i.code === lang.id)?.countryCode.toLowerCase();

				return (
					<Box component="li" sx={{ '& > img': { mr: 1, flexShrink: 0 } }} {...props}>
						<img
							loading="lazy"
							width="20"
							src={`https://storage.googleapis.com/dycr-web/image/flags/${countryCode}.png`}
							srcSet={`https://storage.googleapis.com/dycr-web/image/flags/${countryCode}.png 2x`}
							alt={lang.label}
						/>
						{lang.label}
					</Box>
				);
			}}
		/>
	);
};
