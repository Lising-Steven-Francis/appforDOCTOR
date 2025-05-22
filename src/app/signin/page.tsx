import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';
import { NextAuthSignInView } from 'src/auth/view/nextAuth';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Sign in | NextAuth - ${CONFIG.appName}` };

export default function Page() {
  return <NextAuthSignInView />;
}
