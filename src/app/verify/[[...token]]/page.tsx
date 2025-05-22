import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';
import { NextAuthVerifyView } from 'src/auth/view/nextAuth';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Verify | Layout split - ${CONFIG.appName}` };

export default async function Page({ params }: { params: Promise<{ token?: string[] }> }) {
  const [token, email] = (await params).token ?? [];

  return <NextAuthVerifyView token={token} email={email} />;
}