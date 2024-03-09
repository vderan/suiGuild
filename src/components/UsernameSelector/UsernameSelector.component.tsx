import { SelectAutocomplete } from '../SelectAutocomplete';
import Box from '@mui/material/Box';
import { Paragraph2 } from '../Typography';
import { Option } from '../SelectAutocomplete/SelectAutocomplete.types';

export const UsernameSelector = ({
	usernames,
	onChange,
	disabled = false,
	isLoading = false,
	name = 'username'
}: {
	usernames: string[];
	name?: string;
	disabled?: boolean;
	isLoading?: boolean;
	onChange?: (event: React.SyntheticEvent, value: Option | null) => void;
}) => {
	return (
		<SelectAutocomplete
			options={usernames.map(username => ({
				id: username,
				label: username
			}))}
			label="Type username(s)"
			name={name}
			placeholder="Search"
			onChange={onChange}
			disabled={disabled}
			isLoading={isLoading}
			renderOption={(props, option) => {
				return <UserInfo key={option.id} props={props} username={option.label} />;
			}}
		/>
	);
};

const UserInfo = ({ username, props }: { username: string; props: React.HTMLAttributes<HTMLLIElement> }) => {
	return (
		<Box component="li" {...props}>
			<Paragraph2 noWrap>{username}</Paragraph2>
		</Box>
	);
};
