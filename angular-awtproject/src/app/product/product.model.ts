export interface Product {
  _id: string;
  title: string;
  content: string;
  image: string;
  category: string;
  price: number;
  userId: {
    name: string;
    surname: string;
    _id: string;
  };
}
