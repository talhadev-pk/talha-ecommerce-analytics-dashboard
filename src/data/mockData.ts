import type { AcquisitionSource, Customer, DashboardData, Order, OrderStatus, Product, RevenueRecord } from '../types';

const categories = ['Electronics', 'Accessories', 'Office', 'Audio', 'Wearables', 'Home'];
const productNames = [
  'Wireless Headphones','Smart Watch','Mechanical Keyboard','USB-C Hub','Laptop Stand','Portable SSD',
  'Bluetooth Speaker','Webcam Pro','Ergonomic Mouse','Desk Lamp','Charging Dock','Travel Adapter',
  'Noise Cancelling Buds','Monitor Light Bar','Tablet Stand','USB Microphone','Power Bank','Smart Plug',
  'Cable Organizer','Laptop Sleeve','4K Monitor','Wireless Charger','Drawing Tablet','Desk Mat',
  'Mini Projector','Fitness Tracker','Smart Scale','LED Strip Kit','Phone Gimbal','Compact Router',
  'Gaming Mouse','Keyboard Wrist Rest','HDMI Switch','Ethernet Adapter','Portable Fan','Air Purifier Mini',
  'Smart Doorbell','Digital Alarm Clock','Foldable Keyboard','Conference Speaker','Card Reader','USB-C Cable',
  'Magnetic Phone Mount','Desk Organizer','Surge Protector','Webcam Cover','Bluetooth Tracker','Reading Light',
  'Monitor Arm','Vertical Mouse','Stylus Pen','Tablet Keyboard','Portable Monitor','Smart Light Bulb',
  'Collapsible Stand','Headphone Stand','Micro SD Card','USB Flash Drive','Cleaning Kit','Cable Sleeve',
  'Power Strip','Laptop Riser','Wireless Presenter','Digital Timer','Smart Button'
];
const firstNames = ['Avery','Noah','Maya','Liam','Sofia','Ethan','Zara','Lucas','Aisha','Daniel','Emma','Oliver','Mia','Leo','Hana','Adam','Nora','Ryan','Sara','Owen'];
const lastNames = ['Khan','Malik','Smith','Johnson','Brown','Taylor','Wilson','Ahmed','Patel','Davis','Martin','Lee','Clark','Lewis','Walker','Hall','Young','Allen','Wright','King'];
const locations = [
  ['United States','New York'],['United States','Austin'],['United Kingdom','London'],['Canada','Toronto'],
  ['Australia','Sydney'],['Germany','Berlin'],['France','Paris'],['UAE','Dubai'],['Pakistan','Lahore'],['Pakistan','Islamabad']
];
const sources: AcquisitionSource[] = ['Direct','Social','Search','Referrals'];
const statuses: OrderStatus[] = ['Completed','Processing','Shipped','Pending','Cancelled'];

function rng() {
  return Math.random();
}
function pick<T>(arr: T[]): T { return arr[Math.floor(rng() * arr.length)]; }
function money(n: number) { return Math.round(n * 100) / 100; }
function isoDate(daysAgo: number) {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}
function weightedStatus(): OrderStatus {
  const r = rng();
  if (r < 0.60) return 'Completed';
  if (r < 0.75) return 'Shipped';
  if (r < 0.88) return 'Processing';
  if (r < 0.96) return 'Pending';
  return 'Cancelled';
}

export function generateMockData(): DashboardData {
  const products: Product[] = productNames.map((name, i) => {
    const price = money(15 + rng() * 470);
    const unitsSold = Math.max(8, Math.round(18 + rng() * 260));
    return {
      id: `P-${String(i + 1).padStart(3, '0')}`,
      name,
      category: categories[i % categories.length],
      price,
      unitsSold,
      revenue: money(price * unitsSold * (0.92 + rng() * 0.16)),
      profitMargin: Math.round((18 + rng() * 48) * 10) / 10,
      trend: Math.round((-8 + rng() * 26) * 10) / 10
    };
  });

  const customers: Customer[] = Array.from({ length: 150 }, (_, i) => {
    const [country, city] = pick(locations);
    const name = `${pick(firstNames)} ${pick(lastNames)}`;
    const orders = Math.max(1, Math.round(1 + rng() * 8));
    return {
      id: `C-${String(i + 1).padStart(3, '0')}`,
      name,
      email: `${name.toLowerCase().replace(/ /g, '.')}${i + 1}@example.com`,
      country, city, orders,
      totalSpent: money(45 + rng() * 2200),
      isRepeatCustomer: orders > 1,
      customerSince: isoDate(Math.round(30 + rng() * 700)),
      acquisitionSource: pick(sources)
    };
  });

  const orders: Order[] = Array.from({ length: 260 }, (_, i) => {
    const product = pick(products);
    const customer = pick(customers);
    const quantity = 1 + Math.floor(rng() * 3);
    return {
      id: `ORD-${String(10001 + i)}`,
      productId: product.id,
      product: product.name,
      customerId: customer.id,
      customer: customer.name,
      amount: money(product.price * quantity * (0.96 + rng() * 0.08)),
      date: isoDate(Math.floor(rng() * 45)),
      status: weightedStatus()
    };
  });

  const revenue: RevenueRecord[] = Array.from({ length: 45 }, (_, i) => {
    const date = isoDate(44 - i);
    const dayOrders = Math.round(5 + rng() * 15);
    return {
      date,
      orders: dayOrders,
      revenue: money(dayOrders * (65 + rng() * 185))
    };
  });

  return { products, customers, orders, revenue };
}
