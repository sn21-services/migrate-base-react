export type ProductReview = {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
};

export type ProductItem = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand?: string;
  sku: string;
  weight: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: ProductReview[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: {
    createdAt: string;
    updatedAt: string;
    barcode: string;
    qrCode: string;
  };
  thumbnail: string;
  images: string[];
};

export type TypeProductInfo = Omit<ProductItem, 'id'>;

export type ProductListResponse = {
  products: ProductItem[];
  total: number;
  skip: number;
  limit: number;
};

export type ProductQueryParams = {
  q?: string;
  limit?: number;
  skip?: number;
  sortBy?: 'title' | 'price' | 'rating';
  order?: 'asc' | 'desc';
  select?: string;
};
