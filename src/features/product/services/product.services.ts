import type { TypeProductInfo } from '../types/product.types';

export const formatProductPayload = (
  data: TypeProductInfo
): TypeProductInfo => {
  const stock = Number(data.stock) || 0;

  return {
    title: data.title?.trim() || '',
    description: data.description?.trim() || '',
    category: data.category || '',
    price: Number(data.price) || 0,
    discountPercentage: Number(data.discountPercentage) || 0,
    rating: Number(data.rating) || 0,
    stock,
    tags: data.tags || [],
    brand: data.brand?.trim() || '',
    sku: data.sku?.trim() || '',
    weight: Number(data.weight) || 0,
    dimensions: {
      width: Number(data.dimensions?.width) || 0,
      height: Number(data.dimensions?.height) || 0,
      depth: Number(data.dimensions?.depth) || 0,
    },
    warrantyInformation: data.warrantyInformation || '',
    shippingInformation: data.shippingInformation || '',
    availabilityStatus: stock > 0 ? 'In Stock' : 'Out of Stock',
    reviews: data.reviews || [],
    returnPolicy: data.returnPolicy || '',
    minimumOrderQuantity: Number(data.minimumOrderQuantity) || 1,
    meta: {
      createdAt: data.meta?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      barcode: data.meta?.barcode || '',
      qrCode: data.meta?.qrCode || '',
    },
    thumbnail: data.thumbnail || '',
    images:
      Array.isArray(data.images) && data.images.length > 0 ? data.images : [],
  };
};
