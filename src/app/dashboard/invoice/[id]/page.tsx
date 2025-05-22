import type { Metadata } from 'next';
import type { IInvoice } from 'src/types/invoice';

import { CONFIG } from 'src/global-config';
import { _invoices } from 'src/_mock/_invoice';
import { InvoiceDetailsView } from 'src/sections/invoice/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Invoice details | Dashboard - ${CONFIG.appName}` };

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  try {
    const { id } = await params;
    const currentInvoice = _invoices.find((invoice) => invoice.id === id);

    if (!currentInvoice) {
      throw new Error('Invoice not found');
    }

    return <InvoiceDetailsView invoice={currentInvoice} />;
  } catch (error) {
    console.error('Error loading invoice:', error);
    return [];
  }
}

// ----------------------------------------------------------------------

/**
 * Static Exports in Next.js
 *
 * 1. Set `isStaticExport = true` in `next.config.{mjs|ts}`.
 * 2. This allows `generateStaticParams()` to pre-render dynamic routes at build time.
 *
 * For more details, see:
 * https://nextjs.org/docs/app/building-your-application/deploying/static-exports
 *
 * NOTE: Remove all "generateStaticParams()" functions if not using static exports.
 */
export async function generateStaticParams() {
  try {
    const data: IInvoice[] = CONFIG.isStaticExport ? _invoices : _invoices.slice(0, 1);

      return data.map((invoice) => ({
      id: invoice.id,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}
