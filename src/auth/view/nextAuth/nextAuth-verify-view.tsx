'use client';

import { z as zod } from 'zod';
import Box from '@mui/material/Box';
import { useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormHead } from '@/auth/components/form-head';
import { checkTokenRequest } from '@/lib/action/verify';
import { FormReturnLink } from '@/auth/components/form-return-link';
import { FormResendCode } from '@/auth/components/form-resend-code';

import { paths } from 'src/routes/paths';
import { EmailInboxIcon } from 'src/assets/icons';
import { Form, Field } from 'src/components/hook-form';
// ----------------------------------------------------------------------

export type VerifySchemaType = zod.infer<typeof VerifySchema>;

export const VerifySchema = zod.object({
  code: zod
    .string()
    .min(1, { message: 'Code is required!' })
    .min(6, { message: 'Code must be at least 6 characters!' })
});

// ----------------------------------------------------------------------

export function NextAuthVerifyView({ token, email }: { token: string; email: string }) {

  const defaultValues: VerifySchemaType = {
    code: '',
  };

  const methods = useForm<VerifySchemaType>({
    resolver: zodResolver(VerifySchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {

    try {

        const res = await checkTokenRequest(email, token, Number(data.code));
            
        //responses 
        switch(res.success){
          case true:
            window.location.href = res.callbackUrl || paths.dashboard.root;
            break;
          case false:
            methods.setError('code', { message: res.message });
            break;
          default:
            methods.setError('code', { message: 'An unexpected error occurred. Please try again' });
            break;
        }  

    } catch (error) {
      console.error(error);
    }
  });

  const renderForm = () => (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
     {/*  <Field.Text
        name="email"
        label="Email address"
        placeholder="example@gmail.com"
        slotProps={{ inputLabel: { shrink: true } }}
      />
 */}
      <Field.Code name="code" />

      <Button
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Verify..."
      >
        Verify
      </Button>
    </Box>
  );

  return (
    <>
      <FormHead
        icon={<EmailInboxIcon />}
        title="Please check your email!"
        description={`We've emailed a 6-digit confirmation code. \nPlease enter the code in the box below to verify your email.`}
      />

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm()}
      </Form>

      <FormResendCode onResendCode={() => {}} value={0} disabled={false} />

      <FormReturnLink href={paths.auth.nextAuth.signIn} />
    </>
  );
}
