export interface User {
  _id?: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  cart: [{ itemId: string; quantity: number }];
}
