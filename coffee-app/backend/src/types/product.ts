export interface IProduct {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
  roastLevel?: string | null;
  grind?: string | null;
  size?: string | null;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface IProductInput {
  name: string;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
  roastLevel?: string | null;
  grind?: string | null;
  size?: string | null;
  stock?: number;
}
