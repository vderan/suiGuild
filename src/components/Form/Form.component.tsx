import { zodResolver } from '@hookform/resolvers/zod';
import FormGroup from '@mui/material/FormGroup';
import { FieldValues, FormProvider, useForm } from 'react-hook-form';
import { IFormProps } from './Form.types';

export function Form<T extends FieldValues>({
	children,
	action,
	schema,
	defaultValues,
	mode = 'onBlur',
	render,
	myRef,
	formGroupProps,
	formStyles
}: IFormProps<T>) {
	const methods = useForm<T>({
		resolver: schema ? zodResolver(schema) : undefined,
		defaultValues,
		mode,
		shouldFocusError: true
	});

	return (
		<FormProvider {...methods}>
			<form
				onSubmit={action && methods.handleSubmit(action)}
				onReset={() => {
					methods.reset(), setTimeout(() => methods.clearErrors(), 100);
				}}
				ref={myRef}
				style={{ width: '100%', ...formStyles }}
			>
				<FormGroup
					{...formGroupProps}
					sx={{
						width: '100%',
						flexWrap: 'nowrap',
						gap: theme => theme.spacing(2.5),
						...(formGroupProps?.sx ?? {})
					}}
				>
					{render ? render(methods) : children}
				</FormGroup>
			</form>
		</FormProvider>
	);
}
