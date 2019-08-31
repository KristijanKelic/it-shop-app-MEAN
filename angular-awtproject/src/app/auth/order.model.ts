import { Product } from '../product/product.model';

export interface Order {
  _id: string;
  user: { email: string; userId: string };
  products: Product[];
  createdAt: Date;
}
