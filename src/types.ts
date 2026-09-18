export type OrderStatus = 'Completed' | 'Processing' | 'Shipped' | 'Pending' | 'Cancelled';
export type AcquisitionSource = 'Direct' | 'Social' | 'Search' | 'Referrals';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  unitsSold: number;
  revenue: number;
  profitMargin: number;
  trend: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  country: string;
  city: string;
  orders: number;
  totalSpent: number;
  isRepeatCustomer: boolean;
  customerSince: string;
  acquisitionSource: AcquisitionSource;
}

export interface Order {
  id: string;
  productId: string;
  product: string;
  customerId: string;
  customer: string;
  amount: number;
  date: string;
  status: OrderStatus;
}

export interface RevenueRecord {
  date: string;
  revenue: number;
  orders: number;
}

export interface DashboardData {
  products: Product[];
  customers: Customer[];
  orders: Order[];
  revenue: RevenueRecord[];
}
