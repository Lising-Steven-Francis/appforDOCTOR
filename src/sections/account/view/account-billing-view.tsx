'use client';

import { AccountBilling } from '../account-billing';

import { _userPlans, _userPayment, _userInvoices, _userAddressBook } from 'src/_mock';

// ----------------------------------------------------------------------

export function AccountBillingView() {
  return (
    <AccountBilling
      plans={_userPlans}
      cards={_userPayment}
      invoices={_userInvoices}
      addressBook={_userAddressBook}
    />
  );
}
