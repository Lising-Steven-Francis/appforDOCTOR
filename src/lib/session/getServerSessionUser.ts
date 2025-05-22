"use server";

import type { User } from '@/auth/types';

// lib/session/getServerSessionUser.ts
import { auth } from '@/auth';

export async function getServerSessionUser(): Promise<User | null> {
  const session = await auth();
  if (!session?.user) return null;
  
  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    image: session.user.image,
    role: 'admin',
  };
}
