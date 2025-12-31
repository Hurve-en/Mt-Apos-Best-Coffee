export interface IProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  category: string;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProductCustomization {
  id: string;
  productId: string;
  type: 'size' | 'milk' | 'extra';
  name: string;
  priceAdd: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProductInput {
  name: string;
  description?: string;
  price: number;
  image?: string;
  category: string;
}