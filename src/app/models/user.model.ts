import { Product } from './product.model';

export interface CartItem {
  product: Product;
  quantity: number;
}
export interface User {
    id:number;
    email:string;
    name:string;
    password?:string;
    role:'admin'|'user';
    token?:string;
}