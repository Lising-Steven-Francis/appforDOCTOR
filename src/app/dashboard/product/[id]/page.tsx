import type { Metadata } from 'next';
import type { IProductItem } from 'src/types/product';

import { CONFIG } from 'src/global-config';
import axios, { endpoints } from 'src/lib/axios';
import { getProduct } from 'src/actions/product-ssr';
import { ProductDetailsView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

export const metadata: Metadata = {
  title: `Product details | Dashboard - ${CONFIG.appName}`,
};


type Props = {
  params: Promise<{ id: string }> ;
};

export default async function Page({ params }: Props) {
  try {
    const { id } = await params;

    const { product } = await getProduct(id);

    if (!product) {
      // If product not found, you can throw or return notFound()
      throw new Error('Product not found');
    }

    return <ProductDetailsView product={product} />;
  } catch (error) {
    console.error('Error loading product:', error);
    throw error;
  }
}

// ----------------------------------------------------------------------

export async function generateStaticParams() {
  try {
    const res = await axios.get(endpoints.product.list);
    const data: IProductItem[] = CONFIG.isStaticExport
      ? res.data.products
      : res.data.products.slice(0, 1);

    return data.map((product) => ({
      id: product.id,
    }));
  } catch (error) {
    console.error('Error in generateStaticParams:', error);
    return [];
  }
}
