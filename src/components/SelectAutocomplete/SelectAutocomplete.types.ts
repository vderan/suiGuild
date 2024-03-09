interface SelectAutocompleteDefault {
	name: string;
	label?: string;
	options: Option[];
	required?: boolean;
	disabled?: boolean;
	placeholder?: string;
	fullWidth?: boolean;
	isLoading?: boolean;
	renderOption?: (props: React.HTMLAttributes<HTMLLIElement>, option: Option) => React.ReactNode;
	PaperComponent?: React.JSXElementConstructor<React.HTMLAttributes<HTMLElement>>;
}

export interface SelectAutocompleteMultipleProps extends SelectAutocompleteDefault {
	onChange?: (value: Option[]) => void;
}

export interface SelectAutocompleteSingleProps extends SelectAutocompleteDefault {
	onChange?: (event: React.SyntheticEvent, value: Option | null) => void;
}

export interface Option {
	id: string;
	label: string;
	groupBy?: string;
	secondaryLabel?: string;
}
