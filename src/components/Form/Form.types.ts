import { FormGroupProps } from '@mui/material';
import { CSSProperties, ReactNode, Ref } from 'react';
import { DefaultValues, FieldValues, Mode, SubmitHandler, UseFormReturn } from 'react-hook-form';
import * as z from 'zod';

export interface IFormProps<T extends FieldValues> {
	/**
	 * Function to execute on form submit
	 */
	action?: SubmitHandler<T>;
	/**
	 * Validator schema
	 */
	schema?: z.ZodTypeAny;
	/**
	 * Default values in a form
	 */
	defaultValues: DefaultValues<T>;
	/**
	 * Option to configure the validation before onSubmit event
	 */
	mode?: Mode;
	/**
	 * Render all JSX elements with this prop. Using this prop will make react hook form props
	 * available as parameters to use, example `getValues, formState`.
	 *
	 * Using this prop will also ignore direct children,
	 */
	render?: (props: UseFormReturn<T>) => JSX.Element;
	/**
	 * Optional ref. This is necessary if you want to submit the form outside the form component
	 * itself, example a Dialog component.
	 */
	myRef?: Ref<HTMLFormElement>;
	children?: ReactNode;
	formStyles?: CSSProperties;
	formGroupProps?: FormGroupProps;
}
