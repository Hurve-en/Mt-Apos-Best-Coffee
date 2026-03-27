export interface IOrder {
  id: number;
  userId: number;
  total: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderItem {
  id: number;
  orderId: number;
  productId: string;
  quantity: number;
  price: number;
  createdAt: Date;
}

export interface IOrderInput {
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
}

export interface IOrderStatus {
  status: string;
}
