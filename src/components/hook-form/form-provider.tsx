import type { UseFormReturn } from 'react-hook-form';

import { FormProvider as RHFForm } from 'react-hook-form';

// ----------------------------------------------------------------------

export type FormProps<TFormValues extends Record<string, unknown>> = {
  onSubmit?: () => void;
  children: React.ReactNode;
  methods: UseFormReturn<TFormValues>;
};

export function Form<TFormValues extends Record<string, unknown>>({ 
  children, 
  onSubmit, 
  methods 
}: FormProps<TFormValues>) {
  return (
    <RHFForm {...methods}>
      <form onSubmit={onSubmit} noValidate autoComplete="off">
        {children}
      </form>
    </RHFForm>
  );
}
