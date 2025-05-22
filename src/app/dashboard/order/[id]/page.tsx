import type { Metadata } from 'next';
import type { IOrderItem } from 'src/types/order';

import { CONFIG } from 'src/global-config';
import { _orders } from 'src/_mock/_order';
import { OrderDetailsView } from 'src/sections/order/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Order details | Dashboard - ${CONFIG.appName}` };

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  try {
    const { id } = await params;
    const currentOrder = _orders.find((order) => order.id === id);

    if (!currentOrder) {
      throw new Error('Order not found');
    }

    return <OrderDetailsView order={currentOrder} />;
  } catch (error) {
    console.error('Error loading order:', error);
    throw error;
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
    const data: IOrderItem[] = CONFIG.isStaticExport ? _orders : _orders.slice(0, 1);

    return data.map((order) => ({
      id: order.id,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}
