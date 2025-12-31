export interface IOrder {
  id: string;
  customerId: string;
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED';
  totalPrice: number;
  deliveryAddress: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  customizations?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderInput {
  totalPrice: number;
  deliveryAddress: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
    customizations?: string;
  }[];
}

export interface IOrderStatus {
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED';
}