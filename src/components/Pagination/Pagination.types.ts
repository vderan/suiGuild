export interface IPaginationProps {
	count: number;
	page: number;
	onChange: (value: number) => void;
}
