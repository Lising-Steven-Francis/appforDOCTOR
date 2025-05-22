'use client';

import { AccountSocials } from '../account-socials';

import { _userAbout } from 'src/_mock';

// ----------------------------------------------------------------------

export function AccountSocialsView() {
  return <AccountSocials socialLinks={_userAbout.socialLinks} />;
}
