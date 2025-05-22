import type { Metadata } from 'next';
import type { IProductItem } from 'src/types/product';

import { CONFIG } from 'src/global-config';
import axios, { endpoints } from 'src/lib/axios';
import { getProduct } from 'src/actions/product-ssr';
import { ProductShopDetailsView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Product details - ${CONFIG.appName}` };

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  try {
    const { id } = await params;

    const { product } = await getProduct(id);

    if (!product) {
      throw new Error('Product not found');
    }

    return <ProductShopDetailsView product={product} />;
  } catch (error) {
    console.error('Error loading product:', error);
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
    // If not using static exports, return empty array
    if (!CONFIG.isStaticExport) {
      return [];
    }

    const res = await axios.get(endpoints.product.list);
    
    if (!res.data?.products) {
      console.warn('No products found in API response');
      return [];
    }

    return res.data.products.map((product: IProductItem) => ({
      id: product.id,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    // Return empty array instead of throwing to prevent build failure
    return [];
  }
}
