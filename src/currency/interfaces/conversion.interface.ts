export interface Conversion {
  userId: string;
  from: string;
  to: string;
  amount: number;
  result: number;
  rate: number;
  date: string;
  createdAt: Date;
}
