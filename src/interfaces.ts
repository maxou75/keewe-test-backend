export interface Currencies {
  'EUR/EUR': number;
  'EUR/USD': number;
  'USD/EUR': number;
  'USD/USD': number;
  'GBP/USD': number;
  'USD/GBP': number;
  'GBP/GBP': number;
  'EUR/GBP': number;
  'GBP/EUR': number;
}

export interface Conversion {
  currency: string;
  amount: number;
  convertedAmount: number;
}

export interface Payment {
  currency: string;
  paid: number;
  date?: string;
  id?: string;
  status?: string;
}
